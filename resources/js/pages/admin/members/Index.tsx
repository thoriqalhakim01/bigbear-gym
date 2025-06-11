import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Member, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    BookUser,
    CalendarIcon,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileDown,
    FileText,
    Filter,
    MoreVertical,
    Plus,
    Search,
    Sheet,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    members: {
        data: Member[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        status: string;
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
        title: 'Members',
        href: '/dashboard/members',
    },
];

export default function MemberListing({ flash, members, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
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

    const hasActiveFilters = filters.status !== 'all' || filters.start_date || filters.end_date;

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        const params: any = {
            search: searchTerm,
            status: statusFilter,
        };

        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        router.get(route('members.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setStartDate('');
        setEndDate('');

        router.get(
            route('members.index'),
            { search: '', status: 'all' },
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
            status: statusFilter,
        };

        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        router.get(route('members.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        window.location.href = route('members.export-excel') + '?' + params.toString();
    };

    const handleExportPdf = () => {
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        window.location.href = route('members.export-pdf') + '?' + params.toString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Member Listing</h1>
                    <Button asChild>
                        <Link href="/dashboard/members/create">
                            <Plus />
                            <span className="hidden md:block">New Member</span>
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col space-y-4">
                    {/* Search and Filters */}
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <FileDown />
                                    Export as
                                    <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <button className="flex items-center gap-2" onClick={handleExportExcel}>
                                        <Sheet />
                                        Excel
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <button className="flex items-center gap-2" onClick={handleExportPdf}>
                                        <FileText />
                                        PDF
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {showFilters && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="member">Active Member</SelectItem>
                                            <SelectItem value="non-member">Non-Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Registration From</Label>
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
                                    <Label className="text-sm font-medium">Registration To</Label>
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
                            {filters.status !== 'all' && (
                                <Badge variant="secondary" className="flex h-6 items-center gap-1">
                                    Status: {filters.status === 'member' ? 'Active Member' : 'Non-Member'}
                                    <button
                                        className="flex cursor-pointer items-center hover:text-destructive"
                                        onClick={() => {
                                            setStatusFilter('all');
                                            router.get(
                                                route('members.index'),
                                                {
                                                    ...Object.fromEntries(new URLSearchParams(window.location.search)),
                                                    status: 'all',
                                                },
                                                { preserveState: true, preserveScroll: true },
                                            );
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </Badge>
                            )}
                            {filters.start_date && (
                                <Badge variant="secondary" className="flex h-6 items-center gap-1">
                                    From: {new Date(filters.start_date).toLocaleDateString()}
                                    <button
                                        className="flex cursor-pointer items-center hover:text-destructive"
                                        onClick={() => {
                                            setStartDate('');
                                            const params = new URLSearchParams(window.location.search);
                                            params.delete('start_date');
                                            router.get(route('members.index'), Object.fromEntries(params), {
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
                                            router.get(route('members.index'), Object.fromEntries(params), {
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

                    {/* Table */}
                    <div className="rounded-md border">
                        <div className="w-fulloverflow-auto relative">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">RFID UID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Points</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {members.data.map((member) => (
                                        <tr key={member.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{member.full_name}</td>
                                            <td className="p-4 align-middle">{member.rfid_uid ?? '-'}</td>
                                            <td className="p-4 align-middle">{member.email}</td>
                                            <td className="p-4 align-middle">{member.phone}</td>
                                            <td className="p-4 text-center align-middle">
                                                {member.is_member ? (
                                                    <Badge variant={'secondary'} className="bg-green-600 px-2 py-1 text-green-100 dark:bg-green-600">
                                                        Active Member
                                                    </Badge>
                                                ) : (
                                                    <Badge variant={'secondary'} className="bg-red-600 px-2 py-1 text-red-100 dark:bg-red-600">
                                                        Non-Member
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-center align-middle">
                                                {member.is_member ? <Badge variant="secondary">{member.points?.balance ?? 0}</Badge> : <span>-</span>}
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost">
                                                            <MoreVertical />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('members.show', { id: member.id })} className="flex items-center gap-1">
                                                                <BookUser />
                                                                <span>View Details</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {members.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No members found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {members.from} to {members.to} of {members.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(members.current_page - 1)}
                                disabled={members.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
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
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(members.current_page + 1)}
                                disabled={members.current_page === members.last_page}
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
