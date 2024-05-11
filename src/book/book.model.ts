import { Prisma } from '@prisma/client';

export class Book implements Prisma.BookCreateInput {
  id: string;
  code: string;
  title: string;
  author: string;
  stock: number;
}
