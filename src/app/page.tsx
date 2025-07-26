// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/drishti/dashboard';
import { BottomNav } from '@/components/drishti/bottom-nav';
import { Bell, Shield, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RespondersPanel } from '@/components/drishti/responders-panel';
import { mockResponders } from '@/lib/mock-data';
import { ProfilePage } from '@/components/drishti/profile-page';

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
