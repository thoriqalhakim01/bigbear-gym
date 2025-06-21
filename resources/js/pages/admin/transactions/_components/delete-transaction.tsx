import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

export default function DeleteTransaction({ id }: { id: string }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deleteTransaction: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('transactions.destroy', id), {
            preserveScroll: true,
            onSuccess: (response) => {
                console.log(response);
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size={'sm'}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
                <DialogDescription>
                    Once a transaction is deleted, all of its resources and data will also be permanently deleted. Please enter your password to
                    confirm you would like to permanently delete this transaction.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteTransaction}>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="sr-only">
                            Password
                        </Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            autoComplete="current-password"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing}>
                            Delete transaction
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
