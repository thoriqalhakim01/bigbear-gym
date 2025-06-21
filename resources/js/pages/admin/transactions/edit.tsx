import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, Package, Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import EditTransactionForm from './_components/edit-transaction-form';

type Props = {
    transaction: Transaction;
    members: Member[];
    options: Package[];
};

export default function EditTransaction({ transaction, members, options }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transactions',
            href: route('transactions.index'),
        },
        {
            title: 'Edit',
            href: route('transactions.edit', { id: transaction.id }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Edit Transaction</h1>
                        <p className="text-sm text-muted-foreground">Fill the form below to create new transaction.</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('transactions.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                    <EditTransactionForm transaction={transaction} members={members} options={options} />
                </div>
            </div>
        </AppLayout>
    );
}
