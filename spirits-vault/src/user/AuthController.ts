import { Request, Response } from 'express';
import { authService, RegisterUserDto, LoginUserDto } from './AuthService';
import { sendSuccess, sendCreated, sendError } from '../utils/responseUtils';

/**
 * Controller class for authentication endpoints
 */
export class AuthController {
  /**
   * Register a new user
   * @param req Express request
   * @param res Express response
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterUserDto = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture
      };
      
      const result = await authService.register(userData);
      
      sendCreated(res, result);
    } catch (error) {
      sendError(res, error as Error);
    }
  }
  
  /**
   * Login user
   * @param req Express request
   * @param res Express response
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginUserDto = {
        email: req.body.email,
        password: req.body.password
      };
      
      const result = await authService.login(loginData);
      
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, (error as Error).message, 401);
    }
  }
}

// Export a singleton instance
export const authController = new AuthController(); 