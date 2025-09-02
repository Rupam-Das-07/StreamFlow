import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  likedVideos: string[];
  playlists: Array<{
    id: string;
    name: string;
    videos: string[];
    createdAt: Date;
  }>;
  watchHistory: Array<{
    videoId: string;
    watchedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  likedVideos: [{
    type: String,
    default: []
  }],
  playlists: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    videos: [{
      type: String,
      default: []
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  watchHistory: [{
    videoId: {
      type: String,
      required: true
    },
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export default mongoose.model<IUser>('User', userSchema);
