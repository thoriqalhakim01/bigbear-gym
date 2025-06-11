import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ErrorDialogProps {
    error: string;
    open: boolean;
    onClose: () => void;
}

export default function ErrorDialog({ error, open, onClose }: ErrorDialogProps) {
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let countdownTimer: NodeJS.Timeout;

        if (open) {
            setCountdown(15);

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
            }, 15000);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [open, onClose]);

    const isPointsError =
        error.toLowerCase().includes('no available points') || error.toLowerCase().includes('points') || error.toLowerCase().includes('balance');

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-red-600">
                        <AlertCircle className="h-6 w-6" />
                        {isPointsError ? 'Insufficient Points' : 'Access Denied'}
                    </DialogTitle>
                    <DialogDescription className="text-red-600/80">
                        {isPointsError ? "Your account doesn't have enough points for gym access" : 'Unable to process your check-in request'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                            <div>
                                <h4 className="mb-1 font-medium text-red-800">{isPointsError ? 'Points Balance Too Low' : 'Check-in Failed'}</h4>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                            <UserPlus className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                            <div>
                                <h4 className="mb-2 font-medium text-blue-800">What to do next?</h4>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    {isPointsError ? (
                                        <>
                                            <li>• Contact gym staff to top up your points</li>
                                            <li>• Check your membership status and renewal</li>
                                            <li>• Verify your payment and subscription plan</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>• Please contact the gym staff for registration</li>
                                            <li>• Make sure your RFID card is properly activated</li>
                                            <li>• Check if you're using the correct RFID card</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Try Again
                            </Button>
                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => {
                                    window.location.href = '/contact';
                                }}
                            >
                                Contact Staff
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
