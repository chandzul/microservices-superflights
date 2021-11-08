import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const hash = await this.hashPassword(createUserDto.password);
    // const user = await this.userRepository.create({
    //   ...createUserDto,
    //   password: hash,
    // });

    const createdUser = await this.userRepository.save({
      ...createUserDto,
      password: hash,
    });

    return plainToClass(ReadUserDto, createdUser);
  }

  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.userRepository.find();

    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  async findOne(id: number): Promise<ReadUserDto> {
    return await this.userRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const hash = await this.hashPassword(updateUserDto.password);
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
      password: hash,
    });

    if (!user) {
      throw new NotFoundException(`User #[${id}] not found`);
    }

    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneOrFail(id);
    return this.userRepository.remove(user);
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }
}
