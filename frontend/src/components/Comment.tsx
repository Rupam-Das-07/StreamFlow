import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface CommentProps {
  author: string;
  text: string;
  avatarUrl?: string;
  likeCount?: number;
  publishedAt?: string;
}

export default function Comment({ author, text, avatarUrl, likeCount, publishedAt }: CommentProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const formatLikeCount = (count?: number) => {
    if (!count) return '';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={author} />
              <AvatarFallback className="bg-muted text-xs font-medium">
                {author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{author}</span>
                {publishedAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(publishedAt)}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {text}
              </p>
              
              {likeCount !== undefined && likeCount > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatLikeCount(likeCount)} like{likeCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
