"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User, Palette, LogOut, Trash2, Mail, AlertTriangle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    try {
      const token = localStorage.getItem('streamflow_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification email sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('streamflow_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account deleted successfully');
        logout();
      } else {
        toast.error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Badge variant="secondary">Preferences</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user.username} disabled />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed after account creation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
                <div className="flex items-center gap-2">
                  <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                    {user.isEmailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                  {!user.isEmailVerified && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                    >
                      {isResendingVerification ? (
                        <>
                          <Mail className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Verification
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {!user.isEmailVerified && (
                  <p className="text-xs text-muted-foreground">
                    Check your email for a verification link. If you don't see it, check your spam folder.
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and updates
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new videos and updates
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Feature Announcements</Label>
                <p className="text-sm text-muted-foreground">
                  Show feature announcement popup again
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('feature-announcement-seen');
                    toast.success('Feature announcement will show again on next page load');
                  }}
                >
                  Reset Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your profile and playlists
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Watch History</Label>
                  <p className="text-sm text-muted-foreground">
                    Save your viewing history for recommendations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve StreamFlow with anonymous usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize your StreamFlow experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select id="language" name="language" className="w-full p-2 border rounded-md" aria-label="Select language">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <select id="region" name="region" className="w-full p-2 border rounded-md" aria-label="Select region">
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="GB">United Kingdom</option>
                  <option value="JP">Japan</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-play</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play next video in queue
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-destructive/10 p-4 rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">What will be deleted:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your account and profile information</li>
                        <li>• All your playlists</li>
                        <li>• Your liked videos</li>
                        <li>• Watch history</li>
                        <li>• All associated data</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        placeholder="••••••••"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeletePassword('')}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || !deletePassword.trim()}
                    >
                      {isDeleting ? (
                        <>
                          <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <h4 className="font-medium text-destructive">Logout</h4>
                <p className="text-sm text-muted-foreground">
                  Sign out of your current session
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
