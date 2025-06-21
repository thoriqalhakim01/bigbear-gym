import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package } from '@/types';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Pencil } from 'lucide-react';

type Props = {
    option: Package;
};

type EditForm = {
    name: string;
    points: number | '';
    price: number | '';
    duration: number | '';
};

export default function EditPackage({ option }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm<EditForm>({
        name: option.name,
        points: option.points,
        price: option.price,
        duration: option.duration,
    });

    const deleteTrainer: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('packages.update', option.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                console.log(response);
                closeModal();
            },
            onError: (error) => {
                console.log(error);
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
                <Button size={'sm'}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Package</DialogTitle>
                <DialogDescription>Let's fill out to edit a package</DialogDescription>
                <form className="space-y-6" onSubmit={deleteTrainer}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            tabIndex={1}
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
                            tabIndex={4}
                            value={data.duration}
                            onChange={(e) => setData('duration', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 60 (days)"
                        />
                        <InputError message={errors.duration} className="mt-2" />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button disabled={processing}>Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
