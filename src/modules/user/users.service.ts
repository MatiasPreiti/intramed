import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ email });
  }
}
