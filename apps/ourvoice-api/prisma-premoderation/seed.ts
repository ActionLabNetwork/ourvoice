import { PrismaClient, Decision } from '@internal/prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete records
  await prisma.commentModeration.deleteMany();
  await prisma.postModeration.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userType.deleteMany();

  // Reset autoincrement IDs for PostgreSQL
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "UserType_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1;`;
}

async function main() {
  await clearDatabase();

  // User Types
  const userTypeAdmin = await prisma.userType.create({
    data: { type: 'Admin' },
  });
  const userTypeModerator = await prisma.userType.create({
    data: { type: 'Moderator' },
  });
  const userTypeUser = await prisma.userType.create({ data: { type: 'User' } });

  // Users
  const user1 = await prisma.user.create({
    data: {
      orgId: 1,
      hash: 'user1hash',
      title: 'User 1',
      nickname: 'user1',
      type: { connect: { id: userTypeAdmin.id } },
      active: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      orgId: 2,
      hash: 'user2hash',
      title: 'User 2',
      nickname: 'user2',
      type: { connect: { id: userTypeModerator.id } },
      active: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      orgId: 3,
      hash: 'user3hash',
      title: 'User 3',
      nickname: 'user3',
      type: { connect: { id: userTypeUser.id } },
      active: true,
    },
  });

  // Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Post 1',
      content: 'This is the content of post 1',
      file: 'https://example.com/file1.jpg',
      identifier: 'post-1',
      sequence: 0,
      author: { connect: { id: user1.id } },
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
      file: 'https://example.com/file2.jpg',
      identifier: 'post-2',
      sequence: 0,
      author: { connect: { id: user2.id } },
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
      file: 'https://example.com/file3.jpg',
      identifier: 'post-3',
      sequence: 0,
      author: { connect: { id: user3.id } },
      status: 'PENDING',
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
      author: { connect: { id: user1.id } },
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
      author: { connect: { id: user2.id } },
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
      author: { connect: { id: user1.id } },
      post: { connect: { id: post1.id } },
      parent: { connect: { id: comment1.id } },
    },
  });

  // Post Moderation
  await prisma.postModeration.create({
    data: {
      decision: Decision.ACCEPTED,
      reason: 'This post looks good',
      moderator: { connect: { id: user2.id } },
      post: { connect: { id: post1.id } },
    },
  });

  await prisma.postModeration.create({
    data: {
      decision: Decision.REJECTED,
      reason: 'This post violates our community guidelines',
      moderator: { connect: { id: user1.id } },
      post: { connect: { id: post2.id } },
    },
  });

  // Comment Moderation
  await prisma.commentModeration.create({
    data: {
      decision: Decision.ACCEPTED,
      reason: 'This comment is helpful',
      moderator: { connect: { id: user2.id } },
      comment: { connect: { id: comment1.id } },
    },
  });

  await prisma.commentModeration.create({
    data: {
      decision: Decision.REJECTED,
      reason: 'This comment is inappropriate',
      moderator: { connect: { id: user1.id } },
      comment: { connect: { id: comment2.id } },
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
      author: { connect: { id: user2.id } },
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
  });
