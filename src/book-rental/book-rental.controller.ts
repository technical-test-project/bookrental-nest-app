import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { BookRentalService } from './book-rental.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BookRental } from './book-rental.model';
import { CreateBookRentalDto } from './dto/create-book-rental.dto';

@ApiTags('BookRentals')
@Controller('book-rentals')
export class BookRentalController {
  constructor(private readonly bookRentalService: BookRentalService) {}

  @ApiOkResponse({ description: 'Retrieve all books' })
  @Get()
  async findAll(@Res() response: Response): Promise<Response<BookRental[]>> {
    return response.status(HttpStatus.OK).json({
      message: 'Successfully retrieved book rentals',
      data: await this.bookRentalService.findAll(),
    });
  }

  @ApiCreatedResponse({ description: 'Store book rental' })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Store book rental',
  })
  @Post()
  async storeBookRental(
    @Body() createBookRentalDto: CreateBookRentalDto,
    @Res() response: Response,
  ): Promise<Response<BookRental>> {
    const days: number = 7;
    const rentalDate = new Date();
    const dueDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);

    const dto: CreateBookRentalDto = {
      memberCode: createBookRentalDto.memberCode,
      bookCode: createBookRentalDto.bookCode,
      rentalDate,
      dueDate,
    };
    const result = await this.bookRentalService.storeBookRental(dto);
    if (!result) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return response.status(HttpStatus.CREATED).json({
      message: 'Successfully stored book rental',
      data: result,
    });
  }
}
