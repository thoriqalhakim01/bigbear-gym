import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import CreateTrainerForm from './_components/create-trainer-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: route('trainers.index'),
    },
    {
        title: 'Create',
        href: route('trainers.create'),
    },
];

export default function CreateTrainer() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">New Trainer</h1>
                        <p className="text-sm text-muted-foreground">Complete the form below to register a new trainer to the platform.</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('trainers.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                    <CreateTrainerForm />
                </div>
            </div>
        </AppLayout>
    );
}
