// src/components/drishti/bottom-nav.tsx
'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type BottomNavProps = {
  items: NavItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
};

export function BottomNav({ items, activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-20">
      <div className="grid h-full w-full grid-cols-3 mx-auto">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'flex flex-col h-full items-center justify-center gap-1 rounded-none',
              activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
