'use client';

import { useState, useEffect } from 'react';
import { mockAlerts, mockResponders } from '@/lib/mock-data';
import type { Alert, Responder } from '@/lib/types';
import { MapView } from '@/components/drishti/map-view';
import { AlertsPanel } from '@/components/drishti/alerts-panel';
import { RespondersPanel } from '@/components/drishti/responders-panel';
import { SentimentSummary } from '@/components/drishti/sentiment-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [responders, setResponders] = useState<Responder[]>(mockResponders);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addAlert = (newAlert: Alert) => {
    setAlerts(prevAlerts => [newAlert, ...prevAlerts].sort((a, b) => {
        const severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'INFO': 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    }));
  };

  if (!isClient) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-[600px] w-full" />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Skeleton className="h-[180px] w-full" />
                <Skeleton className="h-[550px] w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <Card className="h-[400px] lg:h-[650px] shadow-lg">
          <CardHeader>
            <CardTitle>Live Event Map</CardTitle>
          </CardHeader>
          <CardContent className="h-full p-0">
            <MapView alerts={alerts} responders={responders} />
          </CardContent>
        </Card>
      </div>
      
      <div className="xl:col-span-1 space-y-6">
        <SentimentSummary />
        
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
            <TabsTrigger value="responders"><Users className="mr-2 h-4 w-4" />Responders</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts">
              <AlertsPanel alerts={alerts} onNewAlert={addAlert} />
          </TabsContent>
          <TabsContent value="responders">
              <RespondersPanel responders={responders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
