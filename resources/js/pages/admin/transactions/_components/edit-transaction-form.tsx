import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Member, Package, Transaction } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type Props = {
    transaction: Transaction;
    members: Member[];
    options: Package[];
};

type CreateForm = {
    member_id: string;
    package_id: string;
    transaction_date: string;
    amount: string | number;
    payment_method: string;
    status: string;
    notes: string;
};

export default function EditTransactionForm({ transaction, members, options }: Props) {
    const { data, setData, put, processing, errors } = useForm<CreateForm>({
        member_id: transaction.member_id,
        package_id: transaction.package_id,
        transaction_date: transaction.transaction_date,
        amount: transaction.amount,
        payment_method: transaction.payment_method,
        status: transaction.status,
        notes: transaction.notes || '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('transactions.update', transaction.id), {
            onSuccess: (response) => {
                console.log(response);
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="transaction_date">Registration Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="transaction_date"
                            tabIndex={1}
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !data.transaction_date && 'text-muted-foreground')}
                            type="button"
                        >
                            {data.transaction_date ? format(new Date(data.transaction_date), 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={new Date(data.transaction_date)}
                            onSelect={(date) => {
                                if (date) {
                                    setData('transaction_date', format(date, 'yyyy-MM-dd'));
                                }
                            }}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                        />
                    </PopoverContent>
                </Popover>
                <InputError message={errors.transaction_date} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="member_id">Member</Label>
                <Select
                    name="member_id"
                    value={data.member_id}
                    onValueChange={(value) => {
                        setData('member_id', value);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="member_id" tabIndex={2}>
                        <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                        {members.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.full_name} {item.is_member ? '(Member)' : '(Guest)'}
                            </SelectItem>
                        ))}
                        {members.length === 0 && <SelectItem value="0">No members found</SelectItem>}
                    </SelectContent>
                </Select>
                <InputError message={errors.member_id} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="package_id">Package</Label>
                <Select
                    name="package_id"
                    value={data.package_id}
                    onValueChange={(value) => {
                        setData('package_id', value);
                        setData('amount', options.find((item) => item.id.toString() === value)?.price.toString() || '');
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="package_id" tabIndex={3}>
                        <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                        {options.length === 0 && <SelectItem value="0">No packages found</SelectItem>}
                    </SelectContent>
                </Select>
                <InputError message={errors.package_id} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                    <Input
                        id="amount"
                        type="tel"
                        tabIndex={4}
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. 50000"
                        className="pl-11"
                    />
                    <div className="absolute top-0 left-0 flex h-9 items-center border-r px-2">
                        <p className="text-sm text-muted-foreground">Rp</p>
                    </div>
                </div>
                <InputError message={errors.amount} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="payment_method">Payment method</Label>
                <Select
                    name="payment_method"
                    value={data.payment_method}
                    onValueChange={(value) => {
                        setData('payment_method', value);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="payment_method" tabIndex={5}>
                        <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="e_wallet">E-Wallet</SelectItem>
                        <SelectItem value="qris">QRIS</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.payment_method} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                    id="notes"
                    type="text"
                    tabIndex={6}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    disabled={processing}
                    placeholder="Write your notes here..."
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <Button type="submit" className="mt-2 w-full" tabIndex={7} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save changes
            </Button>
        </form>
    );
}
