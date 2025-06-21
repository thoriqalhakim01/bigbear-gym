import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, Member, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Hash, PlusCircle } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { FilterDropdown } from './_components/filter-dropdown';
import { SearchBar } from './_components/search-bar';
import { useFilters } from './_hooks/useFilters';

type Props = {
    members: PaginatedResponse<Member>;
    flash?: {
        success?: string;
        error?: string;
    };
    filters?: FilterParams;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: route('members.index'),
    },
];

export default function Members({ members, flash, filters: initialFilters }: Props) {
    const { searchTerm, filters, setSearchTerm, handleFilterChange, handleSearch, handleApplyFilters, handleClearFilters } =
        useFilters(initialFilters);

    useEffect(() => {
        if (flash?.success) {
            // Handle success flash message
        } else if (flash?.error) {
            // Handle error flash message
        }
    }, [flash]);

    const handlePageChange = (page: number) => {
        const params: FilterParams = { page };
        router.get(route('members.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Members</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('members.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Member</span>
                        </Link>
                    </Button>
                </div>

                <Separator />

                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex flex-1 items-center gap-2">
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                onSearchSubmit={handleSearchSubmit}
                                placeholder="Search members..."
                            />
                            <FilterDropdown
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onApplyFilters={handleApplyFilters}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Hash size={16} />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Trainer</TableHead>
                                    <TableHead>Phone number</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Points</TableHead>
                                    <TableHead className="text-end">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.rfid_uid ?? '-'}</TableCell>
                                        <TableCell>{item.full_name}</TableCell>
                                        <TableCell>{item.trainer?.full_name}</TableCell>
                                        <TableCell>{item.phone_number}</TableCell>
                                        <TableCell>
                                            {item.is_member ? (
                                                <div className="flex items-center gap-1">
                                                    <Badge>Active Member</Badge>
                                                    <Badge variant="secondary" className="capitalize">
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <Badge variant={'destructive'}>Non-Member</Badge>
                                                    <Badge variant="secondary" className="capitalize">
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.is_member ? <Badge variant="secondary">{item.points?.balance}</Badge> : <span>N/A</span>}
                                        </TableCell>
                                        <TableCell className="flex justify-end">
                                            <Button variant={'ghost'} size={'icon'} asChild>
                                                <Link href={route('members.show', { id: item.id })}>
                                                    <Eye />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {members.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No members found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {members.total > 0 && (
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
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
