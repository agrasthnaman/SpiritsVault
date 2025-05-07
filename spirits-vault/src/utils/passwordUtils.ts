import bcrypt from 'bcryptjs';

/**
 * Utility functions for password handling
 */

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 * @param password Plain text password
 * @param hash Hashed password
 * @returns True if the password matches the hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
} 