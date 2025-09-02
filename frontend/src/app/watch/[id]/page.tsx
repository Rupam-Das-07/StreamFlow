"use client";

import React from 'react';
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchRelated, getVideoDetails, getVideoComments, addToHistory } from "@/utils/musicApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Comment from "@/components/Comment";
import VideoActions from "@/components/VideoActions";
import { useAuth } from "@/lib/auth-context";
import { useHistory } from "@/components/history-context";
import SearchBar from "@/components/SearchBar";

interface VideoDetails {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  viewCount?: string;
  likeCount?: string;
  publishedAt?: string;
}

interface CommentData {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl?: string;
  textDisplay: string;
  likeCount?: number;
  publishedAt?: string;
}

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { refreshHistory } = useHistory();
  const videoId = params?.id as string;
  const [related, setRelated] = React.useState<Array<{
    id: string;
    title: string;
    thumbnail: string;
    channel: string;
  }>>([]);
  const [videoDetails, setVideoDetails] = React.useState<VideoDetails | null>(null);
  const [comments, setComments] = React.useState<CommentData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [commentsLoading, setCommentsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [searchLoading, setSearchLoading] = React.useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    setSearchLoading(true);
    // Redirect to homepage with search query as param
    router.push(`/?q=${encodeURIComponent(search)}`);
    setSearchLoading(false);
  };

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        // Fetch video details and comments concurrently
        const [detailsData, relatedData, commentsData] = await Promise.all([
          getVideoDetails(videoId),
          fetchRelated(videoId),
          getVideoComments(videoId)
        ]);
        
        if (!cancelled) {
          setVideoDetails(detailsData);
          setRelated(relatedData);
          setComments(commentsData);
          
          // Add video to history if user is authenticated
          if (isAuthenticated) {
            try {
              await addToHistory(videoId);
              refreshHistory(); // Trigger refresh in other components
            } catch (error) {
              console.error('Error adding to history:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!cancelled) {
          // Still try to fetch related videos even if details fail
          try {
            const relatedData = await fetchRelated(videoId);
            if (!cancelled) setRelated(relatedData);
          } catch (relatedError) {
            console.error('Error fetching related videos:', relatedError);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setCommentsLoading(false);
        }
      }
    };
    
    if (videoId) run();
    return () => { cancelled = true; };
  }, [videoId]);

  const formatViewCount = (count?: string) => {
    if (!count) return '0 views';
    const num = parseInt(count);
    if (num < 1000) return `${num} views`;
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K views`;
    return `${(num / 1000000).toFixed(1)}M views`;
  };

  const formatLikeCount = (count?: string) => {
    if (!count) return '0';
    const num = parseInt(count);
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-56px)] gap-6 p-4 md:p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar positioned above video */}
        <div className="w-full flex justify-end mb-16">
          <div className="max-w-2xl w-full">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              loading={searchLoading}
              placeholder="Search for any song, artist, or genre..."
              className="w-full h-6"
            />
          </div>
        </div>
        
        {/* Player */}
        <div className="overflow-hidden rounded-xl border">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video Details */}
        {videoDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {videoDetails.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{formatViewCount(videoDetails.viewCount)}</span>
                <span>•</span>
                <span>{videoDetails.publishedAt ? new Date(videoDetails.publishedAt).toLocaleDateString() : ''}</span>
                {videoDetails.likeCount && (
                  <>
                    <span>•</span>
                    <span>❤️ {formatLikeCount(videoDetails.likeCount)}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {videoDetails.channelTitle}
              </p>
              
              {/* Video Actions */}
              <div className="mt-4">
                <VideoActions videoId={videoId} videoTitle={videoDetails.title} />
              </div>
            </div>

            {/* Description */}
            {videoDetails.description && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {videoDetails.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Comments ({comments.length})
              </h3>
              
              {commentsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-2">
                  {comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      author={comment.authorDisplayName}
                      text={comment.textDisplay}
                      avatarUrl={comment.authorProfileImageUrl}
                      likeCount={comment.likeCount}
                      publishedAt={comment.publishedAt}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Related Videos Sidebar */}
      <aside className="w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Related</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-20 w-32 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {related.map((v) => (
              <motion.div whileHover={{ scale: 1.01 }} key={v.id}>
                <Card className="cursor-pointer" onClick={() => router.push(`/watch/${v.id}`)}>
                  <CardContent className="flex gap-3 p-3">
                    <div className="w-32">
                      <AspectRatio ratio={16 / 9}>
                        <Image 
                          src={v.thumbnail} 
                          alt={v.title} 
                          fill
                          className="rounded object-cover"
                          sizes="128px"
                        />
                      </AspectRatio>
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardHeader className="p-0">
                        <CardTitle className="line-clamp-2 text-sm">{v.title}</CardTitle>
                        <CardDescription className="text-xs">{v.channel}</CardDescription>
                      </CardHeader>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}


