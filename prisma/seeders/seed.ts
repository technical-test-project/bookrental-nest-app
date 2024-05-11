import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // Construct the absolute path to the JSON file
    const bookJsonPath = path.resolve('public/mock/books.json');
    const memberJsonPath = path.resolve('public/mock/members.json');

    // Read seed data from JSON file
    const bookData = JSON.parse(fs.readFileSync(bookJsonPath, 'utf8'));
    const memberData = JSON.parse(fs.readFileSync(memberJsonPath, 'utf8'));

    await prisma.book.createMany({ data: bookData });
    await prisma.member.createMany({ data: memberData });
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
