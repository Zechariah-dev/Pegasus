import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthHelper } from './auth.helper';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly JwtService: JwtService,
    private readonly AuthHelper: AuthHelper,
  ) {}

  prisma = new PrismaClient();

  @Post('/register')
  @ApiBody({ type: CreateUserDto })
  @ApiBadRequestResponse({ description: 'Bad request - invalid credentials' })
  @ApiCreatedResponse({ description: 'The user account has been created' })
  async register(@Body() body: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'The provided email address is already in use',
      );
    }

    const validAge: boolean = this.AuthHelper.validateAge(body.dob);
    if (!validAge) {
      throw new BadRequestException(
        'The provided age is not valid, you must be 18 years or older.',
      );
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const accountNumber = await this.AuthHelper.generateAccountNumber();

    return this.AuthService.create({
      ...body,
      password: hashedPassword,
      accountNumber,
      accountName: body.accountName as Prisma.JsonObject,
    });
  }

  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  @ApiBadRequestResponse({ description: 'Bad request - invalid credentials' })
  @ApiOkResponse({ description: 'login successful' })
  async login(@Body() body: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new BadRequestException(
        "Account which the provided email doesn't exist",
      );
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const payload = _.pick(user, ['email', 'id']);

    const accessToken = await this.JwtService.sign(payload);

    return { accessToken };
  }
}
