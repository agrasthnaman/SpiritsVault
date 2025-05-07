import { Types } from 'mongoose';
import { User, IUser } from '../models/User';

/**
 * Data Access Object for User model - handles all direct database operations
 */
export class UserDAO {
  /**
   * Create a new user in the database
   * @param userData User data to create
   * @returns The created user document
   */
  public async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @returns User document or null if not found
   */
  public async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Find a user by email
   * @param email User email
   * @returns User document or null if not found
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Find a user by username
   * @param username Username
   * @returns User document or null if not found
   */
  public async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  /**
   * Update a user
   * @param id User ID
   * @param userData User data to update
   * @returns Updated user document or null if not found
   */
  public async updateById(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  /**
   * Add items to a user's collection array
   * @param userId User ID
   * @param spiritIds Array of spirit IDs to add
   * @returns Updated user document or null if not found
   */
  public async addToCollection(userId: string, spiritIds: string[]): Promise<IUser | null> {
    const objectIds = spiritIds.map(id => new Types.ObjectId(id));
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { collection: { $each: objectIds } } },
      { new: true }
    );
  }

  /**
   * Remove items from a user's collection array
   * @param userId User ID
   * @param spiritIds Array of spirit IDs to remove
   * @returns Updated user document or null if not found
   */
  public async removeFromCollection(userId: string, spiritIds: string[]): Promise<IUser | null> {
    const objectIds = spiritIds.map(id => new Types.ObjectId(id));
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { collection: { $in: objectIds } } },
      { new: true }
    );
  }

  /**
   * Get a user's collection with populated spirit data
   * @param userId User ID
   * @returns User document with populated collection or null if not found
   */
  public async getUserWithCollection(userId: string): Promise<IUser | null> {
    return await User.findById(userId).populate('collection');
  }

  /**
   * Delete a user by ID
   * @param id User ID
   * @returns Deleted user document or null if not found
   */
  public async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}

// Export a singleton instance
export const userDAO = new UserDAO(); 