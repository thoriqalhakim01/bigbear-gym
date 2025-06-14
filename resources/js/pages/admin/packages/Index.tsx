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
            <div className="flex flex-col gap-4 p-4 overflow-x-auto rounded-xl">
                <div className="flex items-center justify-between flex-1">
                    <h1 className="text-2xl font-semibold">Package Listing</h1>
                    <CreatePackage />
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="inline-block min-w-full p-1.5 align-middle">
                                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-xs dark:border-neutral-700 dark:shadow-gray-900">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead className="bg-gray-50 dark:bg-neutral-700">
                                            <tr className="text-sm">
                                                <th className="h-12 px-4 font-medium text-left align-middle text-muted-foreground">#</th>
                                                <th className="h-12 px-4 font-medium text-left align-middle text-muted-foreground">Name</th>
                                                <th className="h-12 px-4 font-medium text-left align-middle text-muted-foreground">Points</th>
                                                <th className="h-12 px-4 font-medium text-left align-middle text-muted-foreground">Price</th>
                                                <th className="h-12 px-4 font-medium text-center align-middle text-muted-foreground">Expires (Days)</th>
                                                <th className="h-12 px-4 font-medium text-right align-middle text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-gray-200 dark:divide-neutral-700">
                                            {packages.data.map((item, index) => (
                                                <tr key={item.id} className="text-sm">
                                                    <td className="p-4 align-middle">{packages.from + index}</td>
                                                    <td className="p-4 align-middle">{item.name}</td>
                                                    <td className="p-4 align-middle">{item.points}</td>
                                                    <td className="p-4 align-middle">
                                                        {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                                    </td>
                                                    <td className="p-4 text-center align-middle">{item.duration}</td>
                                                    <td className="flex items-center justify-end gap-2 p-4 align-middle">
                                                        <EditPackage item={item} />
                                                        <DeletePackage id={item.id} />
                                                    </td>
                                                </tr>
                                            ))}
                                            {packages.data.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                        No package found
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
                            Showing {packages.from} to {packages.to} of {packages.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(packages.current_page - 1)}
                                disabled={packages.current_page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
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
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
