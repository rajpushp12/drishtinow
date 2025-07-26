// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/drishti/dashboard';
import { BottomNav } from '@/components/drishti/bottom-nav';
import { Bell, Shield, User, LogOut, Heart, Phone, Home as HomeIcon, Droplets, Pill, CircleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RespondersPanel } from '@/components/drishti/responders-panel';
import { mockResponders, mockUsers } from '@/lib/mock-data';
import type { User as UserType } from '@/lib/types';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        const foundUser = mockUsers.find(u => u.name === userName);
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
                        <AvatarImage src={`https://placehold.co/64x64.png?text=${user.name.charAt(0)}`} data-ai-hint="person portrait" />
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
                    <div className="flex items-start gap-3"><HomeIcon className="text-primary mt-1"/><div>Address: <strong>{user.address}</strong></div></div>
                </CardContent>
            </Card>

            <Button onClick={handleLogout} className="w-full">
                <LogOut className="mr-2" /> Logout
            </Button>
        </div>
    );
};


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'management') {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const navItems = [
    { id: 'alerts', label: 'Alert Management', icon: <Bell /> },
    { id: 'dispatch', label: 'Dispatch Responders', icon: <Shield /> },
    { id: 'profile', label: 'Profile', icon: <User /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-[550px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'alerts':
        return <Dashboard />;
      case 'dispatch':
        return <div className="p-4"><RespondersPanel responders={mockResponders} /></div>;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b">
          <div className="flex items-center gap-2">
            <Shield className="text-primary size-8" />
            <h1 className="text-xl font-semibold">Management Console</h1>
          </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>
      <BottomNav items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
