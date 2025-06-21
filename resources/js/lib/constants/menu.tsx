import { type NavItem } from '@/types';
import { AlarmCheck, ArrowLeftRight, ChartLine, Dumbbell, LayoutGrid, MonitorSmartphone, SquareLibrary, Users } from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Trainers',
        href: '/dashboard/trainers',
        icon: Dumbbell,
    },
    {
        title: 'Members',
        href: '/dashboard/members',
        icon: Users,
    },
    {
        title: 'Packages',
        href: '/dashboard/packages',
        icon: SquareLibrary,
    },
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
        icon: ArrowLeftRight,
    },
    {
        title: 'Attendance History',
        href: '/dashboard/attendances',
        icon: AlarmCheck,
    },
    {
        title: 'Report and Analytics',
        href: '/dashboard/report-analytics',
        icon: ChartLine,
    },
    {
        title: 'Staffs',
        href: '/dashboard/staffs',
        icon: Users,
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Client Page',
        href: '/check-in',
        icon: MonitorSmartphone,
    },
];
