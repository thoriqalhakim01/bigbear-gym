import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientLayout from '@/layouts/client-layout';
import { Member } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';
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

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setValue(value);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!value.trim()) return;

        setIsLoading(true);

        router.get(
            `/check-in/${value.trim()}`,
            {},
            {
                onFinish: () => {
                    setIsLoading(false);
                    setValue('');
                },
                onError: (errors) => {
                    console.error('Error fetching member data:', errors);
                    setIsLoading(false);
                },
            },
        );
    }

    function handleCloseDialog() {
        setDialogOpen(false);
        router.get('/check-in');
    }

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
                        onClose={() => {
                            setShowErrorDialog(false);
                            router.get('/check-in');
                        }}
                    />
                )}
            </div>
        </ClientLayout>
    );
}
