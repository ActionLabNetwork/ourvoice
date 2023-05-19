import { PrismaClient, Decision } from '@internal/prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing database...');
  // Delete records
  await prisma.commentModeration.deleteMany();
  await prisma.postModeration.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();

  // Reset autoincrement IDs for PostgreSQL
  await prisma.$executeRaw`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1;`;
}

async function main() {
  await clearDatabase();

  // Users' Hashes
  const user1hash = 'user1hash';
  const user2hash = 'user2hash';
  const user3hash = 'user3hash';

  // Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Post 1',
      content: 'This is the content of post 1',
      files: ['https://example.com/file1.jpg'],
      sequence: 0,
      authorHash: user1hash,
      status: 'PENDING',
      version: 1,
      timestamp: new Date('2023-04-13T10:00:00Z'),
      latest: true,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Post 2',
      content: 'This is the content of post 2',
      files: ['https://example.com/file2.jpg'],
      sequence: 0,
      authorHash: user2hash,
      status: 'PENDING',
      version: 1,
      timestamp: new Date('2023-04-13T11:00:00Z'),
      latest: true,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Post 3',
      content: 'This is the content of post 3',
      files: ['https://example.com/file3.jpg'],
      sequence: 0,
      authorHash: user3hash,
      status: 'REJECTED',
      version: 0,
      timestamp: new Date('2023-04-14T10:00:00Z'),
      latest: true,
    },
  });

  // Comments
  const comment1 = await prisma.comment.create({
    data: {
      content: 'This is a comment on post 1',
      status: 'PENDING',
      version: 1,
      timestamp: new Date('2023-04-13T10:30:00Z'),
      latest: true,
      authorHash: user1hash,
      post: { connect: { id: post1.id } },
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'This is a comment on post 2',
      status: 'PENDING',
      version: 1,
      timestamp: new Date('2023-04-13T11:30:00Z'),
      latest: true,
      authorHash: user2hash,
      post: { connect: { id: post2.id } },
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: 'This is a reply to comment 1',
      status: 'PENDING',
      version: 0,
      timestamp: new Date('2023-04-14T10:30:00Z'),
      latest: true,
      authorHash: user3hash,
      post: { connect: { id: post1.id } },
      parent: { connect: { id: comment1.id } },
    },
  });

  // Post Moderation
  await prisma.postModeration.create({
    data: {
      decision: Decision.ACCEPTED,
      reason: 'This post looks good',
      moderatorHash: user2hash,
      post: { connect: { id: post1.id } },
    },
  });

  await prisma.postModeration.create({
    data: {
      decision: Decision.REJECTED,
      reason: 'This post violates our community guidelines',
      moderatorHash: user1hash,
      post: { connect: { id: post2.id } },
      modifiedTitle: 'More appropriate title',
      modifiedContent: 'Modified content',
    },
  });

  // Comment Moderation
  await prisma.commentModeration.create({
    data: {
      decision: Decision.ACCEPTED,
      reason: 'This comment is helpful',
      moderatorHash: user2hash,
      comment: { connect: { id: comment1.id } },
    },
  });

  await prisma.commentModeration.create({
    data: {
      decision: Decision.REJECTED,
      reason: 'This comment is inappropriate',
      moderatorHash: user1hash,
      comment: { connect: { id: comment2.id } },
      modifiedTitle: 'Less inappropriate title',
      modifiedContent: 'Less inappropriate content',
    },
  });

  // Comment to Comment
  await prisma.comment.create({
    data: {
      content: 'This is a reply to comment 3',
      status: 'PENDING',
      version: 0,
      timestamp: new Date('2023-04-14T11:00:00Z'),
      latest: true,
      authorHash: user2hash,
      post: { connect: { id: post1.id } },
      parent: { connect: { id: comment3.id } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding Completed.');
  });
