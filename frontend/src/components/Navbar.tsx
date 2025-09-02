import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/app%20logo%20-%20light.png" 
              alt="StreamFlow" 
              width={120}
              height={40}
              className="dark:hidden" 
            />
            <Image 
              src="/app%20logo%20-%20dark.png" 
              alt="StreamFlow" 
              width={120}
              height={40}
              className="hidden dark:block" 
            />
            <span className="text-lg font-semibold">StreamFlow</span>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" className="px-3 py-2 text-sm hover:underline">Home</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/login" className="px-3 py-2 text-sm hover:underline">Login</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/signup" className="px-3 py-2 text-sm hover:underline">Sign Up</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Link href="/login"><Button variant="secondary" size="sm">Login</Button></Link>
          <Link href="/signup"><Button size="sm">Get Started</Button></Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 