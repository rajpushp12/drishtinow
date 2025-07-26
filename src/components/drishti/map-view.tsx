'use client';

import type { Alert, Responder } from '@/lib/types';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Siren, ShieldCheck, HeartPulse, User, Flame, Bot } from 'lucide-react';

const alertIcons: Record<Alert['type'], React.ReactNode> = {
  PREDICTIVE: <Bot className="h-5 w-5 text-white" />,
  MEDICAL: <HeartPulse className="h-5 w-5 text-white" />,
  FIRE: <Flame className="h-5 w-5 text-white" />,
  PANIC: <Siren className="h-5 w-5 text-white" />,
  LOST_PERSON: <User className="h-5 w-5 text-white" />,
  SAFETY_CONCERN: <Siren className="h-5 w-5 text-white" />,
  OTHER: <Siren className="h-5 w-5 text-white" />,
};

export function MapView({ alerts, responders }: { alerts: Alert[]; responders: Responder[] }) {
  // A simplified conversion from lat/lng to x/y percentages.
  // This is a very rough approximation for demonstration purposes.
  const mapBounds = {
    minLat: 34.048, maxLat: 34.056,
    minLng: -118.248, maxLng: -118.241,
  };

  const projectToMap = (lat: number, lng: number) => {
    const y = 100 - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat) * 100);
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng) * 100);
    return { x: `${x}%`, y: `${y}%` };
  };
  
  return (
    <TooltipProvider>
      <div className="relative w-full h-full rounded-b-lg overflow-hidden">
        <Image src="https://placehold.co/1200x800.png" alt="Event Map" fill objectFit="cover" className="brightness-75" data-ai-hint="aerial event" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Heatmap simulation */}
        <div className="absolute top-[20%] left-[15%] w-[30%] h-[40%] bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[50%] bg-red-500/25 rounded-full blur-3xl animate-pulse delay-500"></div>


        {responders.map(responder => {
          const { x, y } = projectToMap(responder.location.lat, responder.location.lng);
          return (
            <Tooltip key={responder.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
                  <div className="p-1.5 bg-primary rounded-full shadow-lg border-2 border-white/80 transition-transform hover:scale-110">
                    <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{responder.name}</p>
                <p>Status: {responder.status}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {alerts.map(alert => {
            if (alert.status === 'RESOLVED') return null;
            const { x, y } = projectToMap(alert.location.lat, alert.location.lng);
            const severityClass = {
                CRITICAL: 'bg-destructive ring-destructive/30',
                WARNING: 'bg-accent ring-accent/30',
                INFO: 'bg-blue-500 ring-blue-500/30',
            }[alert.severity];

            return (
                <Tooltip key={alert.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" style={{ left: x, top: y }}>
                           <div className={cn("absolute inset-0 rounded-full shadow-xl ring-4 animate-ping opacity-75", severityClass)}></div>
                           <div className={cn("relative p-2 rounded-full shadow-lg border-2 border-white/80", severityClass)}>
                                {alertIcons[alert.type]}
                           </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">{alert.title}</p>
                        <p>{alert.summary}</p>
                    </TooltipContent>
                </Tooltip>
            );
        })}
      </div>
    </TooltipProvider>
  );
}
