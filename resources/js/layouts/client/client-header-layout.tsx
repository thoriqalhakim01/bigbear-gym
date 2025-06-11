import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function ClientHeaderLayout() {
    return (
        <header className="mx-auto flex h-16 w-full max-w-4xl items-center justify-end text-sm">
            <nav className="flex items-center justify-end gap-4">
                <Button variant={'outline'} asChild>
                    <Link href={route('client.check-in')}>Check In</Link>
                </Button>
                <Button asChild>
                    <Link href={route('client.check-data')}>Check Data</Link>
                </Button>
            </nav>
        </header>
    );
}
