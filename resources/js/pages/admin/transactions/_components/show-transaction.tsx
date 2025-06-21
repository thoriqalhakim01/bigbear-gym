import { Button } from '@/components/ui/button';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transaction } from '@/types';
import { Eye } from 'lucide-react';

type Props = {
    transaction: Transaction;
};

export default function ShowTransaction({ transaction }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} size={'sm'}>
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Detail Transaction</DialogTitle>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Transaction Date</p>
                        <p>{transaction.transaction_date}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Member</p>
                        <p>{transaction.member?.full_name}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Package</p>
                        <p>{transaction.package?.name}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Point Added</p>
                        <p>{transaction.package?.points}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Amout</p>
                        <p>{transaction.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Payment Method</p>
                        <p>{transaction.payment_method}</p>
                    </div>
                </div>
                <div className="grid gap-1 text-sm">
                    <p className="font-semibold">Notes</p>
                    <p>{transaction.notes}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
