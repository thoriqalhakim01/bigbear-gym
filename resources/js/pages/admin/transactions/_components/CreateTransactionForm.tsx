import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormEventHandler } from 'react';

type Props = {
    members: {
        id: number;
        full_name: string;
        is_member: boolean;
    }[];
    packages: {
        id: number;
        name: string;
    }[];
};

type CreateForm = {
    staff_id: number;
    member_id: number | '';
    package_id: number | '';
    transaction_date: string;
    payment_method: string;
    notes: string;
};

export default function CreateTransactionForm({ members, packages }: Props) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm<CreateForm>({
        staff_id: auth.user.id,
        member_id: '',
        package_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('transactions.store'), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    return (
        <form onSubmit={submit} className="w-full space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="transaction_date">Transaction Date</Label>
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
                    value={data.member_id.toString()}
                    onValueChange={(value) => {
                        setData('member_id', parseInt(value));
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="member_id" tabIndex={2}>
                        <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                        {members.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.full_name} {item.is_member ? '(Member)' : '(Guest)'}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.member_id} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="package_id">Package</Label>
                <Select
                    name="package_id"
                    value={data.package_id.toString()}
                    onValueChange={(value) => {
                        setData('package_id', parseInt(value));
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="package_id" tabIndex={3}>
                        <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                        {packages.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.package_id} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                    name="payment_method"
                    value={data.payment_method}
                    onValueChange={(value) => {
                        setData('payment_method', value);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="payment_method" tabIndex={4}>
                        <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
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
                    tabIndex={5}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    disabled={processing}
                    placeholder="Additional notes..."
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>
            <div className="flex gap-4">
                <Button type="submit" disabled={processing} className="flex-1" tabIndex={6}>
                    {processing ? 'Creating...' : 'Create Transaction'}
                </Button>
                <Button type="button" variant="outline" onClick={() => reset()} disabled={processing} tabIndex={7}>
                    Reset
                </Button>
            </div>
        </form>
    );
}
