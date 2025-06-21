import { Trainer } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InformationDialog from './_components/information-dialog';
import RegisterForm from './_components/register-form';

type Props = {
    trainers: Trainer[];
    flash?: {
        error?: string;
        success?: string;
    };
};

export default function Register({ trainers, flash }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>();

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            setDialogOpen(true);
        }
    }, [flash]);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSuccessMessage(undefined);
        window.history.replaceState({}, '', window.location.pathname);
    };

    const handleRegistrationSuccess = (message: string) => {
        setSuccessMessage(message);
        setDialogOpen(true);
    };

    return (
        <>
            <Head title="Member Register" />
            <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                <div className="mx-auto w-full max-w-xl">
                    <div className="rounded-lg p-4 md:border md:bg-muted md:shadow-2xl">
                        <div className="flex flex-col space-y-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold">Member Register</h1>
                                <p className="text-sm text-muted-foreground">Complete the form below to register a new member to the platform.</p>
                            </div>
                            <RegisterForm trainers={trainers} onSuccess={handleRegistrationSuccess} />
                        </div>
                    </div>
                </div>

                <InformationDialog success={successMessage} open={dialogOpen} onClose={handleDialogClose} />
            </div>
        </>
    );
}
