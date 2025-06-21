import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col">
                <div className="flex flex-col">
                    <Card className="rounded-xl">
                        <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                            <img src="/logo.png" className="size-24 fill-current text-black dark:text-white" />
                        </Link>
                        <CardHeader className="px-10 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
