import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import CreateMemberForm from './_components/CreateMemberForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/dashboard/members',
    },
    {
        title: 'Create',
        href: '/dashboard/members/create',
    },
];

export default function CreateMember() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Create New</h1>
                        <p className="text-sm text-muted-foreground">Create new member and start managing them easily.</p>
                    </div>
                    <Button variant={'outline'} asChild>
                        <Link href="/dashboard/members">
                            <X />
                            <span className="hidden md:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <div className="mx-auto mt-6 flex w-full max-w-xl flex-1 flex-col">
                    <CreateMemberForm />
                </div>
            </div>
        </AppLayout>
    );
}
