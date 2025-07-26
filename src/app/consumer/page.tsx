// src/app/consumer/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockAlerts, mockResponders } from '@/lib/mock-data';
import type { Alert, Responder, GeoPoint } from '@/lib/types';
import { AlertCard } from '@/components/drishti/alert-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Map, FileQuestion, Plus, CheckCircle, Shield, User, LogOut } from 'lucide-react';
import { MapView } from '@/components/drishti/map-view';
import { BottomNav } from '@/components/drishti/bottom-nav';
import { ReportForm } from '@/components/drishti/report-form';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfilePage } from '@/components/drishti/profile-page';


const EventFaq = () => (
    <div className="p-4">
        <Card>
            <CardHeader>
                <CardTitle>Event FAQ</CardTitle>
                <CardDescription>Find answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What are the event hours?</AccordionTrigger>
                        <AccordionContent>
                        The event runs from 10:00 AM to 10:00 PM today.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Where are the restrooms?</AccordionTrigger>
                        <AccordionContent>
                        Restrooms are located in Zone A, near the main entrance, and in Zone C, behind the food court.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What is the policy on bags?</AccordionTrigger>
                        <AccordionContent>
                        Only clear bags are allowed inside the event premises for security reasons.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                        <AccordionTrigger>Is there a lost and found?</AccordionTrigger>
                        <AccordionContent>
                        Yes, the lost and found is located at the information booth near the main entrance in Zone A.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </div>
)

export default function ConsumerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [activeTab, setActiveTab] = useState('alerts');
  const [userName, setUserName] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName') || 'User';

    if (role !== 'consumer') {
      router.replace('/login');
    } else {
      setUserName(name);
      const consumerAlerts = mockAlerts.filter(
        (alert) => alert.status !== 'RESOLVED' && (alert.severity === 'CRITICAL' || alert.severity === 'WARNING')
      );
      setAlerts(consumerAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setResponders(mockResponders);
      setLoading(false);
      
       if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            // Silently fail if geolocation is denied.
          }
        );
      }
    }
    // Correctly initialize Audio only on the client side
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/alert-sound.mp3');
    }

  }, [router]);
  
  const handleNewAlert = (alert: Alert) => {
    setAlerts(prevAlerts => [alert, ...prevAlerts]);
    audioRef.current?.play().catch(error => console.error("Audio play failed:", error));
  }

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const navItems = [
    { id: 'alerts', label: 'Alerts', icon: <Bell /> },
    { id: 'map', label: 'Event Map', icon: <Map /> },
    { id: 'faq', label: 'Event FAQ', icon: <FileQuestion /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex justify-between items-center p-4 border-b">
          <Skeleton className="h-8 w-48" />
        </header>
        <main className="flex-1 mt-6">
          <Skeleton className="h-96 w-full" />
        </main>
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
        case 'alerts':
            return (
                <div className="p-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Safety Alerts</CardTitle>
                            <CardDescription>
                            Active alerts for your awareness. Please stay safe and follow instructions from staff.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(100vh-320px)]">
                            <div className="space-y-4 pr-4">
                                {alerts.length > 0 ? (
                                alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
                                ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-16 rounded-lg bg-muted">
                                    <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                                    <h3 className="text-2xl font-semibold">All Clear!</h3>
                                    <p className="mt-2 text-lg">There are no critical or warning alerts at the moment.</p>
                                </div>
                                )}
                            </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            )
        case 'map':
            return (
                <div className="h-full">
                    <MapView alerts={alerts} responders={responders} userLocation={userLocation} />
                </div>
            )
        case 'faq':
            return <EventFaq />;
        case 'profile':
            return <ProfilePage />;
        default:
             return <div>Alerts</div>
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">DrishtiNow Safety</h1>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${userName.charAt(0)}`} data-ai-hint="person portrait" />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

       <ReportForm onNewAlert={handleNewAlert}>
            <Button
                className="fixed bottom-20 right-4 z-20 rounded-full w-14 h-14 shadow-lg"
                size="icon"
            >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Report Issue</span>
            </Button>
      </ReportForm>

      <BottomNav items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
