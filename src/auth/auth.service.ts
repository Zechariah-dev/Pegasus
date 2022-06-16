import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findByAccountNumber(acc: string) {
    return this.prisma.user.findFirst({
      where: {
        accountNumber: acc,
      },
    });
  }
}
