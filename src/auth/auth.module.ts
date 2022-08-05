import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from './auth.helper';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_KEY,
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy, UsersService],
  exports: [AuthService, AuthHelper, UsersService],
})
export class AuthModule {}
