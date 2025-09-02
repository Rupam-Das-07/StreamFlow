"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Play, Plus, Trash2, MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getPlaylists, deletePlaylist, getVideoDetails, createPlaylist } from "@/utils/musicApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Playlist {
  id: string;
  name: string;
  videos: string[];
  createdAt: string;
}

interface PlaylistVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
}

export default function PlaylistsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistVideos, setPlaylistVideos] = useState<Record<string, PlaylistVideo[]>>({});
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadPlaylists();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const { playlists } = await getPlaylists();
      setPlaylists(playlists);
      
      // Load video details for each playlist
      const videosData: Record<string, PlaylistVideo[]> = {};
      for (const playlist of playlists) {
        if (playlist.videos.length > 0) {
          const videoDetails = await Promise.all(
            playlist.videos.slice(0, 4).map(async (videoId: string) => {
              try {
                const details = await getVideoDetails(videoId);
                return {
                  id: videoId,
                  title: details.title,
                  thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                  channel: details.channelTitle
                };
              } catch (error) {
                console.error(`Error fetching details for video ${videoId}:`, error);
                return null;
              }
            })
          );
          videosData[playlist.id] = videoDetails.filter(Boolean) as PlaylistVideo[];
        } else {
          videosData[playlist.id] = [];
        }
      }
      setPlaylistVideos(videosData);
    } catch (error) {
      console.error('Error loading playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      setIsCreatingPlaylist(true);
      const { playlist } = await createPlaylist(newPlaylistName.trim());
      setPlaylists(prev => [...prev, playlist]);
      setPlaylistVideos(prev => ({ ...prev, [playlist.id]: [] }));
      setNewPlaylistName('');
      toast.success('Playlist created successfully');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string, playlistName: string) => {
    if (!confirm(`Are you sure you want to delete "${playlistName}"?`)) {
      return;
    }

    try {
      await deletePlaylist(playlistId);
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      setPlaylistVideos(prev => {
        const newVideos = { ...prev };
        delete newVideos[playlistId];
        return newVideos;
      });
      toast.success('Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-40" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Play className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Your Playlists</h1>
          </div>
          
          {/* Create New Playlist */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="playlist-name">Playlist Name</Label>
                  <Input
                    id="playlist-name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Enter playlist name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreatePlaylist();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleCreatePlaylist} 
                  disabled={isCreatingPlaylist || !newPlaylistName.trim()}
                  className="w-full"
                >
                  {isCreatingPlaylist ? "Creating..." : "Create Playlist"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">
          {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'} in your library
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden">
                <div className="relative">
                  {playlistVideos[playlist.id]?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {playlistVideos[playlist.id].slice(0, 4).map((video, i) => (
                        <AspectRatio key={video.id} ratio={16 / 9}>
                          <Image 
                            src={video.thumbnail} 
                            alt={video.title} 
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </AspectRatio>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Playlist Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/playlist/${playlist.id}`)}>
                          <Play className="h-4 w-4 mr-2" />
                          Play All
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeletePlaylist(playlist.id, playlist.name)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Playlist
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1 text-sm mb-2 group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => router.push(`/playlist/${playlist.id}`)}
                  >
                    {playlist.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'} • Created {formatDate(playlist.createdAt)}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first playlist to organize your favorite videos
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Discover Videos
          </button>
        </div>
      )}
    </div>
  );
}
