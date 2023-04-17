import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete records
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userType.deleteMany();
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
      moderated: true,
      published: true,
      votesUp: 5,
      votesDown: 1,
      author: { connect: { id: user1.id } },
      createdAt: new Date('2023-04-13T10:00:00Z'),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Post 2',
      content: 'This is the content of post 2',
      file: 'https://example.com/file2.jpg',
      moderated: true,
      published: true,
      votesUp: 2,
      votesDown: 0,
      author: { connect: { id: user2.id } },
      createdAt: new Date('2023-04-13T11:00:00Z'),
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Post 3',
      content: 'This is the content of post 3',
      file: 'https://example.com/file3.jpg',
      moderated: false,
      published: false,
      votesUp: 0,
      votesDown: 0,
      author: { connect: { id: user3.id } },
      createdAt: new Date('2023-04-14T10:00:00Z'),
    },
  });

  // Comments
  const comment1 = await prisma.comment.create({
    data: {
      content: 'This is a comment on post 1',
      moderated: true,
      published: true,
      author: { connect: { id: user1.id } },
      post: { connect: { id: post1.id } },
      createdAt: new Date('2023-04-13T10:30:00Z'),
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'This is a comment on post 2',
      moderated: true,
      published: true,
      author: { connect: { id: user2.id } },
      post: { connect: { id: post2.id } },
      createdAt: new Date('2023-04-13T11:30:00Z'),
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: 'This is a reply to comment 1',
      moderated: false,
      published: false,
      author: { connect: { id: user1.id } },
      post: { connect: { id: post1.id } },
      parent: { connect: { id: comment1.id } },
      createdAt: new Date('2023-04-14T10:30:00Z'),
    },
  });

  // Categories
  const category1 = await prisma.category.create({
    data: {
      name: 'Category 1',
      description: 'This is the description of Category 1',
      weight: 2,
      active: true,
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Category 2',
      weight: 1,
      parent: { connect: { id: category1.id } },
      active: true,
    },
  });

  // Votes
  const vote1 = await prisma.vote.create({
    data: {
      user: { connect: { id: user1.id } },
      post: { connect: { id: post1.id } },
      voteType: 'UPVOTE',
    },
  });

  const vote2 = await prisma.vote.create({
    data: {
      user: { connect: { id: user2.id } },
      post: { connect: { id: post1.id } },
      voteType: 'DOWNVOTE',
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
