import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsJSON,
  IsObject,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

class AccountName {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  otherNames: string;
}

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
  @IsPhoneNumber('NG')
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsObject()
  @ApiProperty({ type: AccountName })
  accountName: AccountName;
}
