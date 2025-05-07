import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

// Import controllers for route setup
import { authController } from './user/AuthController';
import { userController } from './user/UserController';
import { auth } from './middleware/authMiddleware';

dotenv.config();

/**
 * Main application class
 */
class Application {
  public app: Express;

  /**
   * Initialize application
   */
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configure middleware
   */
  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan('dev'));
  }

  /**
   * Configure routes
   */
  private setupRoutes(): void {
    // Auth routes
    const authRouter = express.Router();
    authRouter.post('/register', authController.register.bind(authController));
    authRouter.post('/login', authController.login.bind(authController));
    this.app.use('/api/auth', authRouter);
    
    // User routes
    const userRouter = express.Router();
    userRouter.get('/profile', auth, userController.getProfile.bind(userController));
    userRouter.put('/profile', auth, userController.updateProfile.bind(userController));
    userRouter.get('/collection', auth, userController.getUserCollection.bind(userController));
    userRouter.post('/collection', auth, userController.addToCollection.bind(userController));
    userRouter.delete('/collection/:spiritId', auth, userController.removeFromCollection.bind(userController));
    this.app.use('/api/users', userRouter);
    
    // Default route
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Welcome to SpiritsVault API' });
    });
  }

  /**
   * Configure error handling
   */
  private setupErrorHandling(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!' });
    });
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      await connectDB();
      
      // Start Express server
      const PORT = process.env.PORT || 3000;
      this.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', (error as Error).message);
      process.exit(1);
    }
  }
}

// Export application for use in index.ts
export const app = new Application();
app.start(); 