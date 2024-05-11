import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from './book.model';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Book[]> {
    return this.prismaService.book.findMany();
  }
}
