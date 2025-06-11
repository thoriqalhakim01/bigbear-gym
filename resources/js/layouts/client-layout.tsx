import { PropsWithChildren } from 'react';
import ClientHeaderLayout from './client/client-header-layout';

export default function ClientLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            <div className="absolute inset-0">
                <img src="/gym-bg.jpg" alt="Gym Background" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40"></div>
            </div>
            <div className="absolute z-20 w-full">
                <ClientHeaderLayout />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col">
                <main className="flex flex-1 items-center justify-center">
                    <div className="max-w-4xl text-center">
                        <h1 className="font-display text-7xl leading-tight font-bold text-white">
                            Made By Athletes
                            <br />
                            <span className="text-white">For Athletes</span>
                        </h1>
                        <div className="text-white">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
