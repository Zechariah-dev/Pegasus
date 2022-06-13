import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  prismaa = new PrismaClient();

  create(data: Prisma.UserCreateInput) {
    return this.prismaa.user.create({ data });
  }
}