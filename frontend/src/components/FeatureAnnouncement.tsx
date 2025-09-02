"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Play, X } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureAnnouncement() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the announcement
    const hasSeenAnnouncement = localStorage.getItem('feature-announcement-seen');
    
    if (!hasSeenAnnouncement) {
      // Show after a short delay to let the page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen
    localStorage.setItem('feature-announcement-seen', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-center flex-1">
              🎉 New Features Available!
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We've added exciting new features to enhance your music streaming experience!
            </p>
          </div>

          <div className="space-y-4">
            {/* Like Videos Feature */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-100">Like Videos</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Click the heart icon on any video to save it to your liked videos collection
                </p>
              </div>
            </motion.div>

            {/* Add to Playlist Feature */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Create Playlists</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Organize your favorite videos into custom playlists for easy access
                </p>
              </div>
            </motion.div>

            {/* Access Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100">Easy Access</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Find your liked videos and playlists in the sidebar navigation
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleClose}
              className="flex-1"
            >
              Got it!
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                handleClose();
                // Navigate to a video page to try the features
                window.location.href = '/?view=trending';
              }}
              className="flex-1"
            >
              Try Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
