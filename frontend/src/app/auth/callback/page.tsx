"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleOAuthCallback } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setError("No authentication token received");
      return;
    }

    try {
      // Handle the OAuth callback with the token
      handleOAuthCallback(token);
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error("OAuth callback error:", err);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Completing Authentication</h1>
        <p className="text-muted-foreground">Please wait while we complete your sign-in...</p>
      </div>
    </div>
  );
}
