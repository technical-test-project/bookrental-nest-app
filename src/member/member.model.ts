import { Prisma } from '@prisma/client';

export class Member implements Prisma.MemberCreateInput {
  id: string;
  code: string;
  name: string;
}
