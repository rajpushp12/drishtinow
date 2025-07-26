// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/drishti/dashboard';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Shield, Map, Users, BotMessageSquare, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'management') {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Skeleton className="hidden md:block md:w-64" />
        <div className="flex-1 flex flex-col">
            <header className="p-4 border-b">
                <Skeleton className="h-6 w-48" />
            </header>
            <main className="flex-1 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-[600px] w-full" />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <Skeleton className="h-[180px] w-full" />
                        <Skeleton className="h-[550px] w-full" />
                    </div>
                </div>
            </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <Shield className="text-sidebar-primary size-8" />
                    <h1 className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">DrishtiNow</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip={{content: "Dashboard"}}>
                            <Map />
                            <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={{content: "Alerts"}}>
                            <Bell />
                            <span>Alerts</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={{content: "Responders"}}>
                            <Users />
                            <span>Responders</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton tooltip={{content: "AI Summary"}}>
                            <BotMessageSquare />
                            <span>AI Summary</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip={{content: "Logout"}}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden pt-4">
                    <p>&copy; {new Date().getFullYear()} DrishtiNow</p>
                    <p>Proactive Safety Intelligence</p>
                </div>
            </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col h-screen">
          <header className="p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold">Event Command Center</h1>
              </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <Dashboard />
          </main>
        </div>
    </SidebarProvider>
  );
}
