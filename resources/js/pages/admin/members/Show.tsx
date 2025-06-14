import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { AttendanceHistory, Member, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, PencilLine } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import DeleteMember from './_components/DeleteMember';

type Props = {
    member: Member;
    histories: {
        data: AttendanceHistory[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowMember({ member, histories, flash }: Props) {
    console.log(histories);
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

    const handlePageChange = (page: number) => {
        const params: any = {
            page,
        };

        router.get(route('members.show', member.id), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={member.full_name} />
            <div className="flex flex-col gap-4 p-4 overflow-x-auto rounded-xl">
                <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold">{member.full_name}</h1>
                        <p className="text-sm">
                            {member.is_member ? (
                                <Badge variant={'secondary'} className="flex items-center py-1 text-green-100 bg-green-600 h-7 dark:bg-green-600">
                                    Active Member
                                </Badge>
                            ) : (
                                <Badge variant={'secondary'} className="flex items-center py-1 text-red-100 bg-red-600 h-7 dark:bg-red-600">
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
                <div className="flex items-center gap-2">
                    <p className="font-semibold">Expires: </p>
                    <p className="font-bold">{member.is_member ? <span>{member.points?.expiration_date ?? 0}</span> : <span>N/A</span>}</p>
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
                <div className="flex flex-col flex-1 w-full space-y-4">
                    <p className="font-semibold">History</p>
                    <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="inline-block min-w-full p-1.5 align-middle">
                                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-xs dark:border-neutral-700 dark:shadow-gray-900">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead className="bg-gray-50 dark:bg-neutral-700">
                                            <tr className="text-sm">
                                                <th className="h-12 px-4 font-medium text-left align-middle text-muted-foreground">RFID UID</th>
                                                <th className="h-12 px-4 font-medium text-left align-middle text-muted-foreground">Name</th>
                                                <th className="h-12 px-4 font-medium text-center align-middle text-muted-foreground">
                                                    Attendance Date
                                                </th>
                                                <th className="h-12 px-4 font-medium text-center align-middle text-muted-foreground">
                                                    Point Deducted
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-gray-200 dark:divide-neutral-700">
                                            {histories.data.map((item) => (
                                                <tr key={item.id} className="text-sm">
                                                    <td className="p-4 align-middle">{member.rfid_uid}</td>
                                                    <td className="p-4 align-middle">{member.full_name}</td>
                                                    <td className="p-4 text-center align-middle">{item.entry_timestamp}</td>
                                                    <td className="p-4 text-center align-middle">{item.points_deducted}</td>
                                                </tr>
                                            ))}
                                            {histories.data.length === 0 && (
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
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {histories.from} to {histories.to} of {histories.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(histories.current_page - 1)}
                                disabled={histories.current_page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: histories.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === histories.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(histories.current_page + 1)}
                                disabled={histories.current_page === histories.last_page}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
