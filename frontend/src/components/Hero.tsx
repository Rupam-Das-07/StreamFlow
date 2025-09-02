"use client";

import * as React from "react";
import { motion } from "framer-motion";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/lib/auth-context";
import SearchBar from "@/components/SearchBar";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
};

export default function Hero({ value, onChange, onSubmit, loading }: Props) {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedGradientBackground />
      
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Floating particles */}
        <motion.div
          className="absolute left-1/4 top-1/4 h-2 w-2 rounded-full bg-blue-400/30"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/3 top-1/3 h-1.5 w-1.5 rounded-full bg-purple-400/40"
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute left-1/3 bottom-1/4 h-1 w-1 rounded-full bg-pink-400/35"
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Subtle gradient orbs */}
        <motion.div
          className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-gradient-to-tl from-pink-500/10 to-indigo-500/10 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 h-full px-4">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SearchBar
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
            placeholder="Try 'Lofi beats' or 'Taylor Swift'"
          />
        </motion.div>
        
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          search videos to get started
        </motion.p>



        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex flex-col items-center space-y-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="text-center space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Searching...
              </h3>
            </div>
            <Loader />
          </motion.div>
        )}
      </div>
    </section>
  );
}


