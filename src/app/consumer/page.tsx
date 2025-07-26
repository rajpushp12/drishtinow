// src/app/consumer/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAlerts } from '@/lib/mock-data';
import type { Alert } from '@/lib/types';
import { AlertCard } from '@/components/drishti/alert-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Bell, LogOut, CheckCircle } from 'lucide-react';

export default function ConsumerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'consumer') {
      router.replace('/login');
    } else {
      // Fetch and filter alerts for consumer view (non-resolved, critical/warning)
      const consumerAlerts = mockAlerts.filter(
        (alert) => alert.status !== 'RESOLVED' && (alert.severity === 'CRITICAL' || alert.severity === 'WARNING')
      );
      setAlerts(consumerAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-background p-4">
            <header className="flex justify-between items-center pb-4 border-b">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-24" />
            </header>
            <main className="flex-1 mt-6">
                <Skeleton className="h-96 w-full" />
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">DrishtiNow Safety</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2" /> Logout
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <CardTitle>Current Safety Alerts</CardTitle>
            </div>
            <CardDescription>
              Here are the active alerts for your awareness. Please stay safe and follow any instructions from event staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-4 pr-4">
                {alerts.length > 0 ? (
                  alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-16 rounded-lg bg-muted">
                    <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                    <h3 className="text-2xl font-semibold">All Clear!</h3>
                    <p className="mt-2 text-lg">There are no critical or warning alerts at the moment. Enjoy the event!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
