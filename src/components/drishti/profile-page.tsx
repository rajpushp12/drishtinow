// src/components/drishti/profile-page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import type { User as UserType } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Heart, Phone, Home, Droplets, Pill, CircleAlert, User, Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfileField = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: string | null | undefined, colorClass?: string }) => (
    <div className="flex items-start gap-4">
        <div className={cn("mt-1", colorClass)}>{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value || 'N/A'}</p>
        </div>
    </div>
);

export function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        if (userName) {
            const foundUser = mockUsers.find(u => u.name === userName);
            setUser(foundUser || null);
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 font-body">
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://placehold.co/64x64.png?text=${user.name.charAt(0)}`} data-ai-hint="person portrait" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
                        <CardDescription className="capitalize">
                            <span className='font-semibold text-google-blue'>{user.role}</span>
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline text-google-green">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProfileField icon={<Calendar className="size-5" />} label="Age" value={`${user.age} years old`} />
                    <ProfileField icon={<Droplets className="size-5" />} label="Blood Group" value={user.medicalInfo.bloodGroup} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline text-google-red">Medical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProfileField icon={<CircleAlert className="size-5" />} label="Allergies" value={user.medicalInfo.allergies.join(', ') || 'None'} />
                    <ProfileField icon={<Heart className="size-5" />} label="Conditions" value={user.medicalInfo.conditions.join(', ') || 'None'} />
                    <ProfileField icon={<Pill className="size-5" />} label="Medications" value={user.medicalInfo.medications.join(', ') || 'None'} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline text-google-yellow">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProfileField icon={<Phone className="size-5" />} label="Emergency Contact" value={`${user.emergencyContact.name} (${user.emergencyContact.phone})`} />
                    <ProfileField icon={<Home className="size-5" />} label="Address" value={user.address} />
                </CardContent>
            </Card>

             <Button onClick={handleLogout} className="w-full bg-google-red hover:bg-google-red/90">
                <LogOut className="mr-2" /> Logout
            </Button>
        </div>
    );
}
