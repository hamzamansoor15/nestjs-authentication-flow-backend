import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../schemas/user.schema';
import { AuthResponse } from './interfaces/auth-response.interface';
import { TokenBlacklistService } from './token-blacklist/token-blacklist.service';
import { CustomLogger } from '../logging/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly logger: CustomLogger,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      // Check if user exists
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Password is already hashed from frontend, no need to hash it again
      const user = await this.usersService.create({
        ...createUserDto,
        // Store the pre-hashed password directly
        password: createUserDto.password,
      });

      // Generate token and return response
      const access_token = await this.generateToken(user);
      return {
        data: {
          access_token,
          user: user
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.email}`, 'AuthService');
      
      // Find user
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        this.logger.warn(`Failed login attempt - user not found: ${loginDto.email}`, 'AuthService');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Direct comparison of hashed passwords
      const isPasswordValid = loginDto.password === user.password;
      
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password attempt for email: ${loginDto.email}`, 'AuthService');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate token and return response
      const access_token = await this.generateToken(user);
      this.logger.log(`Successful login for user: ${loginDto.email}`, 'AuthService');
      return {
        data: {
          access_token,
          user: user
        },
      };
    } catch (error) {
      this.logger.error(
        `Login error for user ${loginDto.email}: ${error.message}`,
        error.stack,
        'AuthService'
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during login');
    }
  }

  async logout(token: string): Promise<void> {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      // Verify the token is valid before blacklisting
      await this.jwtService.verifyAsync(token);
      this.tokenBlacklistService.addToBlacklist(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }
}