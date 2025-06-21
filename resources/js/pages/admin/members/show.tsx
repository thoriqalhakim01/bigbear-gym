import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Member, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Hash, Pencil } from 'lucide-react';
import { useEffect } from 'react';
import DeleteMember from './_components/delete-member';

type Props = {
    member: Member & {
        attendances?: Array<{
            id: string;
            entry_date: string;
            entry_time: string;
        }>;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowMember({ member, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Member',
            href: route('members.index'),
        },
        {
            title: member.full_name,
            href: route('members.show', { id: member.id }),
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            // Handle success flash message
        } else if (flash?.error) {
            // Handle error flash message
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{member.full_name}</h1>
                        <p className="text-sm text-muted-foreground">{member.rfid_uid}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button size={'sm'} asChild>
                            <Link href={route('members.edit', { id: member.id })}>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <DeleteMember id={member.id} />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Phone Number</p>
                            <p className="text-sm text-muted-foreground">{member.phone_number}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <p className="font-semibold">Attendance History</p>
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Hash size={16} />
                                    </TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {member.attendances?.map((attendance, index) => (
                                    <TableRow key={attendance.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{attendance.entry_date}</TableCell>
                                        <TableCell>{attendance.entry_time}</TableCell>
                                    </TableRow>
                                ))}
                                {member.attendances?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No attendance history
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
