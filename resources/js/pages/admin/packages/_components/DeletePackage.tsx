import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

type Props = {
    id: number;
};

export default function DeletePackage({ id }: Props) {
    const [open, setOpen] = useState(false);

    const { delete: destroy, processing } = useForm();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('packages.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'destructive'}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Package</DialogTitle>
                <DialogDescription>Are you sure you want to delete this package?</DialogDescription>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" variant={'destructive'} disabled={processing}>
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
