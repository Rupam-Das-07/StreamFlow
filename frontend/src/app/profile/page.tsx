"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, User, Shield, Loader2, RefreshCw } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUserStats } from "@/utils/musicApi";
import { usePlaylist } from "@/components/playlist-context";
import { useHistory } from "@/components/history-context";

export default function ProfilePage() {
  const { user } = useAuth();
  const { refreshTrigger: playlistRefreshTrigger } = usePlaylist();
  const { refreshTrigger: historyRefreshTrigger } = useHistory();
  const [userStats, setUserStats] = useState<{ likedCount?: number; playlistCount?: number; historyCount?: number }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          setLoading(true);
          const { stats } = await getUserStats();
          setUserStats(stats);
        } catch (error) {
          console.error('Error fetching user stats:', error);
          setUserStats({
            likedCount: 0,
            playlistCount: 0,
            historyCount: 0
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [user, playlistRefreshTrigger, historyRefreshTrigger]); // Refresh when playlists or history change

  const handleRefreshStats = async () => {
    if (user) {
      try {
        setRefreshing(true);
        const { stats } = await getUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error('Error refreshing user stats:', error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Badge variant="secondary">Account</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.username}</h3>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                      {user.isEmailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>
                    Overview of your StreamFlow activity
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshStats}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {userStats.playlistCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Playlists</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {userStats.likedCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Liked Videos</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {userStats.historyCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Watch History</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Subscriptions</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Features */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Features we&apos;re working on to enhance your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Playlist Management</h4>
                <p className="text-sm text-muted-foreground">
                  Create, organize, and share your music playlists
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Watch History</h4>
                <p className="text-sm text-muted-foreground">
                  Track your listening history and discover patterns
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Social Features</h4>
                <p className="text-sm text-muted-foreground">
                  Follow friends and share your music discoveries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
