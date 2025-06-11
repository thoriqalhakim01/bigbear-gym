import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Member } from '@/types';
import { useEffect, useState } from 'react';

type Props = {
    member: Member;
    open: boolean;
    onClose: () => void;
};

export default function CheckInDialog({ member, open, onClose }: Props) {
    const [countdown, setCountdown] = useState(10);
    const totalPoints = member.points?.balance || 0;
    const pointsDeducted = 1;
    const remainingPoints = totalPoints;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let countdownTimer: NodeJS.Timeout;

        if (open) {
            setCountdown(30);

            countdownTimer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            timer = setTimeout(() => {
                onClose();
            }, 30000);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [open, onClose]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button>Check In</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Check In Successful</DialogTitle>
                    <DialogDescription>Welcome to the gym, {member.full_name}!</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {member.full_name}
                                <Badge variant="secondary">RFID: {member.rfid_uid}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-green-800">Check-in Completed</span>
                                </div>
                                <span className="text-xs text-green-600">
                                    {new Date().toLocaleString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                                <span className="text-sm font-medium text-blue-800">Points Deducted</span>
                                <Badge variant="outline" className="border-blue-300 text-blue-600">
                                    -{pointsDeducted} point
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Remaining Points</p>
                            <p className="text-2xl font-bold text-primary">{remainingPoints}</p>
                        </div>
                        <div className="flex items-start">
                            <Badge variant={remainingPoints > 10 ? 'default' : remainingPoints > 5 ? 'secondary' : 'destructive'}>
                                {remainingPoints > 10 ? 'Good' : remainingPoints > 5 ? 'Low' : 'Critical'}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
