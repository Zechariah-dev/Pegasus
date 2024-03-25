import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsEventListener } from './accounts.event';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsEventListener, UsersService]
})
export class AccountsModule {}
