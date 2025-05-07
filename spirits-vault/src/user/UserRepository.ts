import { IUser } from '../models/User';
import { userDAO } from './UserDao';

/**
 * Repository class for User operations
 * Acts as an intermediary between services and DAO layer
 */
export class UserRepository {
  /**
   * Create a new user
   * @param userData User data to create
   * @returns The created user or error
   */
  public async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      return await userDAO.create(userData);
    } catch (error) {
      throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @returns User document or null if not found
   */
  public async findById(id: string): Promise<IUser | null> {
    try {
      return await userDAO.findById(id);
    } catch (error) {
      throw new Error(`Failed to find user: ${(error as Error).message}`);
    }
  }

  /**
   * Find a user by email
   * @param email User email
   * @returns User document or null if not found
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await userDAO.findByEmail(email);
    } catch (error) {
      throw new Error(`Failed to find user by email: ${(error as Error).message}`);
    }
  }

  /**
   * Find a user by username
   * @param username Username
   * @returns User document or null if not found
   */
  public async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await userDAO.findByUsername(username);
    } catch (error) {
      throw new Error(`Failed to find user by username: ${(error as Error).message}`);
    }
  }

  /**
   * Update a user
   * @param id User ID
   * @param userData User data to update
   * @returns Updated user document or null if not found
   */
  public async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await userDAO.updateById(id, userData);
    } catch (error) {
      throw new Error(`Failed to update user: ${(error as Error).message}`);
    }
  }

  /**
   * Add a spirit to a user's collection
   * @param userId User ID
   * @param spiritId Spirit ID
   * @returns Updated user document or null if not found
   */
  public async addSpiritToCollection(userId: string, spiritId: string): Promise<IUser | null> {
    try {
      return await userDAO.addToCollection(userId, [spiritId]);
    } catch (error) {
      throw new Error(`Failed to add spirit to collection: ${(error as Error).message}`);
    }
  }

  /**
   * Remove a spirit from a user's collection
   * @param userId User ID
   * @param spiritId Spirit ID
   * @returns Updated user document or null if not found
   */
  public async removeSpiritFromCollection(userId: string, spiritId: string): Promise<IUser | null> {
    try {
      return await userDAO.removeFromCollection(userId, [spiritId]);
    } catch (error) {
      throw new Error(`Failed to remove spirit from collection: ${(error as Error).message}`);
    }
  }

  /**
   * Get a user's collection with populated spirit data
   * @param userId User ID
   * @returns User document with populated collection or null if not found
   */
  public async getUserCollection(userId: string): Promise<IUser | null> {
    try {
      return await userDAO.getUserWithCollection(userId);
    } catch (error) {
      throw new Error(`Failed to get user collection: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a user
   * @param userId User ID
   * @returns Deleted user document or null if not found
   */
  public async delete(userId: string): Promise<IUser | null> {
    try {
      return await userDAO.deleteById(userId);
    } catch (error) {
      throw new Error(`Failed to delete user: ${(error as Error).message}`);
    }
  }
}

// Export a singleton instance
export const userRepository = new UserRepository(); 