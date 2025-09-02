"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getLikedVideos, getVideoDetails } from "@/utils/musicApi";
import { toast } from "sonner";

interface LikedVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  viewCount?: string;
  publishedAt?: string;
}

export default function LikedVideosPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadLikedVideos();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadLikedVideos = async () => {
    try {
      setLoading(true);
      const { likedVideos: videoIds } = await getLikedVideos();
      
      // Fetch details for each liked video
      const videoDetails = await Promise.all(
        videoIds.map(async (videoId: string) => {
          try {
            const details = await getVideoDetails(videoId);
            return {
              id: videoId,
              title: details.title,
              thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
              channel: details.channelTitle,
              viewCount: details.viewCount,
              publishedAt: details.publishedAt
            };
          } catch (error) {
            console.error(`Error fetching details for video ${videoId}:`, error);
            return null;
          }
        })
      );

      setLikedVideos(videoDetails.filter(Boolean) as LikedVideo[]);
    } catch (error) {
      console.error('Error loading liked videos:', error);
      toast.error('Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  const formatViewCount = (count?: string) => {
    if (!count) return '0 views';
    const num = parseInt(count);
    if (num < 1000) return `${num} views`;
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K views`;
    return `${(num / 1000000).toFixed(1)}M views`;
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Liked Videos</h1>
        </div>
        <p className="text-muted-foreground">
          {likedVideos.length} {likedVideos.length === 1 ? 'video' : 'videos'} in your liked collection
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="cursor-pointer group overflow-hidden" onClick={() => router.push(`/watch/${video.id}`)}>
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <Image 
                      src={video.thumbnail} 
                      alt={video.title} 
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-2 text-sm mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {video.channel}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <span>{formatViewCount(video.viewCount)}</span>
                    {video.publishedAt && (
                      <>
                        <span>•</span>
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No liked videos yet</h3>
          <p className="text-muted-foreground mb-6">
            Start liking videos to see them here
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
