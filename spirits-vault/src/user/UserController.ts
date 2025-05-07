import { Request, Response } from 'express';
import { userRepository } from './UserRepository';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess, sendError, sendNotFound } from '../utils/responseUtils';

/**
 * Controller class for user endpoints
 */
export class UserController {
  /**
   * Get a user's profile
   * @param req Express request
   * @param res Express response
   */
  public async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id.toString();
      
      if (!userId) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      
      const user = await userRepository.findById(userId);
      
      if (!user) {
        sendNotFound(res, 'User');
        return;
      }
      
      // Map to response object, excluding sensitive data
      const userResponse = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      };
      
      sendSuccess(res, userResponse);
    } catch (error) {
      sendError(res, error as Error);
    }
  }
  
  /**
   * Update a user's profile
   * @param req Express request
   * @param res Express response
   */
  public async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id.toString();
      
      if (!userId) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      
      // Extract updatable fields only
      const { name, bio, profilePicture, phone } = req.body;
      
      const updatedUser = await userRepository.update(userId, {
        name,
        bio,
        profilePicture,
        phone
      });
      
      if (!updatedUser) {
        sendNotFound(res, 'User');
        return;
      }
      
      // Map to response object, excluding sensitive data
      const userResponse = {
        id: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.name,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        createdAt: updatedUser.createdAt
      };
      
      sendSuccess(res, userResponse);
    } catch (error) {
      sendError(res, error as Error);
    }
  }
  
  /**
   * Get a user's spirit collection
   * @param req Express request
   * @param res Express response
   */
  public async getUserCollection(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id.toString();
      
      if (!userId) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      
      const user = await userRepository.getUserCollection(userId);
      
      if (!user) {
        sendNotFound(res, 'User');
        return;
      }
      
      sendSuccess(res, { collection: user.collection });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
  
  /**
   * Add a spirit to the user's collection
   * @param req Express request
   * @param res Express response
   */
  public async addToCollection(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id.toString();
      
      if (!userId) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      
      const { spiritId } = req.body;
      
      if (!spiritId) {
        sendError(res, 'Spirit ID is required');
        return;
      }
      
      const updatedUser = await userRepository.addSpiritToCollection(userId, spiritId);
      
      if (!updatedUser) {
        sendNotFound(res, 'User');
        return;
      }
      
      sendSuccess(res, { message: 'Spirit added to collection' });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
  
  /**
   * Remove a spirit from the user's collection
   * @param req Express request
   * @param res Express response
   */
  public async removeFromCollection(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id.toString();
      
      if (!userId) {
        sendError(res, 'User not authenticated', 401);
        return;
      }
      
      const { spiritId } = req.params;
      
      if (!spiritId) {
        sendError(res, 'Spirit ID is required');
        return;
      }
      
      const updatedUser = await userRepository.removeSpiritFromCollection(userId, spiritId);
      
      if (!updatedUser) {
        sendNotFound(res, 'User');
        return;
      }
      
      sendSuccess(res, { message: 'Spirit removed from collection' });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
}

// Export a singleton instance
export const userController = new UserController(); 