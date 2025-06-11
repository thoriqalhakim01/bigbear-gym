<?php
namespace App\Exports;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MembersExcelExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Member::with('points')->orderBy('created_at', 'desc');

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        if (! empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $isMember = ($this->filters['status'] === 'member');
            $query->where('is_member', $isMember);
        }

        if (! empty($this->filters['start_date']) && ! empty($this->filters['end_date'])) {
            $query->whereBetween('registration_date', [
                $this->filters['start_date'],
                $this->filters['end_date'],
            ]);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Full Name',
            'Email',
            'Phone',
            'Registration Date',
            'Status',
            'RFID UID',
        ];
    }

    public function map($member): array
    {
        return [
            $member->id,
            $member->full_name,
            $member->email,
            $member->phone,
            $member->registration_date,
            $member->is_member ? 'Active Member' : 'Non-Member',
            $member->rfid_uid ?? 'N/A',
        ];
    }
}
