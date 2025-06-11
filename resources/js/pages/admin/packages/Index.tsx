import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Package, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import CreatePackage from './_components/CreatePackage';
import DeletePackage from './_components/DeletePackage';
import EditPackage from './_components/EditPackage';

interface Props {
    packages: {
        data: Package[];
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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packages',
        href: '/dashboard/packages',
    },
];

export default function PackageListing({ flash, packages }: Props) {
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

        router.get(route('packages.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Package Listing</h1>
                    <CreatePackage />
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">#</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Points</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {packages.data.map((item, index) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{packages.from + index}</td>
                                            <td className="p-4 align-middle">{item.name}</td>
                                            <td className="p-4 align-middle">{item.points}</td>
                                            <td className="p-4 align-middle">
                                                {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                            </td>
                                            <td className="flex items-center justify-end gap-2 p-4 align-middle">
                                                <EditPackage item={item} />
                                                <DeletePackage id={item.id} />
                                            </td>
                                        </tr>
                                    ))}
                                    {packages.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No package found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {packages.from} to {packages.to} of {packages.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(packages.current_page - 1)}
                                disabled={packages.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: packages.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === packages.current_page ? 'default' : 'outline'}
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
                                onClick={() => handlePageChange(packages.current_page + 1)}
                                disabled={packages.current_page === packages.last_page}
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
