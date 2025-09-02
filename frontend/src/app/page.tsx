"use client";
import React, { useState, useEffect } from 'react';
import { searchYouTubeMusic, fetchTrending } from '../utils/musicApi';
import SearchBar from "@/components/SearchBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchResults from "@/components/SearchResults";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Music, Heart } from "lucide-react";
import Loader from "@/components/ui/Loader";
import WelcomePopup from "@/components/WelcomePopup";
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const YouTubePlayer = ({ videoId, onClose }: { videoId: string, onClose: () => void }) => (
  <Dialog open={!!videoId} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Now playing</DialogTitle>
      </DialogHeader>
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </DialogContent>
  </Dialog>
);

const HomePage = () => {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [nav, setNav] = useState('home');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Array<{
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    channel?: string;
    publishedAt: string;
    viewCount: string;
    duration: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<string | null>(null);
  const [region, setRegion] = useState<string>('US');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isNewLogin, setIsNewLogin] = useState(false);

  // Check for view=trending query parameter on mount
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'trending') {
      setNav('search');
      setSearch('');
    }
  }, [searchParams]);

  // Show welcome popup for new and returning users
  useEffect(() => {
    if (isAuthenticated && user) {
      const lastVisit = localStorage.getItem(`streamflow_last_visit_${user.id}`);
      const now = new Date().toISOString();
      
      // Check if this is a fresh login (user just logged in)
      const freshLogin = sessionStorage.getItem('streamflow_fresh_login');
      
      if (!lastVisit || freshLogin === 'true') {
        // First time user or fresh login - show popup immediately
        setShowWelcomePopup(true);
        localStorage.setItem(`streamflow_last_visit_${user.id}`, now);
        sessionStorage.removeItem('streamflow_fresh_login'); // Clear the flag
      } else {
        // Returning user - show popup if hasn't visited in 24+ hours
        const lastVisitDate = new Date(lastVisit);
        const daysSinceLastVisit = (Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastVisit >= 1) {
          setShowWelcomePopup(true);
          localStorage.setItem(`streamflow_last_visit_${user.id}`, now);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Update URL when trending view is active
  useEffect(() => {
    if (nav === 'search' && search.trim() === '') {
      // Update URL to show trending view
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'trending');
      window.history.replaceState({}, '', url.toString());
    } else if (nav === 'home') {
      // Remove view parameter when on home
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url.toString());
    }
  }, [nav, search]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchYouTubeMusic(search);
      setResults(data);
      setNav('search');
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load trending when on Trending tab with empty query
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (nav !== 'search' || search.trim() !== '') return;
      setLoading(true);
      try {
        console.log('Fetching trending videos for region:', region);
        const data = await fetchTrending(region);
        console.log('Trending data received:', data);
        if (!cancelled) setResults(data);
      } catch (error) {
        console.error('Error fetching trending videos:', error);
        if (!cancelled) {
          setResults([]);
          // Show error message to user
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [nav, search, region]);

  let mainContent;
  if (nav === 'home') {
    mainContent = (
      <section className="flex-1 space-y-10 overflow-hidden p-8">

        
        <Hero
          value={search}
          onChange={setSearch}
          onSubmit={handleSearch}
          loading={loading}
        />
      </section>
    );
  } else if (nav === 'search') {
    const isTrending = search.trim() === '';

    mainContent = (
      <>
        {isTrending ? (
          <>
            {/* Enhanced Header with Search Bar */}
            <header className="border-b bg-card p-6">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                {/* Top Row: Back Button and Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setNav('home');
                        setSearch('');
                        setResults([]);
                      }}
                      className="mr-2 p-2 hover:bg-accent rounded-md transition-colors"
                      title="Back to Home"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Flame size={18} />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">Trending Now</h2>
                      <p className="text-sm text-muted-foreground">Most popular music videos right now</p>
                    </div>
                  </div>
                  
                  {/* Region Selector and Refresh */}
                  <div className="flex items-center gap-4">
                    <Tabs value={region} onValueChange={(v) => setRegion(v)}>
                      <TabsList>
                        <TabsTrigger value="US">US</TabsTrigger>
                        <TabsTrigger value="IN">IN</TabsTrigger>
                        <TabsTrigger value="GB">UK</TabsTrigger>
                        <TabsTrigger value="JP">JP</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const data = await fetchTrending(region);
                          setResults(data);
                        } catch (error) {
                          console.error('Error refreshing trending:', error);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                </div>

                {/* Search Bar Row */}
                <div className="w-full max-w-2xl mx-auto">
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    onSubmit={handleSearch}
                    loading={loading}
                    placeholder="Search for any song, artist, or genre..."
                    className="w-full"
                  />
                </div>
              </div>
            </header>
          </>
        ) : (
          <header className="border-b bg-card p-6">
            <div className="w-full max-w-3xl mx-auto">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmit={handleSearch}
                loading={loading}
                placeholder="Search for any song, artist, or genre..."
              />
            </div>
          </header>
        )}
        <section className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium text-foreground">Searching for your music...</h3>
                <p className="text-sm text-muted-foreground">Please wait while we find the perfect songs for you</p>
              </div>
              <Loader />
            </div>
          ) : results.length > 0 ? (
            <div>

              
              {!isTrending && <h2 className="mb-6 text-2xl font-bold">Search Results</h2>}
              <SearchResults items={results} />
            </div>
          ) : (
            <div className="text-center mt-16 space-y-4">
              <div className="text-muted-foreground text-lg">
                {isTrending ? 'No trending items found.' : 'Search for any song, artist, or genre to get started!'}
              </div>
              {!isTrending && (
                <div className="text-sm text-muted-foreground">
                  Try searching for popular artists, songs, or genres
                </div>
              )}
              {isTrending && (
                <div className="text-sm text-muted-foreground">
                  Try changing the region or refreshing the page
                </div>
              )}
            </div>
          )}
        </section>
      </>
    );
  } else if (nav === 'playlists') {
    mainContent = (
      <section className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Your Playlists</h2>
        <p className="text-muted-foreground">Playlist functionality coming soon!</p>
      </section>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-1 flex-col">
      {mainContent}
      {player && <YouTubePlayer videoId={player} onClose={() => setPlayer(null)} />}
      
      {/* Welcome Popup */}
      {showWelcomePopup && isAuthenticated && user && (
        <WelcomePopup 
          username={user.username} 
          onClose={() => setShowWelcomePopup(false)} 
        />
      )}
    </motion.div>
  );
};

export default HomePage;
