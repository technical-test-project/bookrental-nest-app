import { Module } from '@nestjs/common';
import { BookRentalService } from './book-rental.service';
import { BookRentalController } from './book-rental.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BookRentalService, PrismaService],
  controllers: [BookRentalController],
})
export class BookRentalModule {}
