import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Member, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilLine } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import DeleteMember from './_components/DeleteMember';

type Props = {
    member: Member;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowMember({ member, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Members',
            href: '/dashboard/members',
        },
        {
            title: member.full_name,
            href: `/dashboard/members/${member.id}`,
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={member.full_name} />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold">{member.full_name}</h1>
                        <p className="text-sm">
                            {member.is_member ? (
                                <Badge variant={'secondary'} className="flex h-7 items-center bg-green-600 py-1 text-green-100 dark:bg-green-600">
                                    Active Member
                                </Badge>
                            ) : (
                                <Badge variant={'secondary'} className="flex h-7 items-center bg-red-600 py-1 text-red-100 dark:bg-red-600">
                                    Non-Member
                                </Badge>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('members.edit', { id: member.id })}>
                                <PencilLine />
                                <span className="hidden md:block">Edit</span>
                            </Link>
                        </Button>
                        <DeleteMember id={member.id} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-semibold">Points: </p>
                    <p className="font-bold">{member.is_member ? <span>{member.points?.balance ?? 0}</span> : <span>N/A</span>}</p>
                </div>
                <div className="max-w-xl space-y-2">
                    <p className="font-semibold">Contact Information</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="text-sm">
                            <p className="font-medium">Email</p>
                            <p className="text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">Phone Number</p>
                            <p className="text-muted-foreground">{member.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-1 flex-col space-y-4">
                    <p className="font-semibold">History</p>
                    <div className="rounded-md border">
                        <div className="w-fulloverflow-auto relative">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">RFID UID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Attendance Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Point Deducted</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {member.history?.map((item) => (
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{member.rfid_uid}</td>
                                            <td className="p-4 align-middle">{member.full_name}</td>
                                            <td className="p-4 align-middle">{item.entry_timestamp}</td>
                                            <td className="p-4 align-middle">{item.points_deducted}</td>
                                        </tr>
                                    ))}
                                    {member.history?.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No history found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Showing {members.from} to {members.to} of {members.total} results
                        </div>{' '}
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(members.current_page - 1)}
                                disabled={members.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>{' '}
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: members.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === members.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>{' '}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(members.current_page + 1)}
                                disabled={members.current_page === members.last_page}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>{' '}
                        </div>{' '}
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
