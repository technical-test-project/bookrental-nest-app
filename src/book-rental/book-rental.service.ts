import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookRental } from '@prisma/client';
import { CreateBookRentalDto } from './dto/create-book-rental.dto';
import { Penalty } from '../penalty/penalty.model';
import { ReturnBookRentalDto } from './dto/return-book-rental.dto';

@Injectable()
export class BookRentalService {
  constructor(private readonly prismaService: PrismaService) {}

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
          penaltyDateUntil: {
            lte: new Date(),
          },
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

        await prisma.book.update({
          where: {
            code: createBookRentalDto.bookCode,
          },
          data: {
            stock: 0,
          },
        });

        return bookRental;
      } catch (error) {
        // Rollback the transaction if any operation fails
        throw new Error(`Transaction failed: ${error}`);
      }
    });
  }

  async returnBookRental(
    returnBookRentalDto: ReturnBookRentalDto,
  ): Promise<{ message: string; status: boolean }> {
    const bookRental: BookRental =
      await this.prismaService.bookRental.findFirst({
        where: {
          memberCode: returnBookRentalDto.memberCode,
        },
      });

    if (!bookRental) {
      return {
        message: 'Book rental not found',
        status: false,
      };
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
      // Penalty For 3 Days
      await this.prismaService.penalty.create({
        data: {
          memberCode: returnBookRentalDto.memberCode,
          penaltyDateUntil: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        message:
          'Member return book more than 7 days, the member will be subject to a penalty',
        status: false,
      };
    }

    const result = await this.prismaService.$transaction(async (prisma) => {
      try {
        await prisma.bookRental.deleteMany({
          where: {
            memberCode: returnBookRentalDto.memberCode,
            bookCode: returnBookRentalDto.bookCode,
          },
        });

        await prisma.book.update({
          where: {
            code: returnBookRentalDto.bookCode,
          },
          data: {
            stock: 1,
          },
        });

        return true;
      } catch (error) {
        // Rollback the transaction if any operation fails
        throw new Error(`Transaction failed: ${error}`);
      }
    });

    return {
      message: 'Successfully return book rental',
      status: result,
    };
  }
}
