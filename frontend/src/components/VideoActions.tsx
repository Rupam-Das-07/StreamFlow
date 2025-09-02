"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Plus, Play, MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePlaylist } from "@/components/playlist-context";
import { toggleLikeVideo, checkIfLiked, getPlaylists, createPlaylist, addVideoToPlaylist } from "@/utils/musicApi";
import { toast } from "sonner";

interface VideoActionsProps {
  videoId: string;
  videoTitle: string;
}

interface Playlist {
  id: string;
  name: string;
  videos: string[];
  createdAt: string;
}

export default function VideoActions({ videoId, videoTitle }: VideoActionsProps) {
  const { isAuthenticated } = useAuth();
  const { refreshPlaylists } = usePlaylist();
  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkLikeStatus();
      loadPlaylists();
    }
  }, [isAuthenticated, videoId]);

  const checkLikeStatus = async () => {
    try {
      const { isLiked } = await checkIfLiked(videoId);
      setIsLiked(isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const loadPlaylists = async () => {
    try {
      const { playlists } = await getPlaylists();
      setPlaylists(playlists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos');
      return;
    }

    try {
      setIsLoading(true);
      const { isLiked: newLikeStatus } = await toggleLikeVideo(videoId);
      setIsLiked(newLikeStatus);
      toast.success(newLikeStatus ? 'Added to liked videos' : 'Removed from liked videos');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsLoading(false);
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
      setNewPlaylistName('');
      
      // Automatically add video to the new playlist
      await addVideoToPlaylist(playlist.id, videoId);
      
      // Close the dialog and show success message
      setIsPlaylistDialogOpen(false);
      refreshPlaylists(); // Trigger refresh in other components
      toast.success(`Created "${playlist.name}" and added video!`);
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    try {
      await addVideoToPlaylist(playlistId, videoId);
      setIsPlaylistDialogOpen(false);
      refreshPlaylists(); // Trigger refresh in other components
      toast.success(`Added to "${playlistName}"`);
    } catch (error) {
      console.error('Error adding to playlist:', error);
      toast.error('Failed to add to playlist');
    }
  };

  const isVideoInPlaylist = (playlist: Playlist) => {
    return playlist.videos.includes(videoId);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => toast.error('Please login to like videos')}>
          <Heart className="h-4 w-4 mr-2" />
          Like
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.error('Please login to add to playlist')}>
          <Plus className="h-4 w-4 mr-2" />
          Add to Playlist
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Like Button */}
      <Button 
        variant={isLiked ? "default" : "outline"} 
        size="sm" 
        onClick={handleLikeToggle}
        disabled={isLoading}
        className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
      >
        <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
        {isLiked ? "Liked" : "Like"}
      </Button>

      {/* Add to Playlist - Direct Dialog */}
      <Dialog 
        open={isPlaylistDialogOpen} 
        onOpenChange={(open) => {
          setIsPlaylistDialogOpen(open);
          if (!open) {
            setNewPlaylistName(''); // Reset input when dialog closes
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add to Playlist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Existing Playlists Section */}
            {playlists.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Add to existing playlist:</Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {playlists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
                      disabled={isVideoInPlaylist(playlist)}
                      className="w-full justify-start"
                    >
                      <span className="truncate flex-1 text-left">{playlist.name}</span>
                      {isVideoInPlaylist(playlist) && (
                        <span className="text-xs text-muted-foreground ml-2">✓ Added</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {playlists.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
            )}

            {/* Create New Playlist Section */}
            <div className="space-y-2">
              <Label htmlFor="playlist-name" className="text-sm font-medium">
                Create new playlist:
              </Label>
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
              <Button 
                onClick={handleCreatePlaylist} 
                disabled={isCreatingPlaylist || !newPlaylistName.trim()}
                className="w-full"
              >
                {isCreatingPlaylist ? "Creating..." : "Create & Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
