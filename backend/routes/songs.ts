import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const JAMENDO_API = 'https://api.jamendo.com/v3.0';
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';

console.log('JAMENDO_CLIENT_ID in songs route:', JAMENDO_CLIENT_ID);

// Build a search query from a video title by removing noisy tokens
function buildQueryFromTitle(title: string): string {
  const cleaned = title
    .replace(/\([^)]*\)|\[[^\]]*\]/g, '') // remove ( ... ) and [ ... ]
    .replace(/(official|video|lyrics|audio|mv|hd|4k|remaster(ed)?|live|performance)/gi, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s{2,}/g, ' ') // collapse multiple spaces
    .trim();
  return cleaned.length > 0 ? cleaned : title;
}

// Service: derive "related" videos using a two-step approach
async function getRelatedVideos(videoId: string) {
  // 1) Fetch video details to get title (and optionally channel)
  const detailsResp = await axios.get(`${YOUTUBE_API}/videos`, {
    params: {
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      id: videoId,
    },
  });
  const item = detailsResp.data.items?.[0];
  if (!item) throw new Error('Video not found');
  const title: string = item.snippet?.title || '';
  const channel: string = item.snippet?.channelTitle || '';

  // 2) Construct query from title
  const baseQuery = buildQueryFromTitle(title);
  const query = `${baseQuery} ${channel}`.trim();

  // 3) Perform a new search
  const searchResp = await axios.get(`${YOUTUBE_API}/search`, {
    params: {
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 15,
      videoCategoryId: '10',
    },
  });

  // 4) Filter out original and 5) map + limit
  const results = (searchResp.data.items || [])
    .filter((it: any) => it?.id?.videoId && it.id.videoId !== videoId)
    .slice(0, 10)
    .map((it: any) => ({
      id: it.id.videoId,
      title: it.snippet.title,
      channel: it.snippet.channelTitle,
      thumbnail: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url,
      publishedAt: it.snippet.publishedAt,
      viewCount: '0', // Not available in search results
      duration: 'PT0S', // Not available in search results
    }));

  return results;
}
console.log('YOUTUBE_API_KEY in songs route:', YOUTUBE_API_KEY);

// Search for tracks
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  try {
    const response = await axios.get(`${JAMENDO_API}/tracks`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 20,
        search: query,
      },
    });

    const tracks = response.data.results.map((track: any) => ({
      id: track.id,
      name: track.name,
      duration: track.duration,
      artist: track.artist_name,
      album: track.album_name,
      image: track.image,
      audio: track.audio,
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

// Stream a track
router.get('/stream/:track_id', async (req: Request, res: Response): Promise<void> => {
  const trackId = req.params.track_id;
  if (!trackId) {
    res.status(400).json({ error: 'Track ID is required' });
    return;
  }

  try {
    const response = await axios.get(`${JAMENDO_API}/tracks/${trackId}`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
      },
    });

    const track = response.data;
    res.json({
      id: track.id,
      name: track.name,
      duration: track.duration,
      artist: track.artist_name,
      album: track.album_name,
      image: track.image,
      audio: track.audio,
    });
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: 'Failed to stream track' });
  }
});

// YouTube search
router.get('/youtube/search', async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  try {
    const response = await axios.get(`${YOUTUBE_API}/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 20,
        videoCategoryId: '10', // Music category
      },
    });

    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: '0', // Not available in search results
      duration: 'PT0S', // Not available in search results
    }));

    res.json(videos);
  } catch (err) {
    console.error('YouTube search error:', err);
    res.status(500).json({ error: 'Failed to search YouTube' });
  }
});

// YouTube Playlist Details
router.get('/youtube/playlist', (req: Request, res: Response): void => {
  (async () => {
    const playlistId = req.query.playlistId as string;
    if (!playlistId) {
      res.status(400).json({ error: 'Missing playlistId' });
      return;
    }
    try {
      const response = await axios.get(`${YOUTUBE_API}/playlists`, {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          id: playlistId,
        },
      });
      const item = response.data.items[0];
      if (!item) {
        res.status(404).json({ error: 'Playlist not found' });
        return;
      }
      res.json({
        id: item.id,
        title: item.snippet.title,
        image: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
      });
    } catch (err) {
      console.error('YouTube playlist fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch playlist from YouTube' });
    }
  })();
});

// YouTube Trending Music Videos
router.get('/youtube/trending', async (req: Request, res: Response): Promise<void> => {
  const regionCode = (req.query.region as string) || 'US';
  try {
    const response = await axios.get(`${YOUTUBE_API}/videos`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        maxResults: 20,
        regionCode,
        videoCategoryId: '10',
      },
    });
    const videos = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || '0',
      duration: item.contentDetails?.duration || 'PT0S',
    }));
    res.json(videos);
  } catch (err) {
    console.error('YouTube trending fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch trending videos from YouTube' });
  }
});

// YouTube related videos for a given video id
router.get('/youtube/related', async (req: Request, res: Response): Promise<void> => {
  const videoId = req.query.videoId as string;
  if (!videoId) {
    res.status(400).json({ error: 'Missing videoId' });
    return;
  }
  try {
    const videos = await getRelatedVideos(videoId);
    res.json(videos);
  } catch (err) {
    // Log and fallback to trending
    const e: any = err;
    console.error('Derived related fetch error:', e?.message || e);
    try {
      const fallback = await axios.get(`${YOUTUBE_API}/videos`, {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet,statistics,contentDetails',
          chart: 'mostPopular',
          maxResults: 10,
          regionCode: 'US',
          videoCategoryId: '10',
        },
      });
      const videos = fallback.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics?.viewCount || '0',
        duration: item.contentDetails?.duration || 'PT0S',
      }));
      res.json(videos);
    } catch (fallbackErr) {
      console.error('Fallback trending fetch error:', (fallbackErr as any)?.message || fallbackErr);
      res.status(500).json({ error: 'Failed to fetch related videos' });
    }
  }
});

// Get video details
router.get('/youtube/video', async (req: Request, res: Response): Promise<void> => {
  const videoId = req.query.videoId as string;
  if (!videoId) {
    res.status(400).json({ error: 'Missing videoId' });
    return;
  }
  try {
    const response = await axios.get(`${YOUTUBE_API}/videos`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet,statistics,contentDetails',
        id: videoId,
      },
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }
    
    const video = response.data.items[0];
    const videoData = {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
      duration: video.contentDetails?.duration,
    };
    
    res.json(videoData);
  } catch (err) {
    console.error('YouTube video fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch video details from YouTube' });
  }
});

// Get video comments
router.get('/youtube/comments', async (req: Request, res: Response): Promise<void> => {
  const videoId = req.query.videoId as string;
  if (!videoId) {
    res.status(400).json({ error: 'Missing videoId' });
    return;
  }
  try {
    const response = await axios.get(`${YOUTUBE_API}/commentThreads`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        videoId: videoId,
        order: 'relevance',
        maxResults: 20,
      },
    });
    
    const comments = response.data.items.map((item: any) => ({
      id: item.id,
      authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      authorChannelUrl: item.snippet.topLevelComment.snippet.authorChannelUrl,
      textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      updatedAt: item.snippet.topLevelComment.snippet.updatedAt,
    }));
    
    res.json(comments);
  } catch (err) {
    console.error('YouTube comments fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch comments from YouTube' });
  }
});

export default router; 