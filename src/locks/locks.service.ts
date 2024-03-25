import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class LocksService {
  constructor(private readonly prismaService: PrismaService) { }

  async createUserLock(userId: string) {
    const lock = await this.prismaService.lock.findFirst({
      where: { status: 'ACTIVE', type: 'USER', userId },
    });

    if (lock) {
      if (lock.attempts < 3) {
        await this.incrementLockAttempts(lock.id);
      } else {
        await this.lockUserAccount(lock.id);
      }
    } else {
      await this.createUserLockEntry(userId);
    }
  }

  async createAccountLock(accountId: string) {
    const lock = await this.prismaService.lock.findFirst({
      where: { status: 'ACTIVE', type: 'ACCOUNT', accountId },
    });

    if (lock)  {

    } else {
      await this.createAccountLockEntry(accountId)
    }
  }

  private async incrementLockAttempts(lockId: string) {
    await this.prismaService.lock.update({
      where: { id: lockId },
      data: { attempts: { increment: 1 } },
    });
  }

  private async lockUserAccount(lockId: string) {
    const lockedAt = new Date();
    const unlockAt = new Date(lockedAt.getTime())
    unlockAt.setMinutes(unlockAt.getMinutes() + 5)
    await this.prismaService.lock.update({
      where: { id: lockId },
      data: {
        lockedAt,
        unlockAt
      },
    });
  }

  private async createUserLockEntry(userId: string) {
    await this.prismaService.lock.create({
      data: { attempts: 1, type: 'USER', userId },
    });
  }

  private async createAccountLockEntry(accountId: string) {
    await this.prismaService.lock.create({
      data: { attempts: 1, type: 'USER', accountId },
    });
  }

  async checkActiveUserLock(userId: string) {
    return await this.prismaService.lock.findFirst({
      where: { userId, status: 'ACTIVE', type: "USER" },
    });
  }

  async deactivateLock(lockId: string) {
    return await this.prismaService.lock.update({
      where: { id: lockId },
      data: { status: 'INACTIVE' },
    });
  }
}
