import express from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';
import axios from 'axios';

const router = express.Router();

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';

// Add video to watch history
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.body;
    const userId = (req as any).user.id;

    if (!videoId) {
      res.status(400).json({ error: 'Video ID is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Remove existing entry if video is already in history (to update timestamp)
    user.watchHistory = user.watchHistory.filter(item => item.videoId !== videoId);
    
    // Add video to the beginning of history (most recent first)
    user.watchHistory.unshift({
      videoId,
      watchedAt: new Date()
    });

    // Keep only the last 100 videos in history
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(0, 100);
    }

    await user.save();

    res.json({ message: 'Video added to history' });
  } catch (error) {
    console.error('Error adding to history:', error);
    res.status(500).json({ error: 'Failed to add to history' });
  }
});

// Get user's watch history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.watchHistory.length === 0) {
      res.json({ history: [] });
      return;
    }

    // Get video IDs from history
    const videoIds = user.watchHistory.map(item => item.videoId);
    
    // Fetch video details from YouTube API
    const videoIdsString = videoIds.join(',');
    const response = await axios.get(`${YOUTUBE_API}/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoIdsString,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items || [];
    
    // Map videos to history items with watchedAt timestamp
    const historyWithDetails = user.watchHistory.map(historyItem => {
      const video = videos.find((v: any) => v.id === historyItem.videoId);
      if (video) {
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          viewCount: video.statistics?.viewCount || '0',
          watchedAt: historyItem.watchedAt
        };
      }
      return null;
    }).filter(Boolean);

    res.json({ history: historyWithDetails });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Clear watch history
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.watchHistory = [];
    await user.save();

    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// Remove specific video from history
router.delete('/remove/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.watchHistory = user.watchHistory.filter(item => item.videoId !== videoId);
    await user.save();

    res.json({ message: 'Video removed from history' });
  } catch (error) {
    console.error('Error removing from history:', error);
    res.status(500).json({ error: 'Failed to remove from history' });
  }
});

export default router;

