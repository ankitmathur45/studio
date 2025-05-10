
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Home, Settings } from 'lucide-react'; // Removed LayoutDashboard
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import ManageHabitsDialog from '@/components/habits/ManageHabitsDialog';
import { 
  Sidebar as ShadSidebar, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader, 
  SidebarFooter,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";


const navItems = [
  { href: '/', label: 'Overview', icon: Home },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isManageHabitsOpen, setIsManageHabitsOpen] = useState(false);
  const { setOpenMobile } = useSidebar();


  const handleLinkClick = () => {
    // Close mobile sidebar on link click
    if (typeof window !== 'undefined' && window.innerWidth < 768) { // md breakpoint
      setOpenMobile(false);
    }
  };

  return (
    <>
      <ShadSidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
           <Link href="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            <span className="font-bold text-2xl text-primary group-data-[collapsible=icon]:hidden">{APP_NAME}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    onClick={handleLinkClick}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className="justify-start"
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarMenuButton 
              onClick={() => setIsManageHabitsOpen(true)}
              tooltip={{ children: "Manage Habits", side: 'right', align: 'center' }}
              className="justify-start"
            >
            <Settings className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Manage Habits</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </ShadSidebar>
      <ManageHabitsDialog isOpen={isManageHabitsOpen} onOpenChange={setIsManageHabitsOpen} />
    </>
  );
};

export default Sidebar;
