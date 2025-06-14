import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';
import { Plus } from 'lucide-react';

type CreateForm = {
    staff_id: number;
    name: string;
    points: number | '';
    price: number | '';
    duration: number | '';
};

export default function CreatePackage() {
    const [open, setOpen] = useState(false);

    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<CreateForm>({
        staff_id: auth.user.id,
        name: '',
        points: '',
        price: '',
        duration: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('packages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    const closeModal = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    <span className="hidden md:block">Create New</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Create New</DialogTitle>
                <DialogDescription>Let's fill out to create a new package</DialogDescription>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="e.g. Small package"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="points">Point Added</Label>
                        <Input
                            id="points"
                            type="text"
                            required
                            tabIndex={2}
                            value={data.points}
                            onChange={(e) => setData('points', parseInt(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 100"
                        />
                        <InputError message={errors.points} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="text"
                            required
                            tabIndex={3}
                            value={data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 25000"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="duration">Expires After (days)</Label>
                        <Input
                            id="duration"
                            type="text"
                            required
                            tabIndex={3}
                            value={data.duration}
                            onChange={(e) => setData('duration', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 60 (days)"
                        />
                        <InputError message={errors.duration} className="mt-2" />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
