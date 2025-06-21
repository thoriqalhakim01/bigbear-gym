import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import EditMemberForm from './_components/edit-member-form';

type Props = {
    member: Member;
    trainers: Trainer[];
};

export default function EditTrainer({ member, trainers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Members',
            href: route('members.index'),
        },
        {
            title: member.full_name,
            href: route('members.show', { id: member.id }),
        },
        {
            title: 'Create',
            href: route('members.create'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">Edit Member</h1>
                        <p className="text-sm text-muted-foreground">Complete the form below to update member.</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('members.show', { id: member.id })}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                    <EditMemberForm member={member} trainers={trainers} />
                </div>
            </div>
        </AppLayout>
    );
}
