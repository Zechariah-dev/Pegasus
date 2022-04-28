import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data });
  }

  findAll(data: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(data);
  }

  findOne(where: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(where);
  }

  update(data: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(data);
  }

  remove(data: Prisma.UserDeleteArgs) {
    return this.prismaService.user.delete(data);
  }
}
