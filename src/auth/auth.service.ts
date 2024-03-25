import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async createUser(payload: Omit<RegisterUserDto, 'accountType'>) {
    const hashedPassword = await this.hashPassword(payload.password);
    const user = await this.usersService.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    return user;
  }

  generateTokens(payload: { email: string; userId: string }) {
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '10days',
    });

    return { accessToken, refreshToken };
  }

  validateRefreshToken(refreshToken: string) {
    return this.jwtService.verify(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      ignoreExpiration: true,
    });
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }
}
