import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange }: DateRangePickerProps) {
    return (
        <div className="flex items-center justify-between gap-1 px-2 py-1.5">
            <div className="grid w-full gap-1">
                <Label className="text-xs text-muted-foreground">From:</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !startDate && 'text-muted-foreground')}
                            type="button"
                        >
                            {startDate ? format(new Date(startDate), 'PPP') : <span>Pick start date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-50 w-auto overflow-visible p-0" align="start" side="bottom" sideOffset={4}>
                        <Calendar
                            mode="single"
                            selected={startDate ? new Date(startDate) : undefined}
                            onSelect={(date) => {
                                if (date) {
                                    onStartDateChange(format(date, 'yyyy-MM-dd'));
                                } else {
                                    onStartDateChange('');
                                }
                            }}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                            className="pointer-events-auto"
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid w-full gap-1">
                <Label className="text-xs text-muted-foreground">To:</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !endDate && 'text-muted-foreground')}
                            type="button"
                        >
                            {endDate ? format(new Date(endDate), 'PPP') : <span>Pick end date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-50 w-auto overflow-visible p-0" align="start" sideOffset={4}>
                        <Calendar
                            mode="single"
                            selected={endDate ? new Date(endDate) : undefined}
                            onSelect={(date) => {
                                if (date) {
                                    onEndDateChange(format(date, 'yyyy-MM-dd'));
                                } else {
                                    onEndDateChange('');
                                }
                            }}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                            className="pointer-events-auto"
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
