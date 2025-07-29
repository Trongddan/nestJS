import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from './user-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepo: Repository<UserSession>,
  ) {}
  async create(data: Partial<UserSession>) {
    const session = this.userSessionRepo.create(data);
    return this.userSessionRepo.save(session);
  }
  async deleteByDevice(userId: number, deviceId: string): Promise<boolean> {
    const result = await this.userSessionRepo.delete({ userId, deviceId });
    return (result.affected ?? 0) > 0;
  }
  async findByUserAndDevice(deviceId: string) {
    return this.userSessionRepo.findOne({ where: { deviceId } });
  }
  async getAllSession(userId: number) {
    return this.userSessionRepo.find({
      where: { userId },
      select: ['deviceId', 'userAgent', 'ip', 'createdAt'],
    });
  }
}
