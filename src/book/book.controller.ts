import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BookService } from './book.service';
import { Book } from './book.model';
import { Response } from 'express';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @ApiOkResponse({ description: 'Retrieve all books' })
  @Get()
  async findAll(@Res() response: Response): Promise<Response<Book[]>> {
    return response.status(HttpStatus.OK).json({
      message: 'Successfully retrieved books',
      data: await this.booksService.findAll(),
    });
  }
}
