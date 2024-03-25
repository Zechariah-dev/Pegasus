import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) { }

  async findByAccountNumber(accNumber: number) {
    return this.prismaService.account.findUnique({
      where: { number: accNumber },
    });
  }

  async create(payload: any) {
    const number = await this.generateAccountNumber()
    return this.prismaService.account.create({ data: { ...payload, number } });
  }

  async generateAccountNumber() {
    let prefix = 423;
    let unique = false;
    let accNo = '';

    while (!unique) {
      accNo = String(prefix) + Math.floor(Math.random() * 9999999).toString();
      let account = await this.findByAccountNumber(Number(accNo));

      if (!account) unique = true;
    }

    return Number(accNo)
  }
}
