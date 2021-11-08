import { WeatherInterface } from '../../common/interfaces/weather.interface';
import { Passenger } from '../entities/passenger.entity';

export class ReadFlightDto {
  readonly id: number;
  readonly pilot: string;
  readonly airplane: string;
  readonly destinationCity: string;
  readonly flightDate: Date;
  readonly passengers?: Passenger[];
  readonly weather?: WeatherInterface[];
}
