import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getErrorColors, getErrorInfo } from '@/lib/errorUtils';
import { Home, Phone, RefreshCw, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ErrorDialogProps {
    error: string;
    open: boolean;
    onClose: () => void;
    onRetry?: () => void;
    onContactStaff?: () => void;
}

export default function ErrorDialog({ error, open, onClose, onRetry, onContactStaff }: ErrorDialogProps) {
    const [countdown, setCountdown] = useState(2);

    const errorInfo = getErrorInfo(error);
    const colors = getErrorColors(errorInfo.severity);
    const IconComponent = errorInfo.icon;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let countdownTimer: NodeJS.Timeout;

        if (open) {
            setCountdown(2);

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
            }, 2000);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [open, onClose]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 text-xl font-bold ${colors.title}`}>
                        <IconComponent className="h-6 w-6" />
                        {errorInfo.title}
                    </DialogTitle>
                    <DialogDescription className={colors.description}>{errorInfo.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}>
                        <div className="flex items-start gap-3">
                            <IconComponent className={`mt-0.5 h-5 w-5 flex-shrink-0 ${colors.icon}`} />
                            <div className="min-w-0 flex-1">
                                <h4 className={`mb-1 font-medium ${colors.header}`}>Error Details</h4>
                                <p className={`text-sm ${colors.text} break-words`}>{error}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                            <UserPlus className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                            <div className="min-w-0 flex-1">
                                <h4 className="mb-2 font-medium text-blue-800">What to do next?</h4>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    {errorInfo.nextSteps.map((step, index) => (
                                        <li key={index} className="break-words">
                                            • {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <div className="text-center text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {errorInfo.isRetryable && onRetry && (
                                <Button variant="outline" onClick={onRetry} className="flex min-w-0 flex-1 items-center gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </Button>
                            )}

                            {onContactStaff && (
                                <Button
                                    className="flex min-w-0 flex-1 items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={onContactStaff}
                                >
                                    <Phone className="h-4 w-4" />
                                    Contact Staff
                                </Button>
                            )}

                            <Button
                                variant={errorInfo.isRetryable ? 'secondary' : 'outline'}
                                onClick={onClose}
                                className="flex min-w-0 flex-1 items-center gap-2"
                            >
                                <Home className="h-4 w-4" />
                                {errorInfo.isRetryable ? 'Back' : 'Close'}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
