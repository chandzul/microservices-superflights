import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMSG } from '../common/constants';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMSG.CREATE)
  create(@Payload() user: CreateUserDto) {
    console.log(user);
    return this.userService.create(user);
  }

  @MessagePattern(UserMSG.FIND_ALL)
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern(UserMSG.FIND_ONE)
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMSG.UPDATE)
  update(@Payload() payload: any) {
    return this.userService.update(payload.id, payload.updateUserDto);
  }

  @MessagePattern(UserMSG.DELETE)
  delete(@Payload() id: number) {
    return this.userService.delete(id);
  }

  @MessagePattern(UserMSG.VALID_USER)
  async validateUser(@Payload() payload) {
    const user = await this.userService.findByUsername(payload.username);
    const isValidPassword = await this.userService.checkPassword(
      payload.password,
      user.password,
    );

    console.log(user);

    if (user && isValidPassword) return user;

    return null;
  }
}
