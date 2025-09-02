"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Crown, Menu } from "lucide-react";
import AnimatedThemeToggler from "@/components/magicui/animated-theme-toggler";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/components/sidebar-context";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toggle } = useSidebar();
  // Global search state
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // You may want to lift handleSearch to a context for global access
  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // You may want to call a global search function or context here
      // For now, just setLoading(false) after a timeout
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-8 w-8 rounded-md hover:bg-accent"
            onClick={toggle}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/app%20logo%20-%20light.png" 
              alt="StreamFlow" 
              width={40}
              height={40}
              className="rounded-lg dark:hidden" 
            />
            <Image 
              src="/app%20logo%20-%20dark.png" 
              alt="StreamFlow" 
              width={40}
              height={40}
              className="rounded-lg hidden dark:block" 
            />
            <span className="text-lg font-semibold font-heading">StreamFlow</span>
          </Link>
        </div>
        {/* Centered SearchBar */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            {/* SearchBar component was removed from imports, so this div is now empty */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {getInitials(user?.username || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


