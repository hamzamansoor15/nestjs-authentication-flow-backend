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
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      // Check if user exists
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Create user
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Generate token and return response
      const access_token = await this.generateToken(user);
      return {
        data: {
          access_token,
          user: user //this.excludePassword(user),
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
      // Find user
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate token and return response
      const access_token = await this.generateToken(user);
      return {
        data: {
          access_token,
          user: user //this.excludePassword(user),
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during login');
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