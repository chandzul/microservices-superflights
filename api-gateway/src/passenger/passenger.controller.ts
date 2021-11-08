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
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { Observable } from 'rxjs';
import { PassengerInterface } from '../common/interfaces/passenger.interface';
import { PassengerMSG } from '../common/constants';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('passengers')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/passengers')
export class PassengerController implements OnApplicationBootstrap {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    console.log('constructor passenger controller');
    console.log(this.clientProxy);
  }

  async onApplicationBootstrap() {
    try {
      await this._clientProxyPassenger.connect();
    } catch (e) {
      // console.log(e);
    }
  }

  private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

  @Post()
  create(
    @Body() createPassengerDto: CreatePassengerDto,
  ): Observable<PassengerInterface> {
    return this._clientProxyPassenger.send(
      PassengerMSG.CREATE,
      createPassengerDto,
    );
  }

  @Get()
  findAll(): Observable<PassengerInterface[]> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<PassengerInterface[]> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() passengerDto: UpdatePassengerDto,
  ): Observable<PassengerInterface> {
    return this._clientProxyPassenger.send(PassengerMSG.UPDATE, {
      id,
      passengerDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this._clientProxyPassenger.send(PassengerMSG.DELETE, id);
  }
}
