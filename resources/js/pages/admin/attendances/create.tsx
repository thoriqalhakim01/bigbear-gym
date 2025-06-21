import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, Package, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import CreateAttendanceForm from './_components/create-attendance-form';

type Props = {
    members: Member[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance History',
        href: route('attendances.index'),
    },
    {
        title: 'Create',
        href: route('attendances.create'),
    },
];

export default function CreateAttendance({ members }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Create New</h1>
                        <p className="text-sm text-muted-foreground">Fill the form below to create new attendance.</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('attendances.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                    <CreateAttendanceForm members={members} />
                </div>
            </div>
        </AppLayout>
    );
}

