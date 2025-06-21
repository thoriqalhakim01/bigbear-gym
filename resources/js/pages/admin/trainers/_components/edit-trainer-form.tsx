import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trainer } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type Props = {
    trainer: Trainer;
};

type EditForm = {
    rfid_uid: string;
    full_name: string;
    email: string;
    phone_number: string;
};

export default function EditTrainerForm({ trainer }: Props) {
    const { data, setData, put, processing, errors } = useForm<EditForm>({
        rfid_uid: trainer.rfid_uid,
        full_name: trainer.full_name,
        email: trainer.email,
        phone_number: trainer.phone_number,
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('trainers.update', trainer.id), {
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
            <div className="grid gap-1">
                <Label htmlFor="rfid_uid">RFID UID</Label>
                <Input
                    id="rfid_uid"
                    type="text"
                    name="rfid_uid"
                    tabIndex={1}
                    value={data.rfid_uid}
                    onChange={(e) => setData('rfid_uid', e.target.value)}
                    disabled={true}
                    placeholder="e.g. A1B2C3E4F5"
                />
                <InputError message={errors.rfid_uid} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="full_name">Name</Label>
                <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    tabIndex={2}
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. John Doe"
                />
                <InputError message={errors.full_name} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    tabIndex={3}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. username@example.com"
                />
                <InputError message={errors.email} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative">
                    <Input
                        id="phone_number"
                        type="tel"
                        tabIndex={4}
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
                <InputError message={errors.phone_number} />
            </div>
            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
    );
}
