import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package } from '@/types';
import { PencilLine } from 'lucide-react';

type Props = {
    item: Package;
};

type EditForm = {
    staff_id: number;
    name: string;
    points: number;
    price: number;
};

export default function EditPackage({ item }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm<EditForm>({
        staff_id: item.staff_id,
        name: item.name,
        points: item.points,
        price: item.price,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('packages.update', item.id), {
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
                <Button variant={'outline'}>
                    <PencilLine />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Package</DialogTitle>
                <DialogDescription>Let's fill out to edit a package</DialogDescription>
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
                            type="number"
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
                            type="number"
                            required
                            tabIndex={3}
                            value={data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 25000"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
