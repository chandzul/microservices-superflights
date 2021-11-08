import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  OnApplicationBootstrap,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxySuperFlights } from '../common/proxy/client-proxy';
import { CreateFlightDto } from './dto/create-flight.dto';
import { Observable } from 'rxjs';
import { FlightInterface } from '../common/interfaces/flight.interface';
import { FlightMSG, PassengerMSG } from '../common/constants';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('flights')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/flights')
export class FlightController implements OnApplicationBootstrap {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    console.log('constructor flight controller');
    console.log(this.clientProxy);
  }

  private _clientProxyFlight = this.clientProxy.clientProxyFlights();
  private _clientProxyPassengers = this.clientProxy.clientProxyPassengers();

  async onApplicationBootstrap() {
    try {
      await this._clientProxyFlight.connect();
      await this._clientProxyPassengers.connect();
    } catch (e) {
      // console.log(e);
    }
  }

  @Post()
  create(
    @Body() createFlightDto: CreateFlightDto,
  ): Observable<FlightInterface> {
    return this._clientProxyFlight.send(FlightMSG.CREATE, createFlightDto);
  }

  @Get()
  findAll(): Observable<FlightInterface[]> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<FlightInterface> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateFlightDto: CreateFlightDto,
  ): Observable<FlightInterface> {
    return this._clientProxyFlight.send(FlightMSG.UPDATE, {
      id,
      updateFlightDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this._clientProxyFlight.send(FlightMSG.DELETE, id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: number,
    @Param('passengerId') passengerId: number,
  ) {
    const passenger = await this._clientProxyPassengers
      .send(PassengerMSG.FIND_ONE, passengerId)
      .toPromise();

    if (!passenger) {
      throw new HttpException('Passenger Not Found', HttpStatus.NOT_FOUND);
    }

    return this._clientProxyFlight.send(FlightMSG.ADD_PASSENGER, {
      flightId,
      passengerId,
    });
  }
}
