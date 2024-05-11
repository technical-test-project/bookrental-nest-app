import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from './book.model';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      where: {
        stock: {
          not: 0,
        },
      },
    });
  }

  async updateStock(bookId: string, stock: number): Promise<Book> {
    return this.prismaService.book.update({
      where: {
        id: bookId,
      },
      data: {
        stock,
      },
    });
  }
}
