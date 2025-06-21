import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trainer } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type Props = {
    trainers: Trainer[];
    onSuccess?: (message: string) => void;
};

type RegisterFormProps = {
    full_name: string;
    email: string;
    phone_number: string;
    trainer_id: string;
};

export default function RegisterForm({ trainers, onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterFormProps>({
        full_name: '',
        email: '',
        phone_number: '',
        trainer_id: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('client.register-store'), {
            onSuccess: (response) => {
                console.log('Registration successful:', response);
                reset();
                if (onSuccess) {
                    onSuccess('Please contact the admin to verify your registration.');
                }
            },
            onError: (errors) => {
                console.log('Registration errors:', errors);
            },
        });
    };

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
                <Label htmlFor="trainer_id">Trainers</Label>
                <Select
                    name="trainer_id"
                    value={data.trainer_id}
                    onValueChange={(value) => {
                        setData('trainer_id', value);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="trainer_id" tabIndex={4}>
                        <SelectValue placeholder="Select trainers" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainers.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                {trainer.full_name}
                            </SelectItem>
                        ))}
                        {trainers.length === 0 && (
                            <SelectItem value="0" disabled>
                                No trainers found
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <InputError message={errors.trainer_id} className="mt-2" />
            </div>

            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Register
            </Button>
        </form>
    );
}
