import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, PencilLine, Plus, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DeleteTransaction from './_components/DeleteTransaction';
import ShowTransaction from './_components/ShowTransaction';

interface Props {
    transactions: {
        data: Transaction[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        start_date: string | null;
        end_date: string | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
    },
];

export default function TransactionListing({ flash, transactions, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const hasActiveFilters = filters.start_date || filters.end_date;

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        const params: any = {
            search: searchTerm,
        };

        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        router.get(route('transactions.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');

        router.get(
            route('transactions.index'),
            { search: '' },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        const params: any = {
            page,
            search: searchTerm,
        };

        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        router.get(route('transactions.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Transaction Listing</h1>
                    <Button asChild>
                        <Link href={route('transactions.create')}>
                            <Plus />
                            <span className="hidden md:block">Create Mew</span>
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex w-full items-center gap-2">
                            <form onSubmit={handleSearch} className="max-w-md flex-1">
                                <div className="relative max-h-9">
                                    <Input
                                        placeholder="Search member....."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="absolute top-0 left-2 flex h-full items-center">
                                        <Search size={16} className="text-muted-foreground" />
                                    </div>
                                </div>
                            </form>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filters</span>
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                        !
                                    </Badge>
                                )}
                            </Button>

                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                                    <X size={16} />
                                    <span className="hidden sm:inline">Clear</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Start date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal', !startDate && 'text-muted-foreground')}
                                                type="button"
                                            >
                                                {startDate ? format(new Date(startDate), 'PPP') : <span>Pick start date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate ? new Date(startDate) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setStartDate(format(date, 'yyyy-MM-dd'));
                                                    } else {
                                                        setStartDate('');
                                                    }
                                                }}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">End date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal', !endDate && 'text-muted-foreground')}
                                                type="button"
                                            >
                                                {endDate ? format(new Date(endDate), 'PPP') : <span>Pick end date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate ? new Date(endDate) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setEndDate(format(date, 'yyyy-MM-dd'));
                                                    } else {
                                                        setEndDate('');
                                                    }
                                                }}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowFilters(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={applyFilters}>Apply Filters</Button>
                            </div>
                        </div>
                    )}

                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {filters.start_date && (
                                <Badge variant="secondary" className="flex h-6 items-center gap-1">
                                    From: {new Date(filters.start_date).toLocaleDateString()}
                                    <button
                                        className="flex cursor-pointer items-center hover:text-destructive"
                                        onClick={() => {
                                            setStartDate('');
                                            const params = new URLSearchParams(window.location.search);
                                            params.delete('start_date');
                                            router.get(route('transactions.index'), Object.fromEntries(params), {
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </Badge>
                            )}
                            {filters.end_date && (
                                <Badge variant="secondary" className="flex h-6 items-center gap-1">
                                    To: {new Date(filters.end_date).toLocaleDateString()}
                                    <button
                                        className="flex cursor-pointer items-center hover:text-destructive"
                                        onClick={() => {
                                            setEndDate('');
                                            const params = new URLSearchParams(window.location.search);
                                            params.delete('end_date');
                                            router.get(route('transactions.index'), Object.fromEntries(params), {
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="rounded-md border">
                        <div className="w-fulloverflow-auto relative">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Point Added</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Price</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Payment Method</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {transactions.data.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{item.transaction_date}</td>
                                            <td className="p-4 align-middle">{item.member?.full_name}</td>
                                            <td className="p-4 text-center align-middle">
                                                {item.package?.name} - {item.package?.points}
                                            </td>
                                            <td className="p-4 text-center align-middle">
                                                {item.package?.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                            </td>
                                            <td className="p-4 text-center align-middle">
                                                {item.payment_method === 'debit_card'
                                                    ? 'Debit Card'
                                                    : item.payment_method === 'bank_transfer'
                                                      ? 'Bank Transfer'
                                                      : item.payment_method === 'credit_card'
                                                        ? 'Credit Card'
                                                        : item.payment_method === 'qris'
                                                          ? 'QRIS'
                                                          : 'Cash'}
                                            </td>
                                            <td className="flex items-center justify-end gap-2 p-4 align-middle">
                                                <ShowTransaction transaction={item} />
                                                <Button
                                                    className="dark:focus-visible:ring-green/40 bg-green-500 text-white shadow-xs hover:bg-green-500/90 focus-visible:ring-green-500/20"
                                                    asChild
                                                >
                                                    <Link href={route('transactions.edit', item.id)}>
                                                        <PencilLine />
                                                    </Link>
                                                </Button>
                                                <DeleteTransaction id={item.id} />
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                </div>
            </div>
        </AppLayout>
    );
}
