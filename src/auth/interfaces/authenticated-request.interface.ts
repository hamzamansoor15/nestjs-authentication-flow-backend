import { Request } from 'express';
import { User } from '../../schemas/user.schema';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    iat?: number;   // JWT issued at timestamp
    exp?: number;   // JWT expiration timestamp
  };
} 