// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Shield, User, HeartPulse, LogIn, Loader2 } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleLogin = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const user = mockUsers.find(u => u.name.toLowerCase() === values.name.toLowerCase());

    if (user) {
      localStorage.setItem('userRole', user.role);
      switch (user.role) {
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
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "No user found with that name. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">DrishtiNow</CardTitle>
          <CardDescription>Proactive Safety Intelligence. Please log in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alex Ray" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <LogIn className="mr-2" />
                )}
                Log In
              </Button>
            </form>
          </Form>
           <div className="mt-6 text-center text-xs text-muted-foreground">
                <p className="font-bold">Available users for demo:</p>
                <p><span className="font-semibold">Management:</span> Chris Green</p>
                <p><span className="font-semibold">Responder:</span> Bob Williams</p>
                <p><span className="font-semibold">Consumer:</span> Alex Ray</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
