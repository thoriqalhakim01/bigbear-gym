import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Member, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import EditMemberForm from './_components/EditMemberForm';

type Props = {
    member: Member;
};

export default function EditMember({ member }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Members',
            href: '/dashboard/members',
        },
        {
            title: member.full_name,
            href: `/dashboard/members/${member.id}`,
        },
        {
            title: 'Edit',
            href: `/dashboard/members/${member.id}/edit`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Edit Member</h1>
                        <p className="text-sm text-muted-foreground">Edit the details of the member to update their information.</p>
                    </div>
                    <Button variant={'outline'} asChild>
                        <Link href={route('members.show', { id: member.id })}>
                            <X />
                            <span className="hidden md:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <div className="mx-auto mt-6 flex w-full max-w-xl flex-1 flex-col">
                    <EditMemberForm member={member} />
                </div>
            </div>
        </AppLayout>
    );
}
