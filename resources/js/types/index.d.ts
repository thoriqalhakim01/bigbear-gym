import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Member {
    id: number;
    staff_id: number;
    full_name: string;
    email: string;
    phone: string;
    registration_date: string;
    is_member: boolean;
    rfid_uid: string | null;
    created_at: string;
    updated_at: string;
    points?: Point;
    history?: AttendanceHistory[];
    [key: string]: unknown;
}

export interface Point {
    id: number;
    member_id: number;
    balance: number;
}

export interface AttendanceHistory {
    id: number;
    member_id: number;
    entry_timestamp: string;
    points_deducted: number;
}

export interface Package {
    id: number;
    staff_id: number;
    name: string;
    points: number;
    price: number;
}

export interface Transaction {
    id: number;
    staff_id: number;
    member_id: number;
    package_id: number;
    transaction_date: string;
    payment_method: string;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
    member?: Member;
    package?: Package;
}
