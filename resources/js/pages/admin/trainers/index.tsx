import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, PaginatedResponse, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Hash, PlusCircle, Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

type Props = {
    trainers: PaginatedResponse<Trainer>;
    flash?: {
        success?: string;
        error?: string;
    };
    filters?: FilterParams;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: route('trainers.index'),
    },
];

export default function Trainers({ trainers, flash, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search);

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

        router.get(route('trainers.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        const params: FilterParams = {
            page,
        };

        router.get(route('trainers.index'), params, {
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
            <Head title="Trainsers" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Trainers</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('trainers.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Trainer</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-1 items-center justify-between">
                        <form onSubmit={handleSearch} className="relative max-h-9 w-full">
                            <Input
                                type="search"
                                className="ps-8 lg:w-1/3"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute top-0 left-0 flex h-9 items-center justify-start px-2">
                                <Search size={16} />
                            </div>
                        </form>
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead>
                                        <Hash size={16} />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone number</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainers.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.rfid_uid}</TableCell>
                                        <TableCell>{item.full_name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.phone_number}</TableCell>
                                        <TableCell className="flex justify-end">
                                            <Button variant={'ghost'} size={'icon'} asChild>
                                                <Link href={route('trainers.show', { id: item.id })}>
                                                    <Eye />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {trainers.data.length === 0 && (
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No trainers found.
                                    </TableCell>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {trainers.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {trainers.from} to {trainers.to} of {trainers.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(trainers.current_page - 1)}
                                    disabled={trainers.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: trainers.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === trainers.current_page ? 'default' : 'outline'}
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
                                    onClick={() => handlePageChange(trainers.current_page + 1)}
                                    disabled={trainers.current_page === trainers.last_page}
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
