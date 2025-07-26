// src/app/responder/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAlerts, mockUsers, mockResponders as initialMockResponders } from '@/lib/mock-data';
import type { Alert, Responder, User as UserType } from '@/lib/types';
import { AlertCard } from '@/components/drishti/alert-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, CheckCircle, Radio, Coffee, MapPin, History, Bell, User, Heart, Phone, Home, Droplets, Pill, CircleAlert } from 'lucide-react';
import { BottomNav } from '@/components/drishti/bottom-nav';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        const foundUser = mockUsers.find(u => u.name === userName && u.role === 'responder');
        setUser(foundUser || null);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        router.push('/login');
    };

    if (!user) {
        return <Skeleton className="h-[400px] w-full m-4" />;
    }

    return (
        <div className="p-4 space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://placehold.co/64x64.png?text=${user.name.charAt(0)}`} data-ai-hint="person portrait"/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription className="capitalize">{user.role} | {user.age} years old</CardDescription>
                    </div>
                </CardHeader>
            </Card>
            
            <Card>
                <CardHeader><CardTitle className="text-lg">Medical Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3"><Droplets className="text-primary"/><span>Blood Group: <strong>{user.medicalInfo.bloodGroup}</strong></span></div>
                    <div className="flex items-start gap-3"><CircleAlert className="text-primary mt-1"/><div>Allergies: <strong>{user.medicalInfo.allergies.join(', ') || 'None'}</strong></div></div>
                    <div className="flex items-start gap-3"><Heart className="text-primary mt-1" /><div>Conditions: <strong>{user.medicalInfo.conditions.join(', ') || 'None'}</strong></div></div>
                    <div className="flex items-start gap-3"><Pill className="text-primary mt-1" /><div>Medications: <strong>{user.medicalInfo.medications.join(', ') || 'None'}</strong></div></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle  className="text-lg">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-3"><Phone className="text-primary mt-1"/><div>Emergency Contact: <strong>{user.emergencyContact.name} ({user.emergencyContact.phone})</strong></div></div>
                    <div className="flex items-start gap-3"><Home className="text-primary mt-1"/><div>Address: <strong>{user.address}</strong></div></div>
                </CardContent>
            </Card>

            <Button onClick={handleLogout} className="w-full">
                <LogOut className="mr-2" /> Logout
            </Button>
        </div>
    );
};

const AlertsPage = ({ assignedAlert }: { assignedAlert: Alert | null }) => (
    <div className="p-4">
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>
                    {assignedAlert ? 'Your Assigned Task' : 'No Assigned Task'}
                </CardTitle>
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
                        <p className="mt-2 text-lg">No tasks are currently assigned to you.</p>
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
)

const AlertHistoryPage = () => {
    const resolvedAlerts = mockAlerts.filter(a => a.status === 'RESOLVED');
    return (
        <div className="p-4 space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Resolved Alerts</CardTitle>
                    <CardDescription>History of all resolved alerts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-280px)]">
                        <div className="space-y-4 pr-4">
                            {resolvedAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
};


export default function ResponderDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [responder, setResponder] = useState<Responder | null>(null);
  const [assignedAlert, setAssignedAlert] = useState<Alert | null>(null);
  const [activeTab, setActiveTab] = useState('alerts');
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (role !== 'responder') {
      router.replace('/login');
    } else {
      const currentResponder = initialMockResponders.find(r => r.name === name) || null;
      setResponder(currentResponder);

      if (currentResponder && currentResponder.assignedAlertId) {
        const alert = mockAlerts.find(a => a.id === currentResponder.assignedAlertId) || null;
        setAssignedAlert(alert);
      }
      setLoading(false);
    }
  }, [router]);

  const navItems = [
    { id: 'alerts', label: 'Alerts', icon: <Bell /> },
    { id: 'history', label: 'Alert History', icon: <History /> },
    { id: 'profile', label: 'Profile', icon: <User /> },
  ];
  
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
            </header>
            <main className="flex-1 mt-6">
                <Skeleton className="h-80 w-full" />
            </main>
            <Skeleton className="h-16 w-full" />
        </div>
    );
  }
  
  if (!responder) {
    return <p>Responder not found.</p>
  }

  const renderContent = () => {
    switch (activeTab) {
        case 'alerts':
            return <AlertsPage assignedAlert={assignedAlert} />;
        case 'history':
            return <AlertHistoryPage />;
        case 'profile':
            return <ProfilePage />;
        default:
            return <AlertsPage assignedAlert={assignedAlert} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
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
      </header>
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>
      <BottomNav items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}