import type { Alert } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Siren, HeartPulse, User, Flame, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const alertIcons: Record<Alert['type'], React.ReactNode> = {
  PREDICTIVE: <Bot className="h-4 w-4" />,
  MEDICAL: <HeartPulse className="h-4 w-4" />,
  FIRE: <Flame className="h-4 w-4" />,
  PANIC: <Siren className="h-4 w-4" />,
  LOST_PERSON: <User className="h-4 w-4" />,
  SAFETY_CONCERN: <Siren className="h-4 w-4" />,
  OTHER: <Siren className="h-4 w-4" />,
};

const severityClasses = {
  CRITICAL: 'border-l-4 border-destructive bg-destructive/10',
  WARNING: 'border-l-4 border-accent bg-accent/10',
  INFO: 'border-l-4 border-blue-500 bg-blue-500/10',
};

const severityText = {
  CRITICAL: 'text-destructive',
  WARNING: 'text-accent',
  INFO: 'text-blue-500',
};

export function AlertCard({ alert, children }: { alert: Alert, children?: React.ReactNode }) {
  return (
    <Card className={cn("w-full transition-all hover:shadow-md", severityClasses[alert.severity])}>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
            <div className="flex-grow">
                <CardTitle className="text-base flex items-center gap-2">
                   {alertIcons[alert.type]}
                    {alert.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs pt-1">
                    <Clock className="h-3 w-3" /> {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                </CardDescription>
            </div>
            <Badge variant={alert.status === 'RESOLVED' ? 'secondary' : 'default'} className={cn('capitalize text-xs',
                {'bg-destructive/80 text-destructive-foreground hover:bg-destructive': alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED'},
                {'bg-accent/80 text-accent-foreground hover:bg-accent': alert.severity === 'WARNING' && alert.status !== 'RESOLVED'},
                {'bg-blue-500/80 text-white hover:bg-blue-600': alert.severity === 'INFO' && alert.status !== 'RESOLVED'},
            )}>{alert.status.toLowerCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-2 pt-0">
        <p className="text-sm text-muted-foreground">{alert.summary}</p>
      </CardContent>
       {(children || alert.source) && (
        <CardFooter className="px-3 pb-3 text-xs text-muted-foreground justify-between pt-0">
            {alert.source && <span>Source: {alert.source}</span>}
             {children && <div className='ml-auto'>{children}</div>}
        </CardFooter>
      )}
    </Card>
  );
}
