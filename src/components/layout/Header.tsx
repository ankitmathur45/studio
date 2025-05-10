
"use client";
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const Header = () => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
        <Link href="/" className="flex items-center space-x-2">
          {/* Replace with an actual logo if available */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span className="font-bold text-xl text-primary">{APP_NAME}</span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* Future elements like UserAvatar / Settings can go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
