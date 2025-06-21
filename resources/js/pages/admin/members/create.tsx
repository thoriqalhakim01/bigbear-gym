import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import CreateMemberForm from './_components/create-member-form';

type Props = {
    trainers: Trainer[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: route('members.index'),
    },
    {
        title: 'Create',
        href: route('members.create'),
    },
];

export default function CreateMember({ trainers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">New Member</h1>
                        <p className="text-sm text-muted-foreground">Complete the form below to register a new member to the platform.</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('members.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                    <CreateMemberForm trainers={trainers} />
                </div>
            </div>
        </AppLayout>
    );
}
