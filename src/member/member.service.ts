import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Member } from './member.model';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Member[]> {
    return this.prismaService.member.findMany({
      include: {
        bookRentals: true,
      },
    });
  }
}
