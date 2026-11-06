import { ref } from 'vue'
import { courses } from './courses'
import {
  courseAssignments,
  gradesStore,
  attendanceStore,
  fetchGrades,
  fetchAttendance
} from './gradesStore'
import {
  questsList,
  allQuestProgress,
  fetchQuests,
  fetchQuestProgress,
  fetchAllQuestProgress
} from './questsStore'
import {
  getStudentCoins,
  studentInventory,
  directShopItems,
  boxesList,
  fetchStudentInventory,
  fetchDirectItems,
  fetchBoxes
} from './shopStore'
import { studentsList, fetchStudents, isStudent } from './studentsStore'

const getLedgerStorageKey = (studentId) => `kmutnb_coin_ledger_v1_${studentId}`

export const ledgerRevision = ref(0)
export const isLedgerLoading = ref(false)

export function getSavedLedgerEntries(studentId) {
  if (!studentId) return []
  try {
    const raw = localStorage.getItem(getLedgerStorageKey(studentId))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to read coin ledger from localStorage:', e)
    return []
  }
}

export function recordCoinTransaction(studentId, entry) {
  if (!studentId || !entry || !entry.amount || Number(entry.amount) <= 0) return
  const sId = String(studentId).trim()
  try {
    const list = getSavedLedgerEntries(sId)
    const tx = {
      id: entry.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      refKey: entry.refKey || null,
      type: entry.type === 'expense' ? 'expense' : 'income',
      category: entry.category || (entry.type === 'expense' ? 'shop' : 'teacher'),
      title: entry.title || (entry.type === 'expense' ? 'รายการใช้จ่ายเหรียญ' : 'รายการได้รับเหรียญ'),
      detail: entry.detail || '',
      amount: Math.round(Math.abs(Number(entry.amount))),
      createdAt: entry.createdAt || new Date().toISOString()
    }

    if (tx.refKey) {
      const existingIdx = list.findIndex(item => item.refKey === tx.refKey)
      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...tx }
        localStorage.setItem(getLedgerStorageKey(sId), JSON.stringify(list))
        ledgerRevision.value++
        return
      }
    }

    list.unshift(tx)
    localStorage.setItem(getLedgerStorageKey(sId), JSON.stringify(list.slice(0, 300)))
    ledgerRevision.value++
  } catch (e) {
    console.error('Failed to record coin transaction:', e)
  }
}

export async function syncStudentStatementData(studentId) {
  if (!studentId) return
  const sId = String(studentId).trim()
  isLedgerLoading.value = true
  try {
    const studentObj = studentsList.value.find(
      s => String(s.studentId).trim() === sId || String(s.id).trim() === sId
    )
    const targetCourseIds = Array.isArray(studentObj?.courseIds) && studentObj.courseIds.length > 0
      ? studentObj.courseIds
      : courses.map(c => c.id)

    await Promise.allSettled([
      fetchStudents(),
      fetchDirectItems(),
      fetchBoxes(),
      fetchQuests(),
      fetchQuestProgress(sId),
      fetchStudentInventory(sId),
      ...targetCourseIds.map(cid => fetchGrades(cid)),
      ...targetCourseIds.map(cid => fetchAttendance(cid))
    ])
  } catch (e) {
    console.error('Error syncing student statement data:', e)
  } finally {
    isLedgerLoading.value = false
    ledgerRevision.value++
  }
}

const refundMultiplierMap = {
  Common: 0.1,
  Uncommon: 0.2,
  Rare: 0.3,
  Epic: 0.4,
  Legendary: 0.5,
  Secret: 1.0
}

export function buildStudentCoinStatement(studentId) {
  // Touch reactive dependencies so computed properties auto-update
  void ledgerRevision.value
  if (!studentId) {
    return {
      currentBalance: 0,
      totalReceived: 0,
      totalSpent: 0,
      totalLifetimeCoins: 0,
      incomeCount: 0,
      expenseCount: 0,
      transactions: [],
      categorySummary: {
        income: {},
        expense: {}
      }
    }
  }

  const sId = String(studentId).trim()
  const studentObj = studentsList.value.find(
    s => String(s.studentId).trim() === sId || String(s.id).trim() === sId
  )
  const createdBaseTime = studentObj?.createdAt
    ? new Date(studentObj.createdAt).getTime()
    : Date.now() - 30 * 86400000

  const derivedMap = new Map()

  // 1. Initial Starting Balance (+100 Coins)
  derivedMap.set('initial_start', {
    id: 'tx_initial_start',
    refKey: 'initial_start',
    type: 'income',
    category: 'initial',
    title: 'เหรียญเริ่มต้นสำหรับผู้เรียนใหม่',
    detail: 'ทุนตั้งต้นระบบเศรษฐกิจจำลองดิจิทัล',
    amount: 100,
    createdAt: new Date(createdBaseTime).toISOString(),
    sortOrder: 1
  })

  // 2. Attendance Check-ins (+20 for present, +10 for late)
  const courseIds = courses.map(c => c.id)
  courseIds.forEach((courseId, cIdx) => {
    const courseObj = courses.find(c => c.id === courseId)
    const courseName = courseObj?.name || courseId

    for (let week = 1; week <= 18; week++) {
      const attKey = `${courseId}_${sId}_${week}`
      const rec = attendanceStore.value?.[attKey]
      if (!rec) continue

      if (rec.status === 'present' || rec.status === 'late') {
        const coins = rec.status === 'present' ? 20 : 10
        const statusLabel = rec.status === 'present' ? 'ตรงเวลา' : 'มาสาย'
        const refKey = `att_${courseId}_${week}`
        derivedMap.set(refKey, {
          id: `tx_${refKey}`,
          refKey,
          type: 'income',
          category: 'attendance',
          title: `เช็คชื่อเข้าเรียน สัปดาห์ที่ ${week} (${statusLabel})`,
          detail: `วิชา${courseName} (${courseId})${rec.checkedAt && rec.checkedAt !== '-' ? ` เวลา ${rec.checkedAt}` : ''}`,
          amount: coins,
          createdAt: new Date(createdBaseTime + (week * 7 + cIdx) * 86400000).toISOString(),
          sortOrder: 10 + week
        })
      }
    }
  })

  // 3. Graded Assignments (score * 4 Coins)
  courseIds.forEach((courseId, cIdx) => {
    const gradeKey = `${courseId}_${sId}`
    const studentGrade = gradesStore.value?.[gradeKey]
    if (!studentGrade || !studentGrade.assignments) return

    const courseObj = courses.find(c => c.id === courseId)
    const courseName = courseObj?.name || courseId
    const assignmentsList = courseAssignments[courseId] || []

    Object.entries(studentGrade.assignments).forEach(([asmId, scoreVal], aIdx) => {
      const score = Number(scoreVal)
      if (isNaN(score) || score <= 0) return

      const coins = Math.round(score * 4)
      if (coins <= 0) return

      const asmObj = assignmentsList.find(a => a.id === asmId)
      const asmTitle = asmObj?.title || `ใบงาน ${asmId}`
      const maxScore = asmObj?.maxScore || 10
      const weekNum = asmObj?.week || aIdx + 1
      const refKey = `grade_${courseId}_${asmId}`

      derivedMap.set(refKey, {
        id: `tx_${refKey}`,
        refKey,
        type: 'income',
        category: 'assignment',
        title: `รางวัลคะแนน${asmTitle}`,
        detail: `วิชา${courseName} | ได้คะแนน ${score}/${maxScore} คะแนน`,
        amount: coins,
        createdAt: new Date(createdBaseTime + (weekNum * 7 + cIdx + 2) * 86400000).toISOString(),
        sortOrder: 30 + weekNum
      })
    })
  })

  // 4. Weekly Quests Completed
  questsList.value.forEach((quest, qIdx) => {
    const compKey = `${sId}_${quest.id}`
    const completions = Number(allQuestProgress.value?.[compKey]) || 0
    if (completions <= 0 || !Array.isArray(quest.rewards)) return

    quest.rewards.forEach((reward, rIdx) => {
      if (reward.type === 'coin' && Number(reward.amount) > 0) {
        const totalQuestCoins = Math.round(Number(reward.amount) * completions)
        const refKey = `quest_${quest.id}_${rIdx}`
        derivedMap.set(refKey, {
          id: `tx_${refKey}`,
          refKey,
          type: 'income',
          category: 'quest',
          title: `สำเร็จภารกิจ: ${quest.title}`,
          detail: completions > 1
            ? `ทำภารกิจสำเร็จ ${completions} ครั้ง (ครั้งละ ${reward.amount} Coins)`
            : (quest.description || 'ภารกิจประจำสัปดาห์'),
          amount: totalQuestCoins,
          createdAt: quest.updatedAt || quest.createdAt || new Date(createdBaseTime + (qIdx + 5) * 86400000).toISOString(),
          sortOrder: 50 + qIdx
        })
      }
    })
  })

  // 5. Inventory Purchases (Direct Shop & Gacha Pulls)
  const invList = studentInventory.value?.[sId] || []
  invList.forEach((inv, iIdx) => {
    const item = inv.item || {}
    if (!item || item.id === 'frame-teacher-exclusive') return
    if (inv.boxName === 'System' || inv.boxName === 'รางวัลภารกิจ' || inv.boxName === 'เควสต์และภารกิจ') return
    if (String(inv.boxId || '').startsWith('quest')) return

    const count = Math.max(1, Number(inv.count) || 1)
    const obtainedIso = inv.obtainedAt || new Date(createdBaseTime + (iIdx + 8) * 86400000).toISOString()

    const isDirect =
      inv.boxName === 'Direct Shop' ||
      inv.boxName === 'ร้านค้าโดยตรง' ||
      inv.boxId === 'direct' ||
      (!inv.boxName && directShopItems.value.some(d => d.id === item.id))

    if (isDirect) {
      const shopMatch = directShopItems.value.find(d => d.id === item.id || d.name === item.name)
      const unitPrice = Number(item.price) || Number(shopMatch?.price) || 350
      const totalCost = unitPrice * count
      if (totalCost > 0) {
        const refKey = `shop_direct_${item.id}`
        derivedMap.set(refKey, {
          id: `tx_${refKey}`,
          refKey,
          type: 'expense',
          category: 'shop',
          title: `ซื้อไอเทมร้านค้า: ${item.name || 'ไอเทมตกแต่ง'}`,
          detail: `${item.category || (item.itemType === 'frame' ? 'กรอบรูปโปรไฟล์' : 'ไอเทมร้านค้า')} (${item.rarity || 'Rare'})`,
          amount: totalCost,
          createdAt: obtainedIso,
          sortOrder: 70 + iIdx
        })
      }
    } else {
      // Mystery Box / Gacha Pull
      const matchedBox = boxesList.value.find(
        b => b.id === inv.boxId || b.name === inv.boxName
      )
      const boxPrice = Number(matchedBox?.price) || 150
      const totalBoxCost = boxPrice * count
      const refKey = `gacha_pull_${item.id}`

      derivedMap.set(refKey, {
        id: `tx_${refKey}`,
        refKey,
        type: 'expense',
        category: 'gacha',
        title: `เปิดกล่องสุ่ม: ${inv.boxName || matchedBox?.name || 'Mystery Box'}`,
        detail: count > 1
          ? `สุ่มได้ "${item.name}" (${item.rarity || 'Common'}) จำนวน ${count} ครั้ง`
          : `สุ่มได้ "${item.name}" (${item.rarity || 'Common'})`,
        amount: totalBoxCost,
        createdAt: obtainedIso,
        sortOrder: 80 + iIdx
      })

      // If count > 1, add duplicate refund entry
      if (count > 1) {
        const dupCount = count - 1
        const mult = refundMultiplierMap[item.rarity] || 0.1
        const refundPerDup = Math.max(1, Math.round(boxPrice * mult))
        const totalRefund = refundPerDup * dupCount
        const refundKey = `gacha_refund_${item.id}`
        derivedMap.set(refundKey, {
          id: `tx_${refundKey}`,
          refKey: refundKey,
          type: 'income',
          category: 'refund',
          title: `รับเหรียญคืนจากไอเทมซ้ำ: ${item.name}`,
          detail: `ได้รับไอเทมซ้ำ ${dupCount} ชิ้น จากกล่อง ${inv.boxName || matchedBox?.name || 'Mystery Box'}`,
          amount: totalRefund,
          createdAt: obtainedIso,
          sortOrder: 81 + iIdx
        })
      }
    }
  })

  // 6. Merge explicit saved transactions from localStorage
  const savedEntries = getSavedLedgerEntries(sId)
  savedEntries.forEach((saved, sIdx) => {
    const key = saved.refKey || saved.id || `saved_${sIdx}`
    if (!derivedMap.has(key)) {
      derivedMap.set(key, {
        ...saved,
        sortOrder: 100 + sIdx
      })
    }
  })

  const allItems = Array.from(derivedMap.values())

  // 7. Reconcile with actual live coin balance so Statement math is 100% exact
  const currentBalance = getStudentCoins(sId)
  let sumIncome = 0
  let sumExpense = 0

  allItems.forEach(item => {
    if (item.type === 'income') sumIncome += Number(item.amount) || 0
    else sumExpense += Number(item.amount) || 0
  })

  const netCalculated = sumIncome - sumExpense
  const diff = currentBalance - netCalculated

  if (diff > 0) {
    allItems.push({
      id: 'tx_reconcile_bonus',
      refKey: 'reconcile_bonus',
      type: 'income',
      category: 'teacher',
      title: 'เหรียญโบนัสและรางวัลพิเศษจากอาจารย์',
      detail: 'รายการมอบเหรียญสะสมจากกิจกรรมในชั้นเรียนและการปรับปรุงยอด',
      amount: diff,
      createdAt: studentObj?.updatedAt || new Date().toISOString(),
      sortOrder: 95
    })
    sumIncome += diff
  } else if (diff < 0) {
    const absDiff = Math.abs(diff)
    allItems.push({
      id: 'tx_reconcile_spent',
      refKey: 'reconcile_spent',
      type: 'expense',
      category: 'shop',
      title: 'รายการใช้จ่ายและแลกของรางวัลสะสม',
      detail: 'รายการหักเหรียญจากกิจกรรมหรือการแลกไอเทมก่อนหน้า',
      amount: absDiff,
      createdAt: studentObj?.updatedAt || new Date().toISOString(),
      sortOrder: 95
    })
    sumExpense += absDiff
  }

  // Sort newest first, keeping initial_start at the very bottom (oldest)
  allItems.sort((a, b) => {
    if (a.refKey === 'initial_start') return 1
    if (b.refKey === 'initial_start') return -1
    const tA = new Date(a.createdAt || 0).getTime()
    const tB = new Date(b.createdAt || 0).getTime()
    if (tB !== tA) return tB - tA
    return (b.sortOrder || 0) - (a.sortOrder || 0)
  })

  // Calculate running balance after each transaction (from oldest to newest)
  const chronological = [...allItems].reverse()
  let running = 0
  chronological.forEach(item => {
    if (item.type === 'income') {
      running += Number(item.amount) || 0
    } else {
      running = Math.max(0, running - (Number(item.amount) || 0))
    }
    item.balanceAfter = running
    item.studentId = sId
    item.studentName = studentObj?.name || sId
    item.studentClassroom = studentObj?.classroom || ''
    item.studentAvatar = studentObj?.avatar || ''
    item.studentFrame = studentObj?.equippedFrame || ''
  })

  // Category summaries
  const categorySummary = {
    income: {
      assignment: 0,
      attendance: 0,
      quest: 0,
      teacher: 0,
      refund: 0,
      initial: 0
    },
    expense: {
      shop: 0,
      gacha: 0,
      teacher: 0
    }
  }

  let incomeCount = 0
  let expenseCount = 0

  allItems.forEach(item => {
    const amt = Number(item.amount) || 0
    if (item.type === 'income') {
      incomeCount++
      const cat = item.category in categorySummary.income ? item.category : 'teacher'
      categorySummary.income[cat] += amt
    } else {
      expenseCount++
      const cat = item.category in categorySummary.expense ? item.category : 'shop'
      categorySummary.expense[cat] += amt
    }
  })

  return {
    currentBalance,
    totalReceived: sumIncome,
    totalSpent: sumExpense,
    totalLifetimeCoins: sumIncome,
    incomeCount,
    expenseCount,
    transactions: allItems,
    categorySummary
  }
}

export async function syncAllStudentsStatementData() {
  isLedgerLoading.value = true
  try {
    const allCourseIds = courses.map(c => c.id)
    await Promise.allSettled([
      fetchStudents(),
      fetchDirectItems(),
      fetchBoxes(),
      fetchQuests(),
      fetchAllQuestProgress(),
      ...allCourseIds.map(cid => fetchGrades(cid)),
      ...allCourseIds.map(cid => fetchAttendance(cid))
    ])

    const allStudents = studentsList.value.filter(s => isStudent(s))
    await Promise.allSettled(
      allStudents.map(s => fetchStudentInventory(s.studentId || s.id))
    )
  } catch (e) {
    console.error('Error syncing all students statement data:', e)
  } finally {
    isLedgerLoading.value = false
    ledgerRevision.value++
  }
}

export function buildSystemCoinOverview(classroomFilter = 'all') {
  void ledgerRevision.value

  const allStudents = studentsList.value.filter(s => isStudent(s))
  const targetStudents =
    classroomFilter && classroomFilter !== 'all'
      ? allStudents.filter(s => s.classroom === classroomFilter)
      : allStudents

  let totalCurrentBalance = 0
  let totalReceived = 0
  let totalSpent = 0
  let incomeCount = 0
  let expenseCount = 0

  const categorySummary = {
    income: {
      assignment: 0,
      attendance: 0,
      quest: 0,
      teacher: 0,
      refund: 0,
      initial: 0
    },
    expense: {
      shop: 0,
      gacha: 0,
      teacher: 0
    }
  }

  const classroomMap = new Map()
  const studentSummaries = []
  const allTransactions = []

  // First compute classroom breakdown across all students so classroom cards always show all rooms
  allStudents.forEach(s => {
    const sId = String(s.studentId || s.id || '').trim()
    if (!sId) return
    const st = buildStudentCoinStatement(sId)
    const room = s.classroom || 'ไม่ระบุห้อง'

    if (!classroomMap.has(room)) {
      classroomMap.set(room, {
        classroom: room,
        studentCount: 0,
        currentBalance: 0,
        totalReceived: 0,
        totalSpent: 0,
        txCount: 0
      })
    }
    const rObj = classroomMap.get(room)
    rObj.studentCount += 1
    rObj.currentBalance += st.currentBalance
    rObj.totalReceived += st.totalReceived
    rObj.totalSpent += st.totalSpent
    rObj.txCount += st.transactions.length
  })

  // Now aggregate for targetStudents (filtered by classroomFilter if selected)
  targetStudents.forEach(s => {
    const sId = String(s.studentId || s.id || '').trim()
    if (!sId) return
    const st = buildStudentCoinStatement(sId)

    totalCurrentBalance += st.currentBalance
    totalReceived += st.totalReceived
    totalSpent += st.totalSpent
    incomeCount += st.incomeCount
    expenseCount += st.expenseCount

    Object.keys(categorySummary.income).forEach(k => {
      categorySummary.income[k] += st.categorySummary.income[k] || 0
    })
    Object.keys(categorySummary.expense).forEach(k => {
      categorySummary.expense[k] += st.categorySummary.expense[k] || 0
    })

    studentSummaries.push({
      student: s,
      studentId: sId,
      name: s.name,
      classroom: s.classroom,
      avatar: s.avatar,
      equippedFrame: s.equippedFrame,
      currentBalance: st.currentBalance,
      totalReceived: st.totalReceived,
      totalSpent: st.totalSpent,
      incomeCount: st.incomeCount,
      expenseCount: st.expenseCount,
      txCount: st.transactions.length
    })

    st.transactions.forEach(tx => {
      allTransactions.push({
        ...tx,
        id: `${sId}_${tx.id}`,
        studentId: sId,
        studentName: s.name,
        studentClassroom: s.classroom,
        studentAvatar: s.avatar,
        studentFrame: s.equippedFrame
      })
    })
  })

  allTransactions.sort((a, b) => {
    if (a.refKey === 'initial_start' && b.refKey !== 'initial_start') return 1
    if (b.refKey === 'initial_start' && a.refKey !== 'initial_start') return -1
    const tA = new Date(a.createdAt || 0).getTime()
    const tB = new Date(b.createdAt || 0).getTime()
    if (tB !== tA) return tB - tA
    return (b.sortOrder || 0) - (a.sortOrder || 0)
  })

  studentSummaries.sort((a, b) => b.totalReceived - a.totalReceived || b.currentBalance - a.currentBalance)

  const classroomBreakdown = Array.from(classroomMap.values()).sort((a, b) =>
    a.classroom.localeCompare(b.classroom)
  )

  return {
    totalStudents: targetStudents.length,
    totalCurrentBalance,
    totalReceived,
    totalSpent,
    totalLifetimeCoins: totalReceived,
    incomeCount,
    expenseCount,
    categorySummary,
    classroomBreakdown,
    studentSummaries,
    allTransactions
  }
}


