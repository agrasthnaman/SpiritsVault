import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, IUser } from '../models/User';

dotenv.config();

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  userId: string;
}

/**
 * Extend Express Request to include user and token
 */
export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * Authentication middleware to verify JWT and attach user to request
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 