import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  Validate,
} from 'class-validator';
import { IsValidAge } from './validators/age.validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @IsString()
  @ApiProperty({
    default: 'MM-DD-YYYY',
  })
  @Validate(IsValidAge, [18])
  dob: string;

  @IsString()
  @IsEnum(['saving', 'current'])
  @ApiProperty({
    default: 'saving',
  })
  accountType: string;

  @IsString()
  @ApiProperty({
    default: '+2348012345678',
  })
  mobileNumber: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  firstname: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  lastname: string;
  
  @IsString()
  @ApiProperty({ type: 'string' })
  middlename: string;
}

