import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Member, Trainer } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type Props = {
    member: Member;
    trainers: Trainer[];
};

type EditForm = {
    full_name: string;
    email: string;
    phone_number: string;
    registration_date: string;
    trainer_id: string;
    is_member: string;
    rfid_uid: string;
};

export default function EditMemberForm({ member, trainers }: Props) {
    const { data, setData, put, processing, errors } = useForm<EditForm>({
        full_name: member.full_name,
        email: member.email,
        phone_number: member.phone_number,
        registration_date: member.registration_date,
        trainer_id: member.trainer_id || '',
        is_member: member.is_member ? '1' : '0',
        rfid_uid: member.rfid_uid || '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('members.update', member.id), {
            onSuccess: (response) => {
                console.log(response);
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const isActiveMember = data.is_member === '1';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    tabIndex={1}
                    autoFocus
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
                    tabIndex={2}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. john.doe@example.com"
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative">
                    <Input
                        id="phone_number"
                        type="tel"
                        tabIndex={3}
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. 8123456789 (without 0)"
                        className="pl-13"
                    />
                    <div className="absolute top-0 left-0 flex h-9 items-center border-r px-2">
                        <p className="text-sm text-muted-foreground">+62</p>
                    </div>
                </div>
                <InputError message={errors.phone_number} className="mt-2" />
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
                <Label htmlFor="trainer_id">Trainers</Label>
                <Select
                    name="trainer_id"
                    value={data.trainer_id}
                    onValueChange={(value) => {
                        setData('trainer_id', value);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="trainer_id" tabIndex={5}>
                        <SelectValue placeholder="Select trainers" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainers.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                {trainer.full_name}
                            </SelectItem>
                        ))}
                        {trainers.length === 0 && <SelectItem value="0">No trainers found</SelectItem>}
                    </SelectContent>
                </Select>
                <InputError message={errors.trainer_id} className="mt-2" />
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
                        value={data.rfid_uid}
                        onChange={(e) => setData('rfid_uid', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. A1B2C3D4"
                    />
                    <InputError message={errors.rfid_uid} className="mt-2" />
                </div>
            )}
            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create New
            </Button>
        </form>
    );
}
