import { PropsWithChildren } from 'react';
import ClientHeaderLayout from './client/client-header-layout';

export default function ClientLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col flex-1 w-full h-screen light bg-background">
            <div className="w-full px-4 mx-auto h-24z lg:h-24 max-w-7xl lg:px-0">
                <ClientHeaderLayout />
            </div>
            <div className="flex flex-col w-full h-full mx-auto max-w-7xl">
                <main className="flex flex-col flex-1 my-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold tracking-tighter">FORGE YOUR STRENGTH.</h1>
                        <h2 className="text-5xl font-bold tracking-tighter text-[#777777]">Unleash the beast within.</h2>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
