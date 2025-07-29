/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsInt, Min, Max, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name hhehe' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class UpdateUserDto {
  @IsString({ message: 'name hhehe' })
  name?: string;

  @IsInt()
  @Min(1)
  @Max(100)
  age?: number;
}
