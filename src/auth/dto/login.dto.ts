import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{64}$/, {
    message: 'Password must be a valid SHA-256 hash (64 characters hexadecimal)',
  })
  password: string;
} 