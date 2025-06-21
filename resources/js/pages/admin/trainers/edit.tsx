import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import EditTrainerForm from './_components/edit-trainer-form';

type Props = {
    trainer: Trainer;
};

export default function EditTrainer({ trainer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Trainers',
            href: route('trainers.index'),
        },
        {
            title: trainer.full_name,
            href: route('trainers.show', { id: trainer.id }),
        },
        {
            title: 'Create',
            href: route('trainers.create'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Edit Trainer</h1>
                        <p className="text-sm text-muted-foreground">Complete the form below to update trainer.</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('trainers.show', { id: trainer.id })}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                    <EditTrainerForm trainer={trainer} />
                </div>
            </div>
        </AppLayout>
    );
}
