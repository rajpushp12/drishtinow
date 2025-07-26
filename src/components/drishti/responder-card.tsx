import type { Responder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, Coffee, Radio } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ResponderCard({ responder }: { responder: Responder }) {
  const statusInfo = {
    Available: { icon: <ShieldCheck className="h-4 w-4 text-green-400" />, text: 'Available', color: 'bg-green-500' },
    Dispatched: { icon: <Radio className="h-4 w-4 text-orange-400" />, text: 'Dispatched', color: 'bg-orange-500' },
    'On-break': { icon: <Coffee className="h-4 w-4 text-gray-400" />, text: 'On Break', color: 'bg-gray-500' },
  }[responder.status];

  return (
    <Card className="p-3 transition-all hover:bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${responder.name.charAt(0)}`} data-ai-hint="person portrait" />
                <AvatarFallback>{responder.name.charAt(0)}</AvatarFallback>
                <span className={cn("absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-card", statusInfo.color)} />
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{responder.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {statusInfo.icon}
                {statusInfo.text}
              </p>
            </div>
          </div>
          {responder.assignedAlertId && (
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
              {responder.assignedAlertId}
            </span>
          )}
        </div>
    </Card>
  );
}
