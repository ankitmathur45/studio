"use client";
import React from 'react';
import Header from './Header';
// import Sidebar from './Sidebar'; // Removed
import { Toaster } from "@/components/ui/toaster";
import { HabitProvider } from '@/contexts/HabitContext';
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"; // Removed

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HabitProvider>
      {/* <SidebarProvider defaultOpen={true}> // Removed */}
        <div className="flex min-h-screen flex-col bg-background">
          {/* <Sidebar /> // Removed */}
          {/* <SidebarInset> // Removed */}
          <Header />
          <main className="flex-1"> {/* Replaced SidebarInset with main and flex-1 */}
            <div className="py-6"> {/* Content padding */}
              <div className="container mx-auto h-full"> {/* Max-width container */}
                {children}
              </div>
            </div>
          </main>
          {/* </SidebarInset> // Removed */}
          <Toaster />
        </div>
      {/* </SidebarProvider> // Removed */}
    </HabitProvider>
  );
};

export default AppLayout;
