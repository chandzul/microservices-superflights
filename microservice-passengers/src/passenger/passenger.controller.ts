import { Controller } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { ReadPassengerDto } from './dto/read-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PassengerMSG } from '../common/constants';

@Controller()
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @MessagePattern(PassengerMSG.CREATE)
  create(@Payload() createPassengerDto: CreatePassengerDto) {
    return this.passengerService.create(createPassengerDto);
  }

  @MessagePattern(PassengerMSG.FIND_ALL)
  findAll() {
    return this.passengerService.findAll();
  }

  @MessagePattern(PassengerMSG.FIND_ONE)
  findOne(@Payload() id: number): Promise<ReadPassengerDto> {
    return this.passengerService.findOne(id);
  }

  @MessagePattern(PassengerMSG.UPDATE)
  update(@Payload() payload): Promise<UpdatePassengerDto> {
    console.log(payload);
    return this.passengerService.update(payload.id, payload.passengerDto);
  }

  @MessagePattern(PassengerMSG.DELETE)
  delete(@Payload() id: number) {
    return this.passengerService.delete(id);
  }
}
