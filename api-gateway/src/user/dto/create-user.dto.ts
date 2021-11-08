import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly password: string;
}
