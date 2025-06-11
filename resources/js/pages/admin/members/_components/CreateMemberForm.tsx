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

type CreateForm = {
    staff_id: number;
    full_name: string;
    email: string;
    phone: string;
    registration_date: string;
    is_member: string;
    rfid_uid: string;
};

export default function CreateMemberForm() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm<CreateForm>({
        staff_id: auth.user.id,
        full_name: '',
        email: '',
        phone: '',
        registration_date: new Date().toISOString().split('T')[0],
        is_member: '',
        rfid_uid: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('members.store'), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    const isActiveMember = data.is_member === '1';

    return (
        <form onSubmit={submit} className="w-full space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. John Doe"
                />
                <InputError message={errors.full_name} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. john.doe@example.com"
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                    <Input
                        id="phone"
                        type="tel"
                        required
                        tabIndex={3}
                        autoComplete="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. 8123456789 (without 0)"
                        className="pl-13"
                    />
                    <div className="absolute top-0 left-0 flex h-9 items-center border-r px-2">
                        <p className="text-sm text-muted-foreground">+62</p>
                    </div>
                </div>
                <InputError message={errors.phone} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="registration_date">Registration Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="registration_date"
                            tabIndex={4}
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !data.registration_date && 'text-muted-foreground')}
                            type="button"
                        >
                            {data.registration_date ? format(new Date(data.registration_date), 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={new Date(data.registration_date)}
                            onSelect={(date) => {
                                if (date) {
                                    setData('registration_date', format(date, 'yyyy-MM-dd'));
                                }
                            }}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                        />
                    </PopoverContent>
                </Popover>
                <InputError message={errors.registration_date} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="is_member">Membership Status</Label>
                <Select
                    name="is_member"
                    value={data.is_member}
                    onValueChange={(value) => {
                        setData('is_member', value);
                        if (value === '0') {
                            setData('rfid_uid', '');
                        }
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="is_member" tabIndex={5}>
                        <SelectValue placeholder="Select membership status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active Member</SelectItem>
                        <SelectItem value="0">Non-Member</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.is_member} className="mt-2" />
            </div>

            {isActiveMember && (
                <div className="grid gap-2">
                    <Label htmlFor="rfid_uid">RFID UID</Label>
                    <Input
                        id="rfid_uid"
                        type="text"
                        required={isActiveMember}
                        tabIndex={6}
                        autoComplete="rfid_uid"
                        value={data.rfid_uid}
                        onChange={(e) => setData('rfid_uid', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. A1B2C3D4"
                    />
                    <InputError message={errors.rfid_uid} className="mt-2" />
                </div>
            )}

            <div className="flex gap-4">
                <Button type="submit" disabled={processing} className="flex-1" tabIndex={7}>
                    {processing ? 'Creating...' : 'Create Member'}
                </Button>
                <Button type="button" variant="outline" onClick={() => reset()} disabled={processing} tabIndex={8}>
                    Reset
                </Button>
            </div>
        </form>
    );
}
