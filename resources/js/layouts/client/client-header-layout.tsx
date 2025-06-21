import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function ClientHeaderLayout() {
    return (
        <div className="relative h-full">
            <header className="flex items-center justify-between w-full h-20 text-sm">
                <img src="/logo.png" alt="app-logo" className="size-12 lg:size-14" />
                <nav className="flex items-center justify-end gap-4">
                    <Button variant={'outline'} asChild>
                        <Link href={route('client.check-in')}>Check In</Link>
                    </Button>
                    <Button asChild>
                        <Link href={route('client.check-data')}>Check Data</Link>
                    </Button>
                </nav>
            </header>
        </div>
    );
}
