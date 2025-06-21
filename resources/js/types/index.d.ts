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

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface FilterParams {
    page?: number;
    search?: string;
    status?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    [key: string]: string | number | undefined | null;
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

export interface Trainer {
    id: string;
    staff_id: string;
    rfid_uid: string;
    full_name: string;
    image: string;
    email: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    attendances?: Attendance[];
    members?: Member[];
    staff?: User;
}

export interface Member {
    id: string;
    staff_id: string;
    trainer_id?: string | null;
    full_name: string;
    image: string;
    email: string;
    phone_number: string;
    status: string;
    registration_date: string;
    is_member: boolean;
    rfid_uid: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    trainer?: Trainer;
    points?: Point;
    attendances?: Attendance[];
    transactions?: Transaction[];
    staff?: User;

    [key: string]: unknown;
}

export interface Package {
    id: string;
    name: string;
    price: number;
    points: number;
    duration: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    formatted_price?: string;
    duration_in_months?: number;

    transactions?: Transaction[];
}

export interface Point {
    id: string;
    member_id: string;
    balance: number;
    expires_at?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    member?: Member;
}

export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'e_wallet' | 'qris';

interface Transaction {
    id: string;
    staff_id: string;
    member_id: string;
    package_id: string;
    transaction_date: string;
    amount: number;
    payment_method: PaymentMethod;
    status: string;
    notes?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    formatted_transaction_date?: string;

    member?: Member;
    package?: Package;
    staff?: User;
}

interface Attendance {
    id: string;
    staff_id: string;
    attendable_id: string;
    attendable_type: string;
    entry_timestamp: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    attendable?: Member | Trainer;

    staff?: User;

    [key: string]: string | number | undefined | null;
}
