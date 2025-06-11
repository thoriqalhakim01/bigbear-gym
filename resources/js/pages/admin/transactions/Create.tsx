import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import CreateTransactionForm from './_components/CreateTransactionForm';

type Props = {
    members: { id: number; full_name: string; is_member: boolean }[];
    packages: { id: number; name: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
    },
    {
        title: 'Create',
        href: '/dashboard/transactions/create',
    },
];

export default function CreateTransaction({ members, packages }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Create New</h1>
                        <p className="text-sm text-muted-foreground">Fill the form below to create new transaction.</p>
                    </div>
                    <Button variant={'outline'} asChild>
                        <Link href={route('transactions.index')}>
                            <X />
                            <span className="hidden md:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <div className="mx-auto mt-6 flex w-full max-w-xl flex-1 flex-col">
                    <CreateTransactionForm members={members} packages={packages} />
                </div>
            </div>
        </AppLayout>
    );
}
