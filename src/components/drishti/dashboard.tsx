// src/components/drishti/dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { mockAlerts, mockResponders, mockHeatmapData } from '@/lib/mock-data';
import type { Alert, Responder, GeoPoint, HeatmapPoint } from '@/lib/types';
import { MapView } from '@/components/drishti/map-view';
import { AlertsPanel } from '@/components/drishti/alerts-panel';
import { SentimentSummary } from '@/components/drishti/sentiment-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [responders, setResponders] = useState<Responder[]>(mockResponders);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>(mockHeatmapData);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
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
  }, []);

  const addAlert = (newAlert: Alert) => {
    setAlerts(prevAlerts => [newAlert, ...prevAlerts].sort((a, b) => {
        const severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'INFO': 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    }));
  };
  
  const handleAssignResponder = (alertId: string, responderId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: 'DISPATCHED', assignedResponder: responderId } : alert
      )
    );
    setResponders(prevResponders =>
      prevResponders.map(responder =>
        responder.id === responderId ? { ...responder, status: 'Dispatched', assignedAlertId: alertId } : responder
      )
    );
    toast({
        title: "Responder Assigned",
        description: `Alert ${alertId} has been assigned.`,
    })
  };

  const TakeActionButton = ({ alertId }: { alertId: string }) => {
    const availableResponders = responders.filter(r => r.status === 'Available');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="w-full">Take Action</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {availableResponders.length > 0 ? (
                availableResponders.map(responder => (
                    <DropdownMenuItem key={responder.id} onClick={() => handleAssignResponder(alertId, responder.id)}>
                        Assign to {responder.name}
                    </DropdownMenuItem>
                ))
            ) : (
                <DropdownMenuItem disabled>No available responders</DropdownMenuItem>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };


  if (!isClient) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-[550px] w-full" />
            </div>
            <div className="lg:col-span-1 space-y-4">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[500px] w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="h-[300px] lg:h-[calc(100vh-32rem)]">
        <Card className="h-full shadow-md">
          <CardHeader className='py-4'>
            <CardTitle>Live Event Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-60px)] p-0">
            <MapView alerts={alerts} responders={responders} heatmapData={heatmapData} userLocation={userLocation} />
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <SentimentSummary alerts={alerts} />
        <AlertsPanel alerts={alerts} onNewAlert={addAlert} TakeActionButton={TakeActionButton} />
      </div>
    </div>
  );
}
