import {
  Body,
  Controller,
  Delete,
  Get,
  OnApplicationBootstrap,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxySuperFlights } from '../common/proxy/client-proxy';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable } from 'rxjs';
import { UserInterface } from '../common/interfaces/user.interface';
import { UserMSG } from '../common/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/users')
export class UserController implements OnApplicationBootstrap {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    console.log('constructor users controller');
    console.log(this.clientProxy);
  }

  async onApplicationBootstrap() {
    await this._clientProxyUser.connect();
  }

  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserInterface> {
    console.log(createUserDto);
    return this._clientProxyUser.send(UserMSG.CREATE, createUserDto);
  }

  @Get()
  findAll(): Observable<UserInterface[]> {
    return this._clientProxyUser.send(UserMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<UserInterface> {
    return this._clientProxyUser.send(UserMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UserInterface> {
    return this._clientProxyUser.send(UserMSG.UPDATE, { id, updateUserDto });
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this._clientProxyUser.send(UserMSG.DELETE, id);
  }
}
