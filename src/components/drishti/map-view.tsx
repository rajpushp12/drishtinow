'use client';

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Alert, Responder } from '@/lib/types';
import { useState } from 'react';
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

export function MapView({ alerts, responders, interactive = true }: { alerts: Alert[]; responders: Responder[], interactive?: boolean }) {
  const [selectedItem, setSelectedItem] = useState<Alert | Responder | null>(null);

  const center = { lat: 34.053, lng: -118.244 };
  const mapId = 'drishti_map_style';

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="relative w-full h-full rounded-b-lg overflow-hidden">
        <Map
          defaultCenter={center}
          defaultZoom={15}
          mapId={mapId}
          disableDefaultUI={!interactive}
          gestureHandling={interactive ? 'auto' : 'none'}
          className="w-full h-full"
        >
          {responders.map(responder => (
            <AdvancedMarker
              key={responder.id}
              position={responder.location}
              onClick={() => setSelectedItem(responder)}
            >
              <div className="p-1.5 bg-primary rounded-full shadow-lg border-2 border-white/80 transition-transform hover:scale-110 cursor-pointer">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
            </AdvancedMarker>
          ))}

          {alerts.map(alert => {
            if (alert.status === 'RESOLVED') return null;

            const severityClass = {
              CRITICAL: 'bg-destructive ring-destructive/30',
              WARNING: 'bg-accent ring-accent/30',
              INFO: 'bg-blue-500 ring-blue-500/30',
            }[alert.severity];

            return (
              <AdvancedMarker
                key={alert.id}
                position={alert.location}
                onClick={() => setSelectedItem(alert)}
              >
                <div className="relative cursor-pointer">
                  <div className={cn("absolute inset-0 rounded-full shadow-xl ring-4 animate-ping opacity-75", severityClass)}></div>
                  <div className={cn("relative p-2 rounded-full shadow-lg border-2 border-white/80", severityClass)}>
                    {alertIcons[alert.type]}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {selectedItem && (
            <InfoWindow
              position={selectedItem.location}
              onCloseClick={() => setSelectedItem(null)}
              pixelOffset={[0,-40]}
            >
              <div className="p-1 text-foreground">
                <h3 className="font-bold">{'title' in selectedItem ? selectedItem.title : selectedItem.name}</h3>
                {'summary' in selectedItem ? <p className="text-sm">{selectedItem.summary}</p> : <p className="text-sm">Status: {selectedItem.status}</p>}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
