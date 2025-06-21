import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import { DateRangePicker } from './date-picker-range';

export interface FilterState {
    type: string;
    status: string;
    startDate: string;
    endDate: string;
}

interface FilterDropdownProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export function FilterDropdown({ filters, onFilterChange, onApplyFilters, onClearFilters }: FilterDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={'sm'}>
                    <SlidersHorizontal />
                    <span className="hidden sm:block">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-96">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Date range</DropdownMenuLabel>
                    <DateRangePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onStartDateChange={(date) => onFilterChange('startDate', date)}
                        onEndDateChange={(date) => onFilterChange('endDate', date)}
                    />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Member type</DropdownMenuLabel>
                    <div className="flex flex-col gap-1 px-2 py-1.5">
                        <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select member type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All member type</SelectItem>
                                <SelectItem value="member">Active Member</SelectItem>
                                <SelectItem value="non-member">Non-Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <div className="flex flex-col gap-1 px-2 py-1.5">
                        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <Button variant="destructive" size={'sm'} onClick={onClearFilters}>
                            Reset all
                        </Button>
                        <Button onClick={onApplyFilters} size={'sm'}>
                            Apply now
                        </Button>
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
