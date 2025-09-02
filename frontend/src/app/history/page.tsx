"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  History, 
  Trash2, 
  MoreVertical, 
  Play,
  Clock,
  Eye
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getHistory, clearHistory, removeFromHistory } from '@/utils/musicApi';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  watchedAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadHistory();
  }, [isAuthenticated, router]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { history: historyData } = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      setClearing(true);
      await clearHistory();
      setHistory([]);
      toast.success('History cleared successfully');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  const handleRemoveFromHistory = async (videoId: string) => {
    try {
      await removeFromHistory(videoId);
      setHistory(prev => prev.filter(item => item.id !== videoId));
      toast.success('Video removed from history');
    } catch (error) {
      console.error('Error removing from history:', error);
      toast.error('Failed to remove from history');
    }
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num < 1000) return `${num} views`;
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K views`;
    return `${(num / 1000000).toFixed(1)}M views`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Watch History</h1>
            <p className="text-muted-foreground">
              {history.length} {history.length === 1 ? 'video' : 'videos'} in your history
            </p>
          </div>
        </div>
        
        {history.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleClearHistory}
            disabled={clearing}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {clearing ? 'Clearing...' : 'Clear History'}
          </Button>
        )}
      </div>

      {/* History List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex gap-4 p-4">
                <Skeleton className="h-24 w-40 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-40 h-24 flex-shrink-0">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="160px"
                      />
                    </AspectRatio>
                    <Button
                      size="sm"
                      className="absolute inset-0 m-auto w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => router.push(`/watch/${item.id}`)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2 text-base mb-2 group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => router.push(`/watch/${item.id}`)}
                    >
                      {item.title}
                    </CardTitle>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{item.channelTitle}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViewCount(item.viewCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Watched {formatDate(item.watchedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/watch/${item.id}`)}>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Again
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveFromHistory(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No watch history yet</h3>
          <p className="text-muted-foreground mb-6">
            Videos you watch will appear here
          </p>
          <Button onClick={() => router.push('/')}>
            Start Watching
          </Button>
        </div>
      )}
    </div>
  );
}

