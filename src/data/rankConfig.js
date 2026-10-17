// Rank Tiers Configuration based on Thai Vocational Grade Scales (4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0)
// Ranked from Highest to Lowest
export const rankTiers = [
  {
    grade: "4.0",
    letter: "A",
    minScore: 80,
    maxScore: 100,
    name: "Omniverse",
    thaiTitle: "ออมนิเวิร์ส",
    badgeImg: "/img/Rank/1.Omniverse.png",
    themeGradient: "from-amber-400 via-orange-500 to-rose-600",
    cardGradient: "from-amber-950/60 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(251,191,36,0.45)]",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-400/40",
    description:
      "ระดับสูงสุดแห่งความเป็นเลิศทางวิชาการและทักษะปฏิบัติ ผลงานยอดเยี่ยมในทุกมิติ",
    rankNumber: 1,
  },
  {
    grade: "3.5",
    letter: "B+",
    minScore: 75,
    maxScore: 79.9,
    name: "Pulsar",
    thaiTitle: "พัลซาร์",
    badgeImg: "/img/Rank/2.Pulsar.png",
    themeGradient: "from-violet-400 via-purple-500 to-indigo-600",
    cardGradient: "from-purple-950/60 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(168,85,247,0.45)]",
    textColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-400/40",
    description:
      "ระดับดีมาก มีความสามารถสูง ความรับผิดชอบโดดเด่น ใกล้แตะระดับจักรวาลสูงสุด",
    rankNumber: 2,
  },
  {
    grade: "3.0",
    letter: "B",
    minScore: 70,
    maxScore: 74.9,
    name: "Hyperion",
    thaiTitle: "ไฮเปอเรียน",
    badgeImg: "/img/Rank/3.Hyperion.png",
    themeGradient: "from-cyan-400 via-blue-500 to-indigo-600",
    cardGradient: "from-blue-950/60 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(59,130,246,0.45)]",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-400/40",
    description:
      "ระดับดี ผลการปฏิบัติงานตามเป้าหมาย มีวินัยการเข้าเรียนและส่งงานสม่ำเสมอ",
    rankNumber: 3,
  },
  {
    grade: "2.5",
    letter: "C+",
    minScore: 65,
    maxScore: 69.9,
    name: "Photon",
    thaiTitle: "โฟตอน",
    badgeImg: "/img/Rank/4.Photon.png",
    themeGradient: "from-emerald-400 via-teal-500 to-cyan-600",
    cardGradient: "from-teal-950/60 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(20,184,166,0.45)]",
    textColor: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-400/40",
    description:
      "ระดับดีพอใช้ มีความมุ่งมั่นพัฒนาทักษะ พร้อมก้าวขึ้นสู่ระดับถัดไป",
    rankNumber: 4,
  },
  {
    grade: "2.0",
    letter: "C",
    minScore: 60,
    maxScore: 64.9,
    name: "Spark",
    thaiTitle: "สปาร์ก",
    badgeImg: "/img/Rank/5.Spark.png",
    themeGradient: "from-yellow-400 via-amber-500 to-orange-600",
    cardGradient: "from-amber-950/50 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(245,158,11,0.45)]",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-400/40",
    description:
      "ระดับพอใช้ จุดประกายความรู้พื้นฐาน ฝึกฝนเพิ่มเติมเพื่อยกระดับทักษะ",
    rankNumber: 5,
  },
  {
    grade: "1.5",
    letter: "D+",
    minScore: 55,
    maxScore: 59.9,
    name: "Cinder",
    thaiTitle: "ซินเดอร์",
    badgeImg: "/img/Rank/6.Cinder.png",
    themeGradient: "from-orange-400 via-rose-500 to-red-600",
    cardGradient: "from-orange-950/50 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(249,115,22,0.45)]",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-400/40",
    description:
      "ระดับผ่านเกณฑ์ขั้นต่ำ ควรเพิ่มเวลาทบทวนบทเรียนและเข้าเรียนให้ตรงเวลา",
    rankNumber: 6,
  },
  {
    grade: "1.0",
    letter: "D",
    minScore: 50,
    maxScore: 54.9,
    name: "Ember",
    thaiTitle: "เอมเบอร์",
    badgeImg: "/img/Rank/7.Ember.png",
    color: "from-rose-400 via-red-500 to-stone-600",
    themeGradient: "from-rose-400 via-red-500 to-stone-600",
    cardGradient: "from-rose-950/50 via-stone-900 to-stone-950",
    badgeGlow: "shadow-[0_0_35px_rgba(244,63,94,0.45)]",
    textColor: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-400/40",
    description:
      "จุดเริ่มต้นแห่งการเดินทาง เร่งสะสมผลงาน ส่งใบงาน และเช็คชื่อเพื่อเลื่อนขั้น",
    rankNumber: 7,
  },
];

export const unrankedTier = {
  grade: "0",
  letter: "F",
  minScore: 0,
  maxScore: 49.9,
  name: "Unranked",
  thaiTitle: "ยังไม่มีแรงค์",
  badgeImg: null,
  themeGradient: "from-stone-500 to-stone-700",
  cardGradient: "from-stone-900 via-stone-900 to-stone-950",
  badgeGlow: "shadow-none",
  textColor: "text-stone-400",
  bgColor: "bg-stone-500/10",
  borderColor: "border-stone-500/40",
  description:
    "ยังไม่ได้ปลดล็อกแรงค์ หรือคะแนนสะสมต่ำกว่าเกณฑ์ขั้นต่ำ 50 คะแนน ส่งงานและเข้าเรียนเพื่อเริ่มจัดอันดับ",
  rankNumber: 8,
};

// Get Rank based on total score (or grade)
export const getStudentRank = (totalScore) => {
  const score = Math.round(Number(totalScore) * 10) / 10;
  if (score >= 80) return rankTiers[0]; // 4.0 Omniverse
  if (score >= 75) return rankTiers[1]; // 3.5 Pulsar
  if (score >= 70) return rankTiers[2]; // 3.0 Hyperion
  if (score >= 65) return rankTiers[3]; // 2.5 Photon
  if (score >= 60) return rankTiers[4]; // 2.0 Spark
  if (score >= 55) return rankTiers[5]; // 1.5 Cinder
  if (score >= 50) return rankTiers[6]; // 1.0 Ember
  return unrankedTier; // 0 Unranked
};

// Get Next Rank info (without revealing exact numeric scores)
export const getNextRankInfo = (currentRank) => {
  if (!currentRank || currentRank.rankNumber === 1) {
    return {
      hasNext: false,
      nextRank: null,
      message:
        "คุณอยู่ในระดับขั้นสูงสุดของรายวิชานี้แล้ว รักษาผลงานอันยอดเยี่ยมนี้ไว้!",
    };
  }

  // If Unranked (rankNumber 8), next is Ember (rankNumber 7)
  const targetRankIndex =
    currentRank.rankNumber === 8
      ? rankTiers.length - 1
      : currentRank.rankNumber - 2;

  const nextRank = rankTiers[targetRankIndex];

  return {
    hasNext: true,
    nextRank,
    message: `เป้าหมายถัดไป: ปลดล็อกระดับขั้น ${nextRank.name} (${nextRank.thaiTitle})`,
  };
};

// All tiers including unranked
export const allTiersList = [...rankTiers, unrankedTier];

// Milestones for EXP Road track (0 -> 80+)
export const rankMilestones = [
  { score: 0, name: 'Unranked', grade: '0', letter: 'F', badgeImg: null },
  { score: 50, name: 'Ember', grade: '1.0', letter: 'D', badgeImg: '/img/Rank/7.Ember.png' },
  { score: 55, name: 'Cinder', grade: '1.5', letter: 'D+', badgeImg: '/img/Rank/6.Cinder.png' },
  { score: 60, name: 'Spark', grade: '2.0', letter: 'C', badgeImg: '/img/Rank/5.Spark.png' },
  { score: 65, name: 'Photon', grade: '2.5', letter: 'C+', badgeImg: '/img/Rank/4.Photon.png' },
  { score: 70, name: 'Hyperion', grade: '3.0', letter: 'B', badgeImg: '/img/Rank/3.Hyperion.png' },
  { score: 75, name: 'Pulsar', grade: '3.5', letter: 'B+', badgeImg: '/img/Rank/2.Pulsar.png' },
  { score: 80, name: 'Omniverse', grade: '4.0', letter: 'A', badgeImg: '/img/Rank/1.Omniverse.png' }
];

// Detailed EXP progress and score spoiler per tier
export const getStudentExpProgress = (totalScore) => {
  const score = Math.round(Number(totalScore || 0) * 10) / 10;
  const currentRank = getStudentRank(score);
  
  if (currentRank.rankNumber === 1) {
    const min = 80;
    const max = 100;
    const percent = Math.min(100, Math.max(0, Math.round(((score - min) / (max - min)) * 100)));
    return {
      currentScore: score,
      currentRank,
      isMaxRank: true,
      nextRank: null,
      neededScore: 0,
      tierMin: 80,
      tierMax: 100,
      progressPercent: Math.max(percent, 10),
      globalPercent: Math.min(100, Math.max(0, score)),
      message: 'คุณบรรลุระดับขั้น OMNIVERSE แล้ว! (ระดับจักรวาลสูงสุด)'
    };
  }

  const nextRank = currentRank.rankNumber === 8 
    ? rankTiers[rankTiers.length - 1] 
    : rankTiers[currentRank.rankNumber - 2];

  const tierMin = currentRank.minScore;
  const tierMax = nextRank.minScore;
  const neededScore = Math.max(0, Math.round((tierMax - score) * 10) / 10);
  
  const range = Math.max(1, tierMax - tierMin);
  const gained = Math.max(0, score - tierMin);
  const progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));

  return {
    currentScore: score,
    currentRank,
    isMaxRank: false,
    nextRank,
    neededScore,
    tierMin,
    tierMax,
    progressPercent,
    globalPercent: Math.min(100, Math.max(0, score)),
    message: `ต้องการอีก ${neededScore} EXP เพื่อเลื่อนขั้นสู่ ${nextRank.name} (${nextRank.thaiTitle})`
  };
};
