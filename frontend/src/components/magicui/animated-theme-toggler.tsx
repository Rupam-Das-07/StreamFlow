"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AnimatedThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent SSR issues
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted-foreground/20" />
      </Button>
    );
  }

  const toggleTheme = () => {
    try {
      if (theme === "light") {
        setTheme("dark");
      } else if (theme === "dark") {
        setTheme("system");
      } else {
        setTheme("light");
      }
    } catch (error) {
      console.error("Error toggling theme:", error);
      // Fallback to light theme if there's an error
      setTheme("light");
    }
  };

  const getIcon = () => {
    try {
      switch (theme) {
        case "light":
          return <Sun size={18} />;
        case "dark":
          return <Moon size={18} />;
        default:
          return <Monitor size={18} />;
      }
    } catch (error) {
      console.error("Error getting icon:", error);
      return <Monitor size={18} />;
    }
  };

  const getTooltip = () => {
    try {
      switch (theme) {
        case "light":
          return "Switch to dark mode";
        case "dark":
          return "Switch to system preference";
        default:
          return "Switch to light mode";
      }
    } catch (error) {
      console.error("Error getting tooltip:", error);
      return "Toggle theme";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 relative overflow-hidden"
        onClick={toggleTheme}
        aria-label={getTooltip()}
        title={getTooltip()}
      >
        <motion.div
          key={theme || "default"}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {getIcon()}
        </motion.div>
        
        {/* Theme indicator ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          animate={{
            borderColor: theme === "light" ? "#fbbf24" : theme === "dark" ? "#6366f1" : "#10b981",
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            repeat: 0,
          }}
        />
      </Button>
    </motion.div>
  );
}
