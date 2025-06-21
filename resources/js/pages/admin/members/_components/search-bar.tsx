import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FormEvent } from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ searchTerm, onSearchChange, onSearchSubmit, placeholder = 'Search...', className = 'w-full lg:w-1/3' }: SearchBarProps) {
    return (
        <form onSubmit={onSearchSubmit} className="relative max-h-8 w-full">
            <Input
                type="search"
                className={`h-8 ps-8 ${className}`}
                placeholder={placeholder}
                value={searchTerm || ''}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute top-0 left-0 flex h-8 items-center justify-start px-2">
                <Search size={16} />
            </div>
        </form>
    );
}
