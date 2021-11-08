import { Passenger } from '../entities/passenger.entity';

export class CreateFlightDto {
  readonly pilot: string;
  readonly airplane: string;
  readonly destinationCity: string;
  readonly flightDate: Date;
  // readonly passengers: Passenger[];
}
