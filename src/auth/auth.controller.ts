import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
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
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    // private readonly JwtService: JwtService,
    private readonly AuthHelper: AuthHelper,
  ) {}
  JwtService: JwtService = new JwtService();
  prisma = new PrismaClient();

  @Post('/register')
  @ApiBody({ type: RegisterUserDto })
  @ApiBadRequestResponse({ description: 'Bad request - invalid credentials' })
  @ApiCreatedResponse({ description: 'The user account has been created' })
  async register(@Body() body: RegisterUserDto) {
    const existingUser = await this.prisma.user.findFirst({
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
      dob: new Date(body.dob).toISOString(),
      accountName: body.accountName as unknown as Prisma.InputJsonObject,
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

    // remove user password
    delete user.password;

    const accessToken = await this.JwtService.sign({
      username: user.email,
      sub: user.id,
    });

    const refreshToken = await this.JwtService.sign(
      { username: user.email },
      { secret: process.env.REFRESH_KEY, expiresIn: '10days' },
    );

    return { user, accessToken, refreshToken };
  }

  @Post('/refresh-token')
  @ApiBody({ type: RefreshTokenDto })
  @ApiBadRequestResponse({ description: 'Bad-request - invalid token' })
  @ApiOkResponse({ description: 'refreshed token' })
  async refreshToken(@Body() body: { token: string }) {
    const payload = this.JwtService.verify(body.token, {
      secret: process.env.REFRESH_KEY,
    });

    const { username } = payload;

    const user = await this.prisma.user.findUnique({
      where: {
        email: username,
      },
      rejectOnNotFound: true,
    });

    const accessToken = await this.JwtService.sign({
      username: user.email,
      sub: user.id,
    });

    const refreshToken = await this.JwtService.sign(
      { username: user.email },
      { secret: process.env.REFRESH_KEY, expiresIn: '10days' },
    );

    return { refreshToken, accessToken };
  }
}
