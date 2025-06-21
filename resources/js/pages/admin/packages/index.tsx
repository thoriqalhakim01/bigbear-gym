import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Package, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Hash } from 'lucide-react';
import { useEffect } from 'react';
import CreatePackage from './_components/create-package';
import DeletePackage from './_components/delete-package';
import EditPackage from './_components/edit-package';

type Props = {
    packages: Package[];
    flash?: {
        success?: string;
        error?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packages',
        href: route('packages.index'),
    },
];

export default function Trainers({ packages, flash }: Props) {
    useEffect(() => {
        if (flash?.success) {
            //
        } else if (flash?.error) {
            //
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packages" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Packages</h1>
                    <CreatePackage />
                </div>
                <Separator />
                <div className="flex flex-1 flex-col gap-2">
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead>
                                        <Hash size={16} />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-center">Point Added</TableHead>
                                    <TableHead className="text-center">Duration (days)</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                                        <TableCell className="text-center">{item.points}</TableCell>
                                        <TableCell className="text-center">{item.duration}</TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <EditPackage option={item} />
                                            <DeletePackage id={item.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {packages.length === 0 && (
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No packages found.
                                    </TableCell>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
