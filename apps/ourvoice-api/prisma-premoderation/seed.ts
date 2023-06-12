import { PrismaClient, Decision, PostStatus } from '@internal/prisma/client';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

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
  await prisma.$executeRaw`ALTER SEQUENCE "PostModeration_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "CommentModeration_id_seq" RESTART WITH 1;`;
}

async function main() {
  const decisions = [Decision.ACCEPTED, Decision.REJECTED];
  const postStatuses = [
    PostStatus.APPROVED,
    PostStatus.PENDING,
    PostStatus.REJECTED,
  ];

  for (let i = 0; i < 10; i++) {
    const authorHash = `user${i + 1}hash`;

    const post = await prisma.post.create({
      data: {
        authorHash,
        authorNickname: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          seed: authorHash,
        }),
        status: postStatuses[i % postStatuses.length],
        versions: {
          create: Array(3)
            .fill({})
            .map((_, versionIndex) => ({
              title: `Post ${i + 1}`,
              content: `This is the content of post ${i + 1}. This is version ${
                versionIndex + 1
              }`,
              categoryIds: [1, 2],
              status: postStatuses[(i + versionIndex) % postStatuses.length],
              version: versionIndex + 1,
              authorHash,
              authorNickname: authorHash,
              reason: versionIndex > 0 ? 'Modified by moderator' : '',
              latest: versionIndex === 2,
              timestamp: new Date(`2023-04-${13 + i}T10:00:00Z`),
            })),
        },
      },
    });

    const moderatorHash = `moderator${i + 1}hash`;

    // Create multiple comments for a post and child comments for each comment
    for (let j = 0; j < 3; j++) {
      const commentAuthorHash = `commentAuthor${j + 1}hash`;

      const comment = await prisma.comment.create({
        data: {
          authorHash: commentAuthorHash,
          authorNickname: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            seed: authorHash,
          }),
          post: { connect: { id: post.id } },
          versions: {
            create: Array(3)
              .fill({})
              .map((_, versionIndex) => ({
                content: `This is a comment on post ${i + 1}. This is version ${
                  versionIndex + 1
                }`,
                status: postStatuses[(j + versionIndex) % postStatuses.length],
                version: versionIndex + 1,
                authorHash: commentAuthorHash,
                authorNickname: commentAuthorHash,
                reason: versionIndex > 0 ? 'Modified by moderator' : '',
                latest: versionIndex === 2,
                timestamp: new Date(`2023-04-${13 + i + j}T10:30:00Z`),
              })),
          },
        },
      });

      // Create child comment for the comment
      const childCommentAuthorHash = `childCommentAuthor${j + 1}hash`;

      await prisma.comment.create({
        data: {
          authorHash: childCommentAuthorHash,
          authorNickname: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            seed: authorHash,
          }),
          parent: { connect: { id: comment.id } },
          post: { connect: { id: post.id } },
          versions: {
            create: {
              content: `This is a child comment of comment ${j + 1} on post ${
                i + 1
              }`,
              status: postStatuses[j % postStatuses.length],
              version: 1,
              authorHash: childCommentAuthorHash,
              authorNickname: childCommentAuthorHash,
              latest: true,
              timestamp: new Date(`2023-04-${13 + i + j}T10:40:00Z`),
            },
          },
        },
      });

      await prisma.postModeration.create({
        data: {
          postVersionId: post.id,
          moderatorHash,
          moderatorNickname: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            seed: moderatorHash,
          }),
          decision: decisions[i % decisions.length],
          reason: `Moderation reason for post ${i + 1}`,
        },
      });

      await prisma.commentModeration.create({
        data: {
          commentVersionId: comment.id,
          moderatorHash,
          moderatorNickname: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            seed: moderatorHash,
          }),
          decision: decisions[i % decisions.length],
          reason: `Moderation reason for comment on post ${i + 1}`,
        },
      });
    }
  }

  await prisma.$disconnect();
  console.log('Seeding completed.');
}

async function run() {
  await clearDatabase();
  await main();
}

run();
