import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlightDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pilot: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  airplane: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destinationCity: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  flightDate: Date;

  // readonly passengers: Passenger[];
}
