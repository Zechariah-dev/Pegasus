import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
  HttpCode,
  Logger,
 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ACCOUNTS_EVENTS } from '../accounts/accounts.type';
import { LocksService } from '../locks/locks.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name)
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly locksService: LocksService,
    private eventEmitter: EventEmitter2,
  ) { }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: RegisterUserDto })
  @ApiBadRequestResponse({ description: 'Bad request - invalid credentials' })
  @ApiCreatedResponse({ description: 'The user account has been created' })
  async register(@Body() body: RegisterUserDto) {
    const existingUser = await this.usersService.findByEmail(body.email);

    if (existingUser) {
      throw new BadRequestException(
        'The provided email address is already in use',
      );
    }

    const { accountType, ...rest } = body;

    const user = await this.authService.createUser(rest);

    this.eventEmitter.emit(ACCOUNTS_EVENTS.CREATE_ACCOUNT, {
      userId: user.id,
      accountType,
    });

    return { message: 'user account create successfully' };
  }

  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  @ApiBadRequestResponse({ description: 'Bad request - invalid credentials' })
  @ApiOkResponse({ description: 'user logged in successfully' })
  async login(@Body() body: LoginUserDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException(
        "User with the provided email doesn't exist",
      );
    }

    const existingLock = await this.locksService.checkActiveUserLock(user.id);
    this.logger.log("acive lock", existingLock)
    const now = new Date();
    if (existingLock && existingLock.unlockAt > now) {
      throw new BadRequestException(
        'Account is currently locked. Please try again shortly.',
      );
    }

    if (
      existingLock &&
      existingLock.unlockAt < now &&
      existingLock.attempts === 3
    ) {
      await this.locksService.deactivateLock(existingLock.id);
    }

    const isMatch = await this.authService.comparePassword(
      body.password,
      user.password,
    );
    if (!isMatch) {
      await this.locksService.createUserLock(user.id);
      throw new BadRequestException('Incorrect password. Please try again.');
    }

    const tokens = this.authService.generateTokens({
      email: user.email,
      userId: user.id,
    });

    return {
      message: 'User logged in successfully',
      data: user,
      tokens,
    };
  }

  @Post('/refresh-token')
  @ApiBadRequestResponse({ description: 'Bad-request - invalid token' })
  @ApiOkResponse({ description: 'tokens refreshed successfully' })
  async refreshToken(@Body() body: RefreshTokenDto) {
    const payload = this.authService.validateRefreshToken(
      body.token,
    );

    if (Date.now() >= payload.exp * 1000) {
      throw new BadRequestException('refresh token expired');
    }

    const { email } = payload;

    const user = await this.usersService.findByEmail(email);
    const tokens = this.authService.generateTokens({
      email: user.email,
      userId: user.id,
    });

    return { message: 'tokens refreshed successfully', tokens };
  }
}
