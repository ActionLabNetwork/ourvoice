import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete records
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userType.deleteMany();

  // Reset autoincrement IDs
  await prisma.$executeRaw`ALTER SEQUENCE "Vote_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "UserType_id_seq" RESTART WITH 1;`;
}

async function main() {
  const seedDataPath = join(__dirname, 'seed-data.json');
  const seedData = JSON.parse(readFileSync(seedDataPath, 'utf-8'));

  // User Types
  const userTypeData = seedData.userTypes;
  const userTypes = [];
  for (const data of userTypeData) {
    const userType = await prisma.userType.create({ data });
    userTypes.push(userType);
  }

  // Users
  const userData = seedData.users;
  const users = [];
  for (const data of userData) {
    const { typeId, ...rest } = data;
    const user = await prisma.user.create({
      data: { ...rest, type: { connect: { id: typeId } } },
    });
    users.push(user);
  }

  // Categories
  const categoryData = seedData.categories;
  const categories = [];
  for (const data of categoryData) {
    const category = await prisma.category.create({
      data: {
        ...data,
        parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
      },
    });
    categories.push(category);
  }

  // Posts
  const postData = seedData.posts;
  const posts = [];
  for (const data of postData) {
    const author = users.find((user) => user.id === data.authorId);
    const categoriesToConnect = data.categories
      ? data.categories.map((categoryId) => {
          return { id: categoryId };
        })
      : [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorId, ...rest } = data;
    const post = await prisma.post.create({
      data: {
        ...rest,
        author: { connect: { id: author.id } },
        categories: {
          connect: categoriesToConnect,
        },
      },
    });
    posts.push(post);
  }

  // Comments
  const commentData = seedData.comments;
  const comments = [];
  for (const data of commentData) {
    const author = users.find((user) => user.id === data.authorId);
    const post = posts.find((post) => post.id === data.postId);
    const parentComment = comments.find(
      (comment) => comment.id === data.parentId,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorId, postId, parentId, ...rest } = data;
    const comment = await prisma.comment.create({
      data: {
        ...rest,
        author: { connect: { id: author.id } },
        post: post ? { connect: { id: post.id } } : undefined,
        parent: parentComment
          ? { connect: { id: parentComment.id } }
          : undefined,
      },
    });
    comments.push(comment);
  }

  // Votes
  const voteData = seedData.votes;
  for (const data of voteData) {
    const user = users.find((user) => user.id === data.userId);
    const post = posts.find((post) => post.id === data.postId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, postId, ...rest } = data;
    await prisma.vote.create({
      data: {
        ...rest,
        user: { connect: { id: user.id } },
        post: { connect: { id: post.id } },
      },
    });
  }
}

export const seedMainDb = async () => {
  await clearDatabase();
  // await main()
  //   .catch((e) => {
  //     console.error(e);
  //     process.exit(1);
  //   })
  //   .finally(async () => {
  //     await prisma.$disconnect();
  //   });
};

// Uncomment this to seed using ts-node
// seedMainDb();
