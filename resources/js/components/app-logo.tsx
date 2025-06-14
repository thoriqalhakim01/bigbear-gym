export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md">
                <img src="/logo.png" alt="" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Dashboard</span>
                <span className="text-xs text-muted-foreground">Big Bear Gym</span>
            </div>
        </>
    );
}
