import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, PaginatedResponse, Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, PlusCircle, Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import DeleteTransaction from './_components/delete-transaction';
import ShowTransaction from './_components/show-transaction';

type Props = {
    transactions: PaginatedResponse<Transaction>;
    flash?: {
        success?: string;
        error?: string;
    };
    filters?: FilterParams;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: route('transactions.index'),
    },
];

export default function Transactions({ transactions, flash, filters }: Props) {
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

        router.get(route('transactions.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        const params: FilterParams = {
            page,
        };

        router.get(route('transactions.index'), params, {
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
            <Head title="Transactions" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Transactions</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('transactions.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Create New</span>
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
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Point added</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment method</TableHead>
                                    <TableHead className="text-end">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.transaction_date}</TableCell>
                                        <TableCell className="flex flex-col space-y-1">
                                            <span>{item.member?.full_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.member?.is_member ? 'Active Member' : 'Non-member'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.package?.name}</TableCell>
                                        <TableCell>{item.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                                        <TableCell>{item.payment_method}</TableCell>
                                        <TableCell className="flex items-center justify-end gap-2">
                                            <ShowTransaction transaction={item} />
                                            <Button asChild size={'sm'}>
                                                <Link href={route('transactions.edit', item.id)}>
                                                    <Pencil />
                                                </Link>
                                            </Button>
                                            <DeleteTransaction id={item.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {transactions.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {transactions.total > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {transactions.from} to {transactions.to} of {transactions.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(transactions.current_page - 1)}
                                    disabled={transactions.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: transactions.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === transactions.current_page ? 'default' : 'outline'}
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
                                    onClick={() => handlePageChange(transactions.current_page + 1)}
                                    disabled={transactions.current_page === transactions.last_page}
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
