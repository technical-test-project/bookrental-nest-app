import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookRental } from '@prisma/client';
import { CreateBookRentalDto } from './dto/create-book-rental.dto';
import { Penalty } from '../penalty/penalty.model';
import { ReturnBookRentalDto } from './dto/return-book-rental.dto';
import { BookService } from '../book/book.service';

@Injectable()
export class BookRentalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BookService,
  ) {}

  async findAll(): Promise<BookRental[]> {
    return this.prismaService.bookRental.findMany();
  }

  async storeBookRental(
    createBookRentalDto: CreateBookRentalDto,
  ): Promise<false | BookRental> {
    const countBookRental: number = await this.prismaService.bookRental.count({
      where: {
        memberCode: createBookRentalDto.memberCode,
      },
    });

    const memberIsPenalized: Penalty =
      await this.prismaService.penalty.findFirst({
        where: {
          memberCode: createBookRentalDto.memberCode,
        },
      });

    // Members may not borrow more than 2 books
    if (countBookRental === 2) {
      return false;
    }

    // Member is currently not being penalized
    if (memberIsPenalized) {
      return false;
    }

    return this.prismaService.$transaction(async (prisma) => {
      try {
        const bookRental = await prisma.bookRental.create({
          data: {
            memberCode: createBookRentalDto.memberCode,
            bookCode: createBookRentalDto.bookCode,
            rentalDate: createBookRentalDto.rentalDate,
            dueDate: createBookRentalDto.dueDate,
          },
        });

        await this.bookService.updateStock(createBookRentalDto.bookCode, 0);

        return bookRental;
      } catch (error) {
        // Rollback the transaction if any operation fails
        throw new Error(`Transaction failed: ${error}`);
      }
    });
  }

  async returnBookRental(
    returnBookRentalDto: ReturnBookRentalDto,
  ): Promise<boolean> {
    const bookRental: BookRental =
      await this.prismaService.bookRental.findFirst({
        where: {
          memberCode: returnBookRentalDto.memberCode,
        },
      });

    if (!bookRental) {
      return false;
    }

    const today = new Date();
    const bookRentalLowerThanEqualToday =
      await this.prismaService.bookRental.findFirst({
        where: {
          memberCode: returnBookRentalDto.memberCode,
          dueDate: {
            lte: today,
          },
        },
      });

    if (!bookRentalLowerThanEqualToday) {
      return false;
    }

    return this.prismaService.$transaction(async (prisma) => {
      try {
        await prisma.bookRental.deleteMany({
          where: {
            memberCode: returnBookRentalDto.memberCode,
            bookCode: returnBookRentalDto.bookCode,
          },
        });

        await this.bookService.updateStock(returnBookRentalDto.bookCode, 1);

        return true;
      } catch (error) {
        // Rollback the transaction if any operation fails
        throw new Error(`Transaction failed: ${error}`);
      }
    });
  }
}
