import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

export default function DeletePackage({ id }: { id: string }) {
    const { delete: destroy, processing } = useForm();

    const deleteTrainer: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('packages.destroy', id), {
            preserveScroll: true,
            onSuccess: (response) => {
                console.log(response);
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size={'sm'}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this package?</DialogTitle>
                <form className="space-y-6" onSubmit={deleteTrainer}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing}>
                            Delete package
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
