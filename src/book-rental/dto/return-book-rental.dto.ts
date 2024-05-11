import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnBookRentalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  memberCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bookCode: string;
}
