
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
          <SidebarInset>
            <Header />
            <main className="flex-1 container py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </SidebarInset>
          <Toaster />
        </div>
      </SidebarProvider>
    </HabitProvider>
  );
};

export default AppLayout;
