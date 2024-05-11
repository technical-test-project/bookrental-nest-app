import { Prisma } from '@prisma/client';

export class Penalty implements Prisma.PenaltyCreateInput {
  id: string;
  memberCode: string;
  penaltyDateUntil: Date;
}
