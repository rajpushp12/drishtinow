'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSentimentSummaryAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BotMessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Alert } from '@/lib/types';

export function SentimentSummary({ alerts }: { alerts: Alert[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSummary = () => {
    startTransition(async () => {
      setError(null);
      try {
        const result = await getSentimentSummaryAction(alerts);
        if (result.error) {
          setError(result.error);
           toast({ variant: "destructive", title: "Error", description: result.error });
        } else {
          setSummary(result.summary);
          setLastUpdated(result.lastUpdated);
        }
      } catch (e) {
        const errorMessage = "An unexpected error occurred."
        setError(errorMessage);
        toast({ variant: "destructive", title: "Error", description: errorMessage });
      }
    });
  };
  
  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  return (
    <Card className="shadow-md">
      <CardHeader className='py-4'>
        <div className="flex justify-between items-center">
            <div className='flex items-center gap-3'>
                <BotMessageSquare className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">AI Sentiment Summary</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchSummary} disabled={isPending}>
                <RefreshCw className={isPending ? 'animate-spin' : ''} />
            </Button>
        </div>
        {lastUpdated && !isPending && (
             <CardDescription className='pt-1'>Last updated: {format(lastUpdated, "p")}</CardDescription>
        )}
      </CardHeader>
      <CardContent className='pt-0'>
        {isPending && !summary ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
        ) : (
            <p className="text-sm text-foreground">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
