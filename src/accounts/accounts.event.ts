import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { AccountsService } from './accounts.service';
import { ACCOUNTS_EVENTS } from './accounts.type';

@Injectable()
export class AccountsEventListener {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) { }

  @OnEvent(ACCOUNTS_EVENTS.CREATE_ACCOUNT)
  async createNewAccount(payload: { userId: string; accountType: string }) {
    const user = await this.usersService.findById(payload.userId);
    
    const data = {
      type: payload.accountType,
      userId: user.id,
    };

    await this.accountsService.create(data); 
  }
}
