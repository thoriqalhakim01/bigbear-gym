import { type NavItem } from '@/types';
import { AppWindow, ArrowLeftRight, BookOpen, ChartLine, Folder, LayoutGrid, Menu, Settings2, Users } from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Members',
        href: '/dashboard/members',
        icon: Users,
    },
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
        icon: ArrowLeftRight,
    },
    {
        title: 'Packages',
        href: '/dashboard/packages',
        icon: Menu,
    },
    // {
    //     title: 'Report & Analytics',
    //     href: '/dashboard/report-analytics',
    //     icon: ChartLine,
    // },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Client Page',
        href: '/check-in',
        icon: AppWindow
    }
];
