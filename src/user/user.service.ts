import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(body: CreateUserDto) {
    const user = this.userRepo.create(body);
    return await this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }
  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }
  async remove(id: number) {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }
  async update(id: number, data: Partial<User>) {
    const result = await this.userRepo.update(id, data);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.userRepo.findOneBy({ id });
  }
}
