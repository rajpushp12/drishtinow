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
import { Shield, LogIn, Loader2, Phone, KeyRound } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const MOCK_OTP = "123456";

const mobileFormSchema = z.object({
  mobileNumber: z.string().length(10, { message: 'Mobile number must be 10 digits.' }),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [currentUser, setCurrentUser] = useState<(typeof mockUsers[0]) | null>(null);

  const mobileForm = useForm<z.infer<typeof mobileFormSchema>>({
    resolver: zodResolver(mobileFormSchema),
    defaultValues: {
      mobileNumber: "",
    },
  });
  
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOtp = (values: z.infer<typeof mobileFormSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const user = mockUsers.find(u => u.mobileNumber === values.mobileNumber.trim());

      if (user) {
        setCurrentUser(user);
        toast({
          title: "OTP Sent",
          description: `Your OTP is: ${MOCK_OTP}`,
        });
        setStep('otp');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "No user found with that mobile number.",
        });
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleVerifyOtp = (values: z.infer<typeof otpFormSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (values.otp === MOCK_OTP && currentUser) {
        localStorage.setItem('userRole', currentUser.role);
        localStorage.setItem('userName', currentUser.name);
        
        switch (currentUser.role) {
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
          description: "Invalid OTP. Please try again.",
        });
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">DrishtiNow</CardTitle>
          <CardDescription>Proactive Safety Intelligence. Please log in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'mobile' ? (
            <Form {...mobileForm}>
              <form onSubmit={mobileForm.handleSubmit(handleSendOtp)} className="space-y-6">
                <FormField
                  control={mobileForm.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="9876543210" {...field} disabled={isSubmitting} className="pl-10" type="tel"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : "Send OTP"}
                </Button>
              </form>
            </Form>
          ) : (
             <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                 <p className="text-sm text-center text-muted-foreground">An OTP has been sent to your mobile.</p>
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Enter 6-digit OTP" {...field} disabled={isSubmitting} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Verify & Log In
                    </>
                  )}
                </Button>
                 <Button variant="link" size="sm" onClick={() => setStep('mobile')} className="w-full">
                    Back to Mobile Number
                </Button>
              </form>
            </Form>
          )}

           <div className="mt-6 text-center text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <p className="font-bold mb-2">Available demo numbers:</p>
                <p><span className="font-semibold">Management:</span> 9876543210</p>
                <p><span className="font-semibold">Responder:</span> 8765432109</p>
                <p><span className="font-semibold">Consumer:</span> 7654321098</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
