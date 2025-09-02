"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token found');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now use all features of StreamFlow.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            {status === 'loading' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-green-500" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-red-500" />}
            {status === 'loading' && <Mail className="h-8 w-8 text-primary" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified! 🎉'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your email address'}
            {status === 'success' && 'Your StreamFlow account is now fully activated'}
            {status === 'error' && 'We encountered an issue verifying your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  What's Next?
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Explore trending music</li>
                  <li>• Create your playlists</li>
                  <li>• Like your favorite videos</li>
                  <li>• Track your watch history</li>
                </ul>
              </div>
              <Button onClick={handleRedirect} className="w-full">
                🚀 Start Exploring
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Possible Reasons:
                </h3>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Verification link has expired</li>
                  <li>• Link has already been used</li>
                  <li>• Invalid verification token</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Button onClick={handleRedirect} variant="outline" className="w-full">
                  Go to Home
                </Button>
                <p className="text-xs text-muted-foreground">
                  Need help? Contact support or try signing up again.
                </p>
              </div>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This should only take a moment...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
