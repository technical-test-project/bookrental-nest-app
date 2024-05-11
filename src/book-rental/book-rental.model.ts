import { Prisma } from '@prisma/client';

export class BookRental implements Prisma.BookRentalCreateInput {
  id: string;
  memberCode: string;
  bookCode: string;
  rentalDate: Date;
  dueDate: Date;
}
