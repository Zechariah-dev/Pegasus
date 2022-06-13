import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from './auth.helper';

@Module({
  imports: [JwtModule.register({ secret: 'hardguess' })],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
})
export class AuthModule {}
