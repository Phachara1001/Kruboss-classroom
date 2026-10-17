const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearMockStudents() {
  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        studentId: {
          not: 'boss'
        }
      }
    })
    console.log(`Deleted ${deleted.count} mock students.`)
    
    // We should also delete all Webboard posts since they might belong to deleted users or be mock
    const deletedPosts = await prisma.post.deleteMany()
    console.log(`Deleted ${deletedPosts.count} mock posts.`)

  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

clearMockStudents()
