'use client';

import type { Alert } from '@/lib/types';
import { AlertCard } from '@/components/drishti/alert-card';
import { ReportForm } from '@/components/drishti/report-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, PlusCircle } from 'lucide-react';
import type { ComponentType } from 'react';

type AlertsPanelProps = {
  alerts: Alert[];
  onNewAlert: (alert: Alert) => void;
  TakeActionButton?: ComponentType<{ alertId: string }>;
};

export function AlertsPanel({ alerts, onNewAlert, TakeActionButton }: AlertsPanelProps) {
  const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className='text-xl'>Active Alerts</CardTitle>
        <ReportForm onNewAlert={onNewAlert}>
            <Button size="sm" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Report
            </Button>
        </ReportForm>
      </CardHeader>
      <CardContent className='pt-0'>
        <ScrollArea className="h-[calc(100vh-28rem)] pr-3">
          <div className="space-y-3">
            {sortedAlerts.length > 0 ? (
              sortedAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert}>
                    {TakeActionButton && alert.status === 'NEW' && <TakeActionButton alertId={alert.id} />}
                  </AlertCard>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-16">
                <Bell className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold">All Clear</h3>
                <p>No active alerts at the moment.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
