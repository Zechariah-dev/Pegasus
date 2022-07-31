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
      secret: 'hardguess',
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy, UsersService],
  exports: [AuthService, AuthHelper, JwtStrategy, UsersService],
})
export class AuthModule {}
