import { Prisma } from '@prisma/client';

export class BookRental implements Prisma.BookRentalCreateInput {
  id: string;
  memberId: string;
  bookId: string;
  rentalDate: Date;
  dueDate: Date;
}
