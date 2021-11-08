import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { ReadPassengerDto } from './dto/read-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
  ) {}

  async create(
    createPassengerDto: CreatePassengerDto,
  ): Promise<CreatePassengerDto> {
    const createdPassenger = await this.passengerRepository.save({
      ...createPassengerDto,
    });

    return createdPassenger;
  }

  async findAll(): Promise<ReadPassengerDto[]> {
    return await this.passengerRepository.find();
  }

  async findOne(id: number): Promise<ReadPassengerDto> {
    return await this.passengerRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updatePassengerDto: UpdatePassengerDto,
  ): Promise<UpdatePassengerDto> {
    const passenger = await this.passengerRepository.preload({
      id: +id,
      ...updatePassengerDto,
    });

    if (!passenger) {
      throw new NotFoundException(`Passenger #[${id}] not found`);
    }

    return this.passengerRepository.save(passenger);
  }

  async delete(id: number) {
    const passenger = await this.passengerRepository.findOneOrFail(id);
    return this.passengerRepository.remove(passenger);
  }
}
