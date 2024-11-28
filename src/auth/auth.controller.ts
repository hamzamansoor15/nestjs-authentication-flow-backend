import { 
  Body, 
  Controller, 
  Post, 
  ValidationPipe, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<AuthResponse> {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto
  ): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }
} 