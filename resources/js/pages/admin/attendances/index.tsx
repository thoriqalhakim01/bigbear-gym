import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { getStatusFromAttendableType } from '@/lib/helpers';
import { Attendance, FilterParams, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Hash, PlusCircle, Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

type Props = {
    attendances: PaginatedResponse<Attendance>;
    flash?: {
        success?: string;
        error?: string;
    };
    filters?: FilterParams;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance History',
        href: route('attendances.index'),
    },
];

export default function Attendances({ attendances, flash, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search);

    console.log(attendances);

    useEffect(() => {
        if (flash?.success) {
            //
        } else if (flash?.error) {
            //
        }
    }, [flash]);

    const applyFilters = () => {
        const params: FilterParams = {
            search: searchTerm,
        };

        router.get(route('attendances.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        const params: FilterParams = {
            page,
        };

        router.get(route('members.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Attendance History</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('attendances.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Create New</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-1 items-center justify-between">
                        <form onSubmit={handleSearch} className="relative max-h-8 w-full">
                            <Input
                                type="search"
                                className="h-8 ps-8 lg:w-1/3"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute top-0 left-0 flex h-8 items-center justify-start px-2">
                                <Search size={16} />
                            </div>
                        </form>
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Hash size={16} />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendances.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.attendable?.rfid_uid ?? '-'}</TableCell>
                                        <TableCell>{item.attendable?.full_name}</TableCell>
                                        <TableCell>
                                            <Badge>{getStatusFromAttendableType(item.attendable_type)}</Badge>
                                        </TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.time}</TableCell>
                                    </TableRow>
                                ))}
                                {attendances.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No attendances found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {attendances.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {attendances.from} to {attendances.to} of {attendances.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(attendances.current_page - 1)}
                                    disabled={attendances.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: attendances.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === attendances.current_page ? 'default' : 'outline'}
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
                                    onClick={() => handlePageChange(attendances.current_page + 1)}
                                    disabled={attendances.current_page === attendances.last_page}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
