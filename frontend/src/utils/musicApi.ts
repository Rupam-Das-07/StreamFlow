const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
import { getToken } from '@/lib/auth';

export async function fetchSongs() {
  const res = await fetch(`${API_BASE_URL}/songs`);
  if (!res.ok) throw new Error('Failed to fetch songs');
  return res.json();
}

export async function searchSongs(query: string) {
  const res = await fetch(`${API_BASE_URL}/songs/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search songs');
  return res.json();
}

export async function getStreamUrl(trackId: string) {
  const res = await fetch(`${API_BASE_URL}/songs/stream/${trackId}`);
  if (!res.ok) throw new Error('Failed to get stream URL');
  const data = await res.json();
  return data.url;
}

export async function searchYouTubeMusic(query: string) {
  const res = await fetch(`${API_BASE_URL}/songs/youtube/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search YouTube music');
  return res.json();
}

export async function fetchYouTubePlaylist(playlistId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/songs/youtube/playlist?playlistId=${playlistId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function searchYouTubeAlbums(queries: string[]) {
  // queries: array of album search terms
  const results = await Promise.all(
    queries.map(async (q) => {
      const res = await fetch(`${API_BASE_URL}/songs/youtube/search?q=${encodeURIComponent(q + ' album')}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    })
  );
  return results.filter(Boolean);
} 

export async function fetchTrending(region: string = 'US') {
  const res = await fetch(`${API_BASE_URL}/songs/youtube/trending?region=${encodeURIComponent(region)}`);
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
}

export async function fetchRelated(videoId: string) {
  const res = await fetch(`${API_BASE_URL}/songs/youtube/related?videoId=${encodeURIComponent(videoId)}`);
  if (!res.ok) throw new Error('Failed to fetch related');
  return res.json();
}

export async function getVideoDetails(videoId: string) {
  const res = await fetch(`${API_BASE_URL}/songs/youtube/video?videoId=${encodeURIComponent(videoId)}`);
  if (!res.ok) throw new Error('Failed to fetch video details');
  return res.json();
}

export async function getVideoComments(videoId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/songs/youtube/comments?videoId=${encodeURIComponent(videoId)}`);
    if (!res.ok) {
      console.error('Failed to fetch comments:', res.status, res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching video comments:', error);
    return [];
  }
}

// User actions API functions
export async function toggleLikeVideo(videoId: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/like-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ videoId })
  });
  
  if (!res.ok) throw new Error('Failed to toggle like video');
  return res.json();
}

export async function getLikedVideos() {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/liked-videos`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to get liked videos');
  return res.json();
}

export async function checkIfLiked(videoId: string) {
  const token = getToken();
  if (!token) return { isLiked: false };

  try {
    const res = await fetch(`${API_BASE_URL}/user/is-liked/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) return { isLiked: false };
    return res.json();
  } catch (error) {
    return { isLiked: false };
  }
}

export async function createPlaylist(name: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  
  if (!res.ok) throw new Error('Failed to create playlist');
  return res.json();
}

export async function getPlaylists() {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/playlists`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to get playlists');
  return res.json();
}

export async function addVideoToPlaylist(playlistId: string, videoId: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/playlists/${playlistId}/add-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ videoId })
  });
  
  if (!res.ok) throw new Error('Failed to add video to playlist');
  return res.json();
}

export async function removeVideoFromPlaylist(playlistId: string, videoId: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/playlists/${playlistId}/remove-video`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ videoId })
  });
  
  if (!res.ok) throw new Error('Failed to remove video from playlist');
  return res.json();
}

export async function deletePlaylist(playlistId: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/playlists/${playlistId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to delete playlist');
  return res.json();
}

// History management
export async function addToHistory(videoId: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/history/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ videoId })
  });
  
  if (!res.ok) throw new Error('Failed to add to history');
  return res.json();
}

export async function getHistory() {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/history`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to get history');
  return res.json();
}

export async function clearHistory() {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/history/clear`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to clear history');
  return res.json();
}

export async function removeFromHistory(videoId: string) {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/history/remove/${videoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to remove from history');
  return res.json();
}

// User stats
export async function getUserStats() {
  const token = getToken();
  if (!token) throw new Error('User not authenticated');

  const res = await fetch(`${API_BASE_URL}/user/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) throw new Error('Failed to get user stats');
  return res.json();
}