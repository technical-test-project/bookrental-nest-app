import { Module } from '@nestjs/common';
import { BookRentalService } from './book-rental.service';
import { BookRentalController } from './book-rental.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BookService } from '../book/book.service';

@Module({
  providers: [BookRentalService, PrismaService, BookService],
  controllers: [BookRentalController],
})
export class BookRentalModule {}
