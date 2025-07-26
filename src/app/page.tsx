import { Dashboard } from '@/components/drishti/dashboard';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Shield, Map, Users, BotMessageSquare } from 'lucide-react';

export default function Home() {
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
            <SidebarFooter className="group-data-[collapsible=icon]:hidden">
                <div className="text-xs text-sidebar-foreground/50">
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
