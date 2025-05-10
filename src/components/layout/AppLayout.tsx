"use client";
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from "@/components/ui/toaster";
import { HabitProvider } from '@/contexts/HabitContext';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HabitProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col bg-background">
          <Sidebar />
          <SidebarInset> {/* SidebarInset is a <main> tag and handles sidebar margins */}
            <Header />
            {/* Content area that grows and scrolls if necessary */}
            <div className="flex-1 py-6"> {/* Vertical padding for content area, flex-1 to grow */}
              <div className="container mx-auto h-full"> {/* Max-width container, h-full for children to fill */}
                {children}
              </div>
            </div>
          </SidebarInset>
          <Toaster />
        </div>
      </SidebarProvider>
    </HabitProvider>
  );
};

export default AppLayout;
