import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  controllers: [PassengerController],
  providers: [PassengerService],
})
export class PassengerModule {}
