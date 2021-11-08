import { Controller, Param } from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { ReadFlightDto } from './dto/read-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FlightMSG } from '../common/constants';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @MessagePattern(FlightMSG.CREATE)
  create(
    @Payload() createFlightDto: CreateFlightDto,
  ): Promise<CreateFlightDto> {
    return this.flightService.create(createFlightDto);
  }

  @MessagePattern(FlightMSG.FIND_ALL)
  findAll() {
    return this.flightService.findAll();
  }

  @MessagePattern(FlightMSG.FIND_ONE)
  findOne(@Payload() id: number): Promise<ReadFlightDto> {
    return this.flightService.findOne(id);
  }

  @MessagePattern(FlightMSG.UPDATE)
  update(@Payload() payload): Promise<UpdateFlightDto> {
    return this.flightService.update(payload.id, payload.updateFlightDto);
  }

  @MessagePattern(FlightMSG.DELETE)
  delete(@Payload() id: number) {
    return this.flightService.delete(id);
  }

  @MessagePattern(FlightMSG.ADD_PASSENGER)
  addPassenger(@Payload() payload) {
    return this.flightService.addPassenger(
      payload.flightId,
      payload.passengerId,
    );
  }
}
