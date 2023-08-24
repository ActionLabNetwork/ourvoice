import { Command } from 'commander';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

type Categories = readonly { name: string; description: string }[];

const resetCategoriesTable = async () => {
  console.log('Resetting categories table');
  await prisma.category.deleteMany();
  await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1;`;
};

const addCategories = async (categoriesData: Categories) => {
  // Check for duplicate names in provided data
  const duplicateNames = categoriesData
    .filter(
      (category, index, self) =>
        self.findIndex((c) => c.name === category.name) !== index,
    )
    .map((category) => category.name);

  // Check if category names already exist in the database
  const existingNames = await prisma.category.findMany({
    where: {
      name: {
        in: categoriesData.map((category) => category.name),
      },
    },
    select: {
      name: true,
    },
  });

  const existingNameList = existingNames.map((category) => category.name);

  const allDuplicates = [...new Set([...duplicateNames, ...existingNameList])];

  if (allDuplicates.length) {
    console.log(
      `Duplicate category names found:\n ${allDuplicates
        .map((n) => `- ${n}`)
        .join('\n ')}`,
    );
    console.log('Please remove duplicates and try again.');
    return;
  }

  await Promise.all(
    categoriesData.map((data) => prisma.category.create({ data })),
  );
  console.log('Finished adding categories');
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_MAIN_URL ||
        'postgresql://your_db_user:your_db_password@127.0.0.1:5433/ourvoice_db?schema=ourvoice&sslmode=prefer',
    },
  },
});

const main = () => {
  const program = new Command();

  program.name('categories').description('Categories CLI').version('0.1.0');

  program
    .command('add')
    .description('Populates the main db with categories from the JSON file')
    .argument('<jsonFilePath>', 'Path to JSON file with category data')
    .option('--truncate', 'Overwrite existing categories')
    .option(
      '--append',
      'Append to existing categories (this is the default if no option is provided)',
    )
    .action(async (jsonFilePath, options) => {
      try {
        if (options.truncate && options.append) {
          console.error(
            'Cannot use both --truncate and --append options together.',
          );
          return;
        }

        const categoriesData = JSON.parse(readFileSync(jsonFilePath, 'utf-8'));

        if (options.truncate) {
          await resetCategoriesTable();
        }

        await addCategories(categoriesData);
      } catch (error) {
        console.error('Error processing categories:', error.message);
      } finally {
        await prisma.$disconnect();
      }
    });

  program.parse();
};

main();
