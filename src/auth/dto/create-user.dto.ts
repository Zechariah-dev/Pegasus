import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class accountName {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  otherNames: string;
}

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  accountName: {
    firstName: string;
    lastName: string;
    otherNames: string;
  };

  @IsString()
  @IsDateString()
  @ApiProperty()
  dob: Date;

  @IsString()
  @ApiProperty()
  accountType: string;
}
