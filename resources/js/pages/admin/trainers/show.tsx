import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar1, Hash, Pencil, User } from 'lucide-react';
import { useEffect } from 'react';
import DeleteTrainer from './_components/delete-trainer';

type Props = {
    trainer: Trainer;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowTrainer({ trainer, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Trainers',
            href: route('trainers.index'),
        },
        {
            title: trainer.full_name,
            href: route('trainers.show', { id: trainer.id }),
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            //
        } else if (flash?.error) {
            //
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{trainer.full_name}</h1>
                        <p className="text-sm text-muted-foreground">{trainer.rfid_uid}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button size={'sm'} asChild>
                            <Link href={route('trainers.edit', { id: trainer.id })}>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <DeleteTrainer id={trainer.id} />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{trainer.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Phone Number</p>
                            <p className="text-sm text-muted-foreground">{trainer.phone_number}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                <Tabs defaultValue="members" className="w-full">
                    <TabsList>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="members">
                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Hash size={16} />
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1">
                                                <User className="size-3" />
                                                Name
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1">
                                                <Calendar1 className="size-3" />
                                                Registration Date
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trainer.members?.map((item) => {
                                        const entryDate = new Date(item.registration_date);
                                        const date = entryDate.toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        });
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.rfid_uid ?? 'N/A'}</TableCell>
                                                <TableCell>{item.full_name}</TableCell>
                                                <TableCell>{date}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {trainer.members?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                No members found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="attendance">
                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Hash size={16} />
                                        </TableHead>
                                        <TableHead>Members in Attendance</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trainer.attendances?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{}</TableCell>
                                            <TableCell>{}</TableCell>
                                            <TableCell>{item.entry_timestamp}</TableCell>
                                            <TableCell>{item.entry_timestamp}</TableCell>
                                        </TableRow>
                                    ))}
                                    {trainer.members?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No attendances found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
