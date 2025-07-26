// src/app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: 'management' | 'responder' | 'consumer') => {
    // In a real app, you would handle authentication here.
    // For this demo, we'll use localStorage to simulate a logged-in user role.
    localStorage.setItem('userRole', role);
    switch (role) {
      case 'management':
        router.push('/');
        break;
      case 'responder':
        router.push('/responder');
        break;
      case 'consumer':
        router.push('/consumer');
        break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">DrishtiNow</CardTitle>
          <CardDescription>Proactive Safety Intelligence. Please select your role to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => handleLogin('management')}>
            <Shield className="mr-2" /> Log in as Management
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => handleLogin('responder')}>
            <HeartPulse className="mr-2" /> Log in as Responder
          </Button>
          <Button className="w-full" variant="outline" onClick={() => handleLogin('consumer')}>
            <User className="mr-2" /> Log in as Consumer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
