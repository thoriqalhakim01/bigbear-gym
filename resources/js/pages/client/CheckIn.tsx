import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientLayout from '@/layouts/client-layout';
import { formatErrorForLogging, getErrorInfo } from '@/lib/errorUtils';
import { Member } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import CheckInDialog from './_components/CheckInDialog';
import ErrorDialog from './_components/ErrorDialog';

type Props = {
    member: Member;
    error?: string;
    success?: string;
};

export default function CheckIn({ member, error, success }: Props) {
    const [value, setValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(!!member);
    const [showErrorDialog, setShowErrorDialog] = useState<boolean>(!!error);
    const [lastScannedValue, setLastScannedValue] = useState<string>('');

    useEffect(() => {
        if (error) {
            console.error(
                'Check-in error received:',
                formatErrorForLogging(error, {
                    rfidUid: lastScannedValue,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    currentUrl: window.location.href,
                }),
            );
        }
    }, [error, lastScannedValue]);

    useEffect(() => {
        if (success && member) {
            console.log('Check-in successful:', {
                memberName: member.name,
                rfidUid: member.rfid_uid,
                timestamp: new Date().toISOString(),
            });
        }
    }, [success, member]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setValue(value);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!value.trim()) return;

        performCheckIn(value.trim());
    }

    function performCheckIn(rfidUid: string) {
        setIsLoading(true);
        setLastScannedValue(rfidUid);

        router.get(
            `/check-in/${rfidUid}`,
            {},
            {
                onFinish: () => {
                    setIsLoading(false);
                    setValue('');
                },
                onError: (errors) => {
                    console.error(
                        'Network error during check-in:',
                        formatErrorForLogging('Network error occurred during check-in request', {
                            errors,
                            rfidUid,
                            timestamp: new Date().toISOString(),
                        }),
                    );
                    setIsLoading(false);
                },
                onSuccess: () => {
                    // Clear any previous error states
                    setShowErrorDialog(false);
                },
            },
        );
    }

    function handleCloseDialog() {
        setDialogOpen(false);
        router.get('/check-in');
    }

    function handleCloseErrorDialog() {
        setShowErrorDialog(false);
        router.get('/check-in');
    }

    function handleRetry() {
        if (lastScannedValue) {
            setShowErrorDialog(false);
            performCheckIn(lastScannedValue);
        } else {
            setShowErrorDialog(false);
            setTimeout(() => {
                const input = document.getElementById('rfid_uid') as HTMLInputElement;
                if (input) input.focus();
            }, 100);
        }
    }

    function handleContactStaff() {
        if (error) {
            const errorInfo = getErrorInfo(error);

            const contactParams = new URLSearchParams({
                subject: `Check-in Issue: ${errorInfo.title}`,
                error: error,
                errorType: errorInfo.type,
                rfidUid: lastScannedValue || 'Unknown',
                timestamp: new Date().toISOString(),
                severity: errorInfo.severity,
            });

            router.get(`/contact?${contactParams.toString()}`);
        } else {
            router.get('/contact');
        }
    }

    const errorInfo = error ? getErrorInfo(error) : null;

    return (
        <ClientLayout>
            <Head title="Check In" />
            <div className="w-full space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Check In</h1>
                    <p className="text-white/80">Enter your RFID UID below or tap your member card to check in.</p>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl items-center gap-4">
                    <Input
                        id="rfid_uid"
                        name="rfid_uid"
                        type="text"
                        placeholder="Enter RFID UID or tap card..."
                        value={value}
                        onChange={handleChange}
                        className="w-full border-white/20 bg-white/50 text-white placeholder:text-black/60 focus:border-yellow-500 focus:ring-yellow-500"
                        autoComplete="off"
                        autoFocus
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={!value.trim() || isLoading}>
                        {isLoading ? 'Checking in...' : 'Check In'}
                    </Button>
                </form>

                {member && <CheckInDialog member={member} open={dialogOpen} onClose={handleCloseDialog} />}

                {error && (
                    <ErrorDialog
                        error={error}
                        open={showErrorDialog}
                        onClose={handleCloseErrorDialog}
                        onRetry={handleRetry}
                        onContactStaff={handleContactStaff}
                    />
                )}
            </div>
        </ClientLayout>
    );
}
