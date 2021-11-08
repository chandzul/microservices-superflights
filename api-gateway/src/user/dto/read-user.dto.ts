import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ReadUserDto {
  @IsNumber()
  @Expose()
  readonly id: number;

  @IsString()
  @Expose()
  readonly name: string;

  @IsString()
  @Expose()
  readonly username: string;

  @IsString()
  @Expose()
  readonly email: string;
}
