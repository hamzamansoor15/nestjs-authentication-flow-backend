import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  readonly password: string;
} 