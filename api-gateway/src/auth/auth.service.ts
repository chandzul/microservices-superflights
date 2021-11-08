import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ClientProxySuperFlights } from '../common/proxy/client-proxy';
import { UserMSG } from '../common/constants';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {}

  async onApplicationBootstrap() {
    await this._clientProxyUser.connect();
  }

  private _clientProxyUser = this.clientProxy.clientProxyUsers();

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this._clientProxyUser
      .send(UserMSG.VALID_USER, {
        username,
        password,
      })
      .toPromise();

    if (user) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this._clientProxyUser
      .send(UserMSG.CREATE, createUserDto)
      .toPromise();
  }
}
