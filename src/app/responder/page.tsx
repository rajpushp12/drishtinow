// src/app/responder/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAlerts, mockResponders } from '@/lib/mock-data';
import type { Alert, Responder } from '@/lib/types';
import { AlertCard } from '@/components/drishti/alert-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, CheckCircle, Radio, Coffee, MapPin, NotebookPen } from 'lucide-react';
import { MapView } from '@/components/drishti/map-view';

// In a real app, you'd get the logged-in responder's ID from the session.
const LOGGED_IN_RESPONDER_ID = 'resp-2'; 

export default function ResponderDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [responder, setResponder] = useState<Responder | null>(null);
  const [assignedAlert, setAssignedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'responder') {
      router.replace('/login');
    } else {
      const currentResponder = mockResponders.find(r => r.id === LOGGED_IN_RESPONDER_ID) || null;
      setResponder(currentResponder);

      if (currentResponder && currentResponder.assignedAlertId) {
        const alert = mockAlerts.find(a => a.id === currentResponder.assignedAlertId) || null;
        setAssignedAlert(alert);
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };
  
  const getStatusInfo = (status: Responder['status']) => {
    const info = {
        Available: { icon: <CheckCircle className="h-4 w-4 text-green-400" />, text: 'Available', color: 'text-green-400' },
        Dispatched: { icon: <Radio className="h-4 w-4 text-orange-400" />, text: 'Dispatched', color: 'text-orange-400' },
        'On-break': { icon: <Coffee className="h-4 w-4 text-gray-400" />, text: 'On Break', color: 'text-gray-400' },
    }[status];
    return <div className={`flex items-center gap-2 font-semibold ${info.color}`}>{info.icon} {info.text}</div>;
  };

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-background p-4">
            <header className="flex justify-between items-center pb-4 border-b">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-10 w-24" />
            </header>
            <main className="flex-1 mt-6">
                <Skeleton className="h-80 w-full" />
            </main>
        </div>
    );
  }
  
  if (!responder) {
    return <p>Responder not found.</p>
  }

  const alertsForMap = assignedAlert ? [assignedAlert] : [];
  const respondersForMap = [responder];

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={`https://placehold.co/48x48.png?text=${responder.name.charAt(0)}`} data-ai-hint="person portrait" />
                <AvatarFallback>{responder.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-xl font-bold">{responder.name}</h1>
                {getStatusInfo(responder.status)}
            </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2" /> Logout
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
            <Card className="w-full h-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <NotebookPen className="h-6 w-6"/>
                        <CardTitle>
                            {assignedAlert ? 'Your Assigned Task' : 'No Assigned Task'}
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {assignedAlert ? 'Please proceed to the location and address the situation.' : 'You are currently on standby. Awaiting dispatch.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {assignedAlert ? (
                        <AlertCard alert={assignedAlert} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-16 rounded-lg bg-muted">
                            <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                            <h3 className="text-2xl font-semibold">All Clear</h3>
                            <p className="mt-2 text-lg">No tasks are currently assigned to you. Stand by for alerts.</p>
                      </div>
                    )}
                </CardContent>
                {assignedAlert && (
                    <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button className="w-full sm:w-auto">
                            <MapPin className="mr-2"/> Navigate
                        </Button>
                        <Button variant="secondary" className="w-full sm:w-auto">
                            Acknowledge
                        </Button>
                         <Button variant="destructive" className="w-full sm:w-auto">
                            Mark as Resolved
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
         <div className="lg:col-span-1 h-[400px] lg:h-auto">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Task Location</CardTitle>
                    <CardDescription>Map view of your assigned task and current location.</CardDescription>
                </CardHeader>
                 <CardContent className="h-[calc(100%-80px)] p-0">
                    <MapView alerts={alertsForMap} responders={respondersForMap} />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
