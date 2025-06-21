import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Props = {
    members: Member[];
};

type CreateForm = {
    member_id: string;
    entry_timestamp: string;
};

export default function CreateAttendanceForm({ members }: Props) {
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<string>('10:30');
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        member_id: '',
        entry_timestamp: '',
    });

    const combineDateTime = (selectedDate: Date, selectedTime: string): string => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const timeWithSeconds = selectedTime.includes(':') && selectedTime.split(':').length === 2 ? `${selectedTime}:00` : selectedTime;
        return `${dateStr} ${timeWithSeconds}`;
    };

    const handleDateChange = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            const combined = combineDateTime(selectedDate, time);
            setData('entry_timestamp', combined);
        }
    };

    const handleTimeChange = (selectedTime: string) => {
        setTime(selectedTime);
        const combined = combineDateTime(date, selectedTime);
        setData('entry_timestamp', combined);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data.entry_timestamp) {
            const combined = combineDateTime(date, time);
            setData('entry_timestamp', combined);
        }

        post(route('attendances.store'), {
            onSuccess: (response) => {
                console.log('Attendance created successfully:', response);
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <div className="flex gap-4">
                    <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1">
                            Date
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" id="date-picker" className="justify-between font-normal" type="button">
                                    {date ? format(date, 'dd/MM/yyyy') : 'Select date'}
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(selectedDate) => {
                                        handleDateChange(selectedDate);
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex w-full flex-col gap-3">
                        <Label htmlFor="time-picker" className="px-1">
                            Time
                        </Label>
                        <Input
                            type="time"
                            id="time-picker"
                            value={time}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                    </div>
                </div>

                {data.entry_timestamp && <div className="text-sm text-muted-foreground">Entry Timestamp: {data.entry_timestamp}</div>}

                <InputError message={errors.entry_timestamp} className="mt-2" />
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
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.full_name} {item.is_member ? '(Member)' : '(Guest)'}
                            </SelectItem>
                        ))}
                        {members.length === 0 && (
                            <SelectItem value="0" disabled>
                                No members found
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <InputError message={errors.member_id} className="mt-2" />
            </div>

            <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create New
            </Button>
        </form>
    );
}
