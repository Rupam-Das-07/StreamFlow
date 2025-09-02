"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Home, 
  Flame, 
  Video, 
  BookOpen, 
  History, 
  ThumbsUp,
  User,
  Settings,
  Play,
  Heart,
  Plus,
  Search,
  Music,
  Star
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/components/sidebar-context";
import { usePlaylist } from "@/components/playlist-context";
import { useHistory } from "@/components/history-context";
import { getUserStats } from "@/utils/musicApi";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const { user, isAuthenticated } = useAuth();
  const { refreshTrigger: playlistRefreshTrigger } = usePlaylist();
  const { refreshTrigger: historyRefreshTrigger } = useHistory();
  const [userStats, setUserStats] = useState<{ likedCount?: number; playlistCount?: number; historyCount?: number }>({});

  // Fetch user stats when authenticated and sidebar is open
  React.useEffect(() => {
    if (isAuthenticated && isOpen) {
      const fetchStats = async () => {
        try {
          const { stats } = await getUserStats();
          setUserStats(stats);
        } catch (error) {
          console.error('Error fetching user stats:', error);
          setUserStats({
            likedCount: 0,
            playlistCount: 0,
            historyCount: 0
          });
        }
      };
      fetchStats();
    }
  }, [isAuthenticated, isOpen, playlistRefreshTrigger, historyRefreshTrigger]); // Added refresh triggers dependency

  const links = [
    { 
      label: "Home", 
      href: "/", 
      icon: <Home className="h-5 w-5 shrink-0 text-foreground" />,
      functional: true,
      description: "Discover and search music"
    },
    { 
      label: "Trending", 
      href: "/?view=trending", 
      icon: <Flame className="h-5 w-5 shrink-0 text-foreground" />,
      functional: true,
      description: "Popular music videos"
    },
    ...(isAuthenticated ? [
      { 
        label: "Profile", 
        href: "/profile", 
        icon: <User className="h-5 w-5 shrink-0 text-foreground" />,
        functional: true,
        description: "Your account details"
      },
      { 
        label: "Settings", 
        href: "/settings", 
        icon: <Settings className="h-5 w-5 shrink-0 text-foreground" />,
        functional: true,
        description: "App preferences"
      }
    ] : []),
  ];

  const secondaryLinks = [
    { 
      label: "Liked Videos", 
      href: "/liked", 
      icon: <Heart className="h-5 w-5 shrink-0 text-foreground" />,
      functional: isAuthenticated,
      comingSoon: isAuthenticated ? undefined : "Login to see your liked videos",
      description: isAuthenticated && userStats.likedCount !== undefined 
        ? `${userStats.likedCount} videos` 
        : "Your favorite videos",
      badge: isAuthenticated ? "❤️" : undefined
    },
    { 
      label: "Playlists", 
      href: "/playlists", 
      icon: <Plus className="h-5 w-5 shrink-0 text-foreground" />,
      functional: isAuthenticated,
      comingSoon: isAuthenticated ? undefined : "Login to manage playlists",
      description: isAuthenticated && userStats.playlistCount !== undefined 
        ? `${userStats.playlistCount} playlists` 
        : "Create and organize playlists",
      badge: isAuthenticated ? "📝" : undefined
    },
    { 
      label: "Your Library", 
      href: "/library", 
      icon: <BookOpen className="h-5 w-5 shrink-0 text-foreground" />,
      functional: false,
      comingSoon: "Music library coming soon!",
      description: "Your music collection"
    },
    { 
      label: "History", 
      href: "/history", 
      icon: <History className="h-5 w-5 shrink-0 text-foreground" />,
      functional: isAuthenticated,
      comingSoon: isAuthenticated ? undefined : "Login to see your watch history",
      description: isAuthenticated && userStats.historyCount !== undefined 
        ? `${userStats.historyCount} videos` 
        : "Recently watched videos",
      badge: isAuthenticated ? "⏰" : undefined
    },
  ];

  const handleLinkClick = (link: { functional?: boolean; comingSoon?: string }, e: React.MouseEvent) => {
    if (!link.functional) {
      e.preventDefault();
      toast.info(link.comingSoon || "Feature coming soon!");
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        />
      )}
      
      <motion.div
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-40 h-[calc(100vh-56px)] px-4 py-4 flex flex-col shrink-0 border-r border-border overflow-hidden transition-all duration-300 bg-background/95 backdrop-blur-sm",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isOpen ? "w-80" : "w-80 md:w-20"
        )}
        initial={false}
      >
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {/* User Welcome Section (when authenticated) */}
        {isAuthenticated && user && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Primary Navigation */}
        <div className="flex flex-col gap-2">
                      {links.map((link, idx) => (
              <SidebarLink 
                key={`primary-${idx}`} 
                link={link} 
                expanded={isOpen}
                onClick={(e) => handleLinkClick(link, e)}
              />
            ))}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col gap-2">
            {secondaryLinks.map((link, idx) => (
              <SidebarLink 
                key={`secondary-${idx}`} 
                link={link} 
                expanded={isOpen}
                onClick={(e) => handleLinkClick(link, e)}
              />
            ))}
          </div>
        </div>

        {/* New Features Section */}
        {isOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-border"
          >
            <div className="space-y-3">
              <p className="text-xs font-medium text-primary">✨ New Features</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span>Like videos with heart icon</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Plus className="h-3 w-3 text-blue-500" />
                  <span>Create custom playlists</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Play className="h-3 w-3 text-green-500" />
                  <span>Organize your favorites</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Coming Soon Features */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto pt-6 border-t border-border"
          >
            <div className="text-center space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Coming Soon</p>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">📚 Music Library</div>
                <div className="text-xs text-muted-foreground">📺 Watch History</div>
                <div className="text-xs text-muted-foreground">🎯 Smart Recommendations</div>
                <div className="text-xs text-muted-foreground">👥 Social Features</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
    </>
  );
}

// SidebarLink component
const SidebarLink = ({ 
  link, 
  expanded, 
  className,
  onClick
}: { 
  link: { 
    label: string; 
    href: string; 
    icon: React.ReactNode; 
    functional?: boolean; 
    comingSoon?: string;
    description?: string;
    badge?: string;
  };
  expanded: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <motion.a
      href={link.href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-3 rounded-lg transition-all duration-200 relative overflow-hidden",
        link.functional 
          ? "hover:bg-accent hover:text-accent-foreground" 
          : "text-muted-foreground hover:bg-muted cursor-not-allowed",
        className
      )}
      whileHover={{ 
        x: link.functional ? 4 : 0,
        scale: link.functional ? 1.02 : 1,
      }}
      whileTap={{ scale: link.functional ? 0.98 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      title={!link.functional ? link.comingSoon : undefined}
    >
      {/* Hover background effect - only for functional links */}
      {link.functional && (
        <motion.div
          className="absolute inset-0 bg-accent/50 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: link.functional ? 5 : 0, scale: link.functional ? 1.1 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "transition-colors duration-200",
            !link.functional ? "opacity-60" : ""
          )}
        >
          {link.icon}
        </motion.div>

        <motion.div
          animate={{
            opacity: expanded ? 1 : 0,
            x: expanded ? 0 : -20,
            width: expanded ? "auto" : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex flex-col min-w-0"
        >
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium whitespace-nowrap overflow-hidden",
              !link.functional ? "italic" : ""
            )}>
              {link.label}
            </span>
            {link.badge && (
              <span className="text-xs">{link.badge}</span>
            )}
            {!link.functional && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Soon
              </span>
            )}
          </div>
          {link.description && expanded && (
            <span className="text-xs text-muted-foreground truncate">
              {link.description}
            </span>
          )}
        </motion.div>
      </div>
    </motion.a>
  );
};


