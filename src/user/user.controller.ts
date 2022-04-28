import { Prisma } from '@prisma/client';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() data: Prisma.UserCreateInput) {
    const user = this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'credientials already in use',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // const salt = await bcrypt.genSalt();

    return this.userService.create(data);
  }

  @Get()
  findAll(data: Prisma.UserFindManyArgs) {
    return this.userService.findAll(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ where: { id } });
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.update({ where: { id }, data });
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.userService.remove({ where: { id } });
  }
}
