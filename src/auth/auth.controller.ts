import { 
  Body, 
  Controller, 
  Post, 
  ValidationPipe, 
  HttpCode, 
  HttpStatus, 
  Req,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenBlacklistService } from './token-blacklist/token-blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: AuthenticatedRequest) {
    const token = this.extractTokenFromHeader(req);
    await this.authService.logout(token);
    return { message: 'Successfully logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('blacklisted-tokens')
  getBlacklistedTokens() {
    return {
      tokens: this.tokenBlacklistService.getBlacklistedTokens()
    };
  }

  private extractTokenFromHeader(req: AuthenticatedRequest): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
} 