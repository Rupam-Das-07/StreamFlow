import { Router, Request, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendVerificationEmail, sendAccountDeletedEmail } from '../services/emailService';

const router = Router();

// Register new user
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    await newUser.save();

    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(email, username, verificationToken);
      console.log('Signup verification email result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      isEmailVerified: newUser.isEmailVerified,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if user has password (not Google OAuth only)
    if (!user.password) {
      res.status(401).json({ message: 'Please use Google OAuth to login' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response): void => {
    // Successful authentication
    const user = req.user as any;
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// Get current user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
});

// Verify token
router.post('/verify', authenticateToken, (req: Request, res: Response): void => {
  res.json({ message: 'Token is valid', user: (req as any).user });
});

// Verify email
router.get('/verify-email/:token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    // Find user with this verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired verification token' });
      return;
    }

    // Mark email as verified and clear token
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Resend verification email
router.post('/resend-verification', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const user = authReq.user;

    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ message: 'Email is already verified' });
      return;
    }

    // Generate new verification token
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(updatedUser.email, updatedUser.username, verificationToken);
      if (emailResult.success) {
        res.json({ message: 'Verification email sent successfully' });
      } else {
        res.status(500).json({ message: 'Failed to send verification email' });
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete account
router.delete('/delete-account', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const user = authReq.user;
    const { password } = req.body;

    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Get full user data including password for verification
    const fullUser = await User.findById(user._id);
    if (!fullUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // For non-Google users, require password confirmation
    if (fullUser.password && !fullUser.googleId) {
      if (!password) {
        res.status(400).json({ message: 'Password is required to delete account' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, fullUser.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }
    }

    // Store user info for email before deletion
    const userEmail = fullUser.email;
    const username = fullUser.username;

    // Delete the user
    await User.findByIdAndDelete(fullUser._id);

    // Send confirmation email
    try {
      const emailResult = await sendAccountDeletedEmail(userEmail, username);
      console.log('Account deletion email result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send deletion confirmation email:', emailError);
      // Don't fail the deletion if email fails
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test email route (for development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-email', async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username } = req.body;
      
      if (!email || !username) {
        res.status(400).json({ message: 'Email and username required' });
        return;
      }

      const verificationToken = uuidv4();
      const emailResult = await sendVerificationEmail(email, username, verificationToken);
      
      res.json({ 
        message: 'Test email sent', 
        success: emailResult.success,
        token: verificationToken 
      });
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ message: 'Test email failed' });
    }
  });
}

export default router; 