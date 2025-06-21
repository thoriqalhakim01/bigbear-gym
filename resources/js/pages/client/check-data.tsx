import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientLayout from '@/layouts/client-layout';
import { Member } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import CheckDataDialog from './_components/check-data-dialog';
import ErrorDialog from './_components/error-dialog';

type Props = {
    member: Member;
    error?: string;
    success?: string;
};

export default function CheckData({ member, error, success }: Props) {
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
            `/check-data/${value.trim()}`,
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
        router.get('/check-data');
    }

    return (
        <ClientLayout>
            <Head title="Check Data" />
            <div className="mx-auto w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-4">
                    <Input
                        id="rfid_uid"
                        name="rfid_uid"
                        type="text"
                        placeholder="Enter RFID UID or tap card..."
                        value={value}
                        onChange={handleChange}
                        className="w-full"
                        autoComplete="off"
                        autoFocus
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={!value.trim() || isLoading}>
                        {isLoading ? 'Checking...' : 'Check Data'}
                    </Button>
                </form>

                {member && <CheckDataDialog member={member} open={dialogOpen} onClose={handleCloseDialog} />}

                {error && (
                    <ErrorDialog
                        error={error}
                        open={showErrorDialog}
                        onClose={() => {
                            setShowErrorDialog(false);
                            router.get('/check-data');
                        }}
                    />
                )}
            </div>
        </ClientLayout>
    );
}
