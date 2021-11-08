import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Passenger } from '../../passenger/entities/passenger.entity';
import { WeatherInterface } from '../../common/interfaces/weather.interface';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pilot: string;

  @Column()
  airplane: string;

  @Column()
  destinationCity: string;

  @Column()
  flightDate: Date;

  // @Column('json', { nullable: true })
  // passengers: Passenger[];

  // @Column()
  // weather?: WeatherInterface[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
