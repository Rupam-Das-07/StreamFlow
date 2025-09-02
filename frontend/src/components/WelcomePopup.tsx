"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface WelcomePopupProps {
  username: string;
  onClose: () => void;
}

export default function WelcomePopup({ username, onClose }: WelcomePopupProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  };

  // Auto-hide after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full max-w-md mx-4"
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.5 
            }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-2xl">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full hover:bg-primary/20"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Welcome to StreamFlow! 🎵
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                <div className="space-y-3">
                  <p className="text-lg font-medium text-foreground">
                    Welcome, <span className="text-primary font-semibold">@{username}</span>!
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your music journey starts here. Discover new tracks, explore trending hits, 
                    and create your perfect playlist.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Discover</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Favorites</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Playlists</span>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    // Close popup and navigate to trending section
                    handleClose();
                    router.push('/?view=trending');
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-lg font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  🚀 Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
