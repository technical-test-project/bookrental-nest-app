import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { BookRentalModule } from './book-rental/book-rental.module';
import { PenaltyModule } from './penalty/penalty.module';

@Module({
  imports: [BookModule, MemberModule, BookRentalModule, PenaltyModule],
})
export class AppModule {}
