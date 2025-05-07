import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { userRepository } from './UserRepository';
import { IUser, validateEmail } from '../models/User';

dotenv.config();

// Define DTO types
export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio: string;
  profilePicture: string;
  createdAt: Date;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
}

/**
 * Class providing authentication-related services
 */
export class AuthService {
  /**
   * Map a user document to a user response DTO
   * @param user User document
   * @returns User response DTO
   * @private
   */
  private mapUserToDto(user: IUser): UserResponseDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    };
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Auth response with user data and JWT token
   * @throws Error if email or username already exists
   */
  public async register(userData: RegisterUserDto): Promise<AuthResponseDto> {
    // Validate email format
    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const existingUserByEmail = await userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error('Email already in use');
    }
    
    const existingUserByUsername = await userRepository.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error('Username already taken');
    }
    
    // Set a random profile picture if not provided
    if (!userData.profilePicture) {
      userData.profilePicture = `https://avatars.dicebear.com/api/avataaars/${uuidv4()}.svg`;
    }
    
    // Create default bio if not provided
    if (!userData.bio) {
      userData.bio = '';
    }
    
    // Create new user
    const user = await userRepository.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });
    
    // Generate JWT token
    const token = this.generateToken(user._id.toString());
    
    return {
      user: this.mapUserToDto(user),
      token
    };
  }
  
  /**
   * Login a user
   * @param loginData User login data
   * @returns Auth response with user data and JWT token
   * @throws Error if credentials are invalid
   */
  public async login(loginData: LoginUserDto): Promise<AuthResponseDto> {
    // Find user
    const user = await userRepository.findByEmail(loginData.email.toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const isMatch = await user.comparePassword(loginData.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = this.generateToken(user._id.toString());
    
    return {
      user: this.mapUserToDto(user),
      token
    };
  }
  
  /**
   * Generate a JWT token for authentication
   * @param userId User ID
   * @returns JWT token
   * @private
   */
  private generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    
    return jwt.sign(
      { userId },
      jwtSecret,
      { expiresIn: '7d' }
    );
  }
}

// Export a singleton instance
export const authService = new AuthService(); 