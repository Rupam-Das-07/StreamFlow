import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Toggle like video
router.post('/like-video', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId } = req.body;
    const userId = req.user?.id;

    if (!videoId) {
      res.status(400).json({ message: 'Video ID is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isLiked = user.likedVideos.includes(videoId);
    
    if (isLiked) {
      // Remove from liked videos
      user.likedVideos = user.likedVideos.filter(id => id !== videoId);
    } else {
      // Add to liked videos
      user.likedVideos.push(videoId);
    }

    await user.save();

    res.json({
      message: isLiked ? 'Video removed from liked videos' : 'Video added to liked videos',
      isLiked: !isLiked,
      likedVideos: user.likedVideos
    });

  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's liked videos
router.get('/liked-videos', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      likedVideos: user.likedVideos
    });

  } catch (error) {
    console.error('Get liked videos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check if video is liked
router.get('/is-liked/:videoId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isLiked = user.likedVideos.includes(videoId);

    res.json({
      isLiked
    });

  } catch (error) {
    console.error('Check liked video error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new playlist
router.post('/playlists', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!name || name.trim().length === 0) {
      res.status(400).json({ message: 'Playlist name is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newPlaylist = {
      id: uuidv4(),
      name: name.trim(),
      videos: [],
      createdAt: new Date()
    };

    user.playlists.push(newPlaylist);
    await user.save();

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist: newPlaylist
    });

  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's playlists
router.get('/playlists', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      playlists: user.playlists
    });

  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add video to playlist
router.post('/playlists/:playlistId/add-video', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playlistId } = req.params;
    const { videoId } = req.body;
    const userId = req.user?.id;

    if (!videoId) {
      res.status(400).json({ message: 'Video ID is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const playlist = user.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    if (playlist.videos.includes(videoId)) {
      res.status(400).json({ message: 'Video already in playlist' });
      return;
    }

    playlist.videos.push(videoId);
    await user.save();

    res.json({
      message: 'Video added to playlist successfully',
      playlist
    });

  } catch (error) {
    console.error('Add video to playlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove video from playlist
router.delete('/playlists/:playlistId/remove-video', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playlistId } = req.params;
    const { videoId } = req.body;
    const userId = req.user?.id;

    if (!videoId) {
      res.status(400).json({ message: 'Video ID is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const playlist = user.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    playlist.videos = playlist.videos.filter(id => id !== videoId);
    await user.save();

    res.json({
      message: 'Video removed from playlist successfully',
      playlist
    });

  } catch (error) {
    console.error('Remove video from playlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete playlist
router.delete('/playlists/:playlistId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playlistId } = req.params;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const playlistIndex = user.playlists.findIndex(p => p.id === playlistId);
    if (playlistIndex === -1) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    user.playlists.splice(playlistIndex, 1);
    await user.save();

    res.json({
      message: 'Playlist deleted successfully'
    });

  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const stats = {
      likedCount: user.likedVideos.length,
      playlistCount: user.playlists.length,
      historyCount: user.watchHistory.length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
