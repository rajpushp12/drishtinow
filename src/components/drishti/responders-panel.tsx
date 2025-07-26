import type { Responder } from '@/lib/types';
import { ResponderCard } from '@/components/drishti/responder-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function RespondersPanel({ responders }: { responders: Responder[] }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Responder Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-3">
          <div className="space-y-2">
            {responders.length > 0 ? (
                responders.map(responder => (
                    <ResponderCard key={responder.id} responder={responder} />
                ))
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-16">
                    <Users className="w-12 h-12 mb-4" />
                    <h3 className="text-lg font-semibold">No Responders</h3>
                    <p>No responders are currently active.</p>
                </div>
             )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
