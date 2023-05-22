import { PrismaClient, Decision, PostStatus } from '@internal/prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing database...');
  await prisma.commentModeration.deleteMany();
  await prisma.commentVersion.deleteMany();
  await prisma.postModeration.deleteMany();
  await prisma.postVersion.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();

  await prisma.$executeRaw`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "PostVersion_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "CommentVersion_id_seq" RESTART WITH 1;`;
}

async function main() {
  const userHashes = [
    'user1hash',
    'user2hash',
    'user3hash',
    'user4hash',
    'user5hash',
  ];
  const decisions = [Decision.ACCEPTED, Decision.REJECTED];
  const postStatuses = [
    PostStatus.APPROVED,
    PostStatus.PENDING,
    PostStatus.REJECTED,
  ];

  for (let i = 0; i < 10; i++) {
    // Create posts
    const post = await prisma.post.create({
      data: {
        authorHash: userHashes[i % userHashes.length],
        status: postStatuses[i % postStatuses.length],
        versions: {
          create: {
            title: `Post ${i + 1}`,
            content: `This is the content of post ${i + 1}`,
            status: postStatuses[i % postStatuses.length],
            version: i,
            latest: true,
            timestamp: new Date(`2023-04-${13 + i}T10:00:00Z`),
          },
        },
      },
    });

    // Create comments
    const comment = await prisma.comment.create({
      data: {
        authorHash: userHashes[(i + 1) % userHashes.length],
        post: { connect: { id: post.id } },
        versions: {
          create: {
            content: `This is a comment on post ${i + 1}`,
            status: postStatuses[(i + 1) % postStatuses.length],
            version: i,
            latest: true,
            timestamp: new Date(`2023-04-${13 + i}T10:30:00Z`),
          },
        },
      },
    });

    // Create post moderations
    await prisma.postModeration.create({
      data: {
        postVersionId: post.id,
        moderatorHash: userHashes[(i + 2) % userHashes.length],
        decision: decisions[i % decisions.length],
        reason: `Moderation reason for post ${i + 1}`,
      },
    });

    // Create comment moderations
    await prisma.commentModeration.create({
      data: {
        commentVersionId: comment.id,
        moderatorHash: userHashes[(i + 2) % userHashes.length],
        decision: decisions[i % decisions.length],
        reason: `Moderation reason for comment on post ${i + 1}`,
      },
    });
  }

  await prisma.$disconnect();
  console.log('Seeding completed.');
}

async function run() {
  await clearDatabase();
  await main();
}

run();
