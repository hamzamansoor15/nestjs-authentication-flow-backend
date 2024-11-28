import { User } from '../../schemas/user.schema';

export interface AuthResponse {
  data: {
    access_token: string;
    user: Omit<User, 'password'>;
  };
} 