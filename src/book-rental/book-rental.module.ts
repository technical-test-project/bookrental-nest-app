import { Module } from '@nestjs/common';
import { BookRentalService } from './book-rental.service';
import { BookRentalController } from './book-rental.controller';

@Module({
  providers: [BookRentalService],
  controllers: [BookRentalController]
})
export class BookRentalModule {}
