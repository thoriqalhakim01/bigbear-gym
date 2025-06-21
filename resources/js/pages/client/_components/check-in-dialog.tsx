import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Member, Trainer } from '@/types';
import { useEffect, useState } from 'react';

type Props = {
    user: Member | Trainer | undefined;
    userType: 'member' | 'trainer' | undefined;
    open: boolean;
    onClose: () => void;
};

export default function CheckInDialog({ user, userType, open, onClose }: Props) {
    const [countdown, setCountdown] = useState(2);

    useEffect(() => {
        if (!open) return;

        setCountdown(2);
        const timer = setTimeout(onClose, 2000);
        const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [open, onClose]);

    const renderMemberContent = (member: Member) => (
        <>
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-800">Check-in Completed</span>
                </div>
                <span className="text-xs text-green-600">{new Date().toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                <span className="text-sm font-medium text-blue-800">Points Deducted</span>
                <Badge variant="outline" className="border-blue-300 text-blue-600">
                    -1 point
                </Badge>
            </div>

            <div className="flex justify-between rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Remaining Points</p>
                    <p className="text-2xl font-bold text-primary">{member.points?.balance || 0}</p>
                </div>
                <Badge variant={(member.points?.balance || 0) > 10 ? 'default' : (member.points?.balance || 0) > 5 ? 'secondary' : 'destructive'}>
                    {(member.points?.balance || 0) > 10 ? 'Good' : (member.points?.balance || 0) > 5 ? 'Low' : 'Critical'}
                </Badge>
            </div>
        </>
    );

    const renderTrainerContent = (trainer: Trainer) => (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-800">Trainer Check-in Completed</span>
            </div>
            <span className="text-xs text-green-600">{new Date().toLocaleString()}</span>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Check In Successful</DialogTitle>
                    <DialogDescription>
                        Welcome {userType === 'member' ? 'to the gym' : 'back'}, {user?.full_name}!
                    </DialogDescription>
                </DialogHeader>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {user?.full_name}
                            <Badge variant="secondary">RFID: {user?.rfid_uid}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {userType === 'member' ? renderMemberContent(user as Member) : renderTrainerContent(user as Trainer)}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
