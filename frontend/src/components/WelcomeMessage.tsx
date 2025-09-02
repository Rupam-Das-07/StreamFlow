"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Waves, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomeMessageProps {
  className?: string;
}

export default function WelcomeMessage({ className = "" }: WelcomeMessageProps) {
  const { user, isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if this is the user's first visit
      const lastVisit = localStorage.getItem(`lastVisit_${user.id}`);
      const isFirstVisit = !lastVisit;
      
      setIsFirstTime(isFirstVisit);
      setShowWelcome(true);

      // Store the current visit timestamp
      localStorage.setItem(`lastVisit_${user.id}`, new Date().toISOString());

      // Show welcome message
      if (isFirstVisit) {
        toast.success(
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Welcome to StreamFlow! 🎵</span>
          </div>,
          {
            duration: 5000,
            description: "We're excited to have you on board!"
          }
        );
      } else {
        toast.success(
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-blue-500" />
            <span>Welcome back, {user.username}! 👋</span>
          </div>,
          {
            duration: 3000,
            description: "Great to see you again!"
          }
        );
      }

      // Hide welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  if (!showWelcome || !isAuthenticated || !user) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
      >
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex items-center gap-3">
            {isFirstTime ? (
              <>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Welcome to StreamFlow! 🎵
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start exploring music and create your perfect playlist
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Welcome back, {user.username}! 👋
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We missed you! Continue your musical journey
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
