<?php
namespace App\Http\Controllers\Admin;

use App\Exports\MembersExcelExport;
use App\Exports\MembersPdfExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MemberController extends Controller
{
    public function index()
    {
        $query = Member::with('points')->orderBy('created_at', 'desc');

        $search    = request('search');
        $status    = request('status');
        $startDate = request('start_date');
        $endDate   = request('end_date');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%'])
                ;
            });
        }

        if ($status && $status !== 'all') {
            $isMember = ($status === 'member');
            $query->where('is_member', $isMember);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('registration_date', [$startDate, $endDate]);
        }

        $members = $query->paginate(12)->withQueryString();

        return Inertia::render('admin/members/Index', [
            'members' => $members,
            'filters' => [
                'search'     => request('search', ''),
                'status'     => request('status', 'all'),
                'start_date' => request('start_date', null),
                'end_date'   => request('end_date', null),
            ],
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function exportExcel()
    {
        $filters = [
            'search'     => request('search', ''),
            'status'     => request('status', 'all'),
            'start_date' => request('start_date', null),
            'end_date'   => request('end_date', null),
        ];

        return Excel::download(new MembersExcelExport($filters), 'members_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportPdf()
    {
        $filters = [
            'search'     => request('search', ''),
            'status'     => request('status', 'all'),
            'start_date' => request('start_date', null),
            'end_date'   => request('end_date', null),
        ];

        $members = (new MembersPdfExport($filters))->query()->get();

        $pdf = Pdf::loadView('exports.members-pdf', [
            'members' => $members,
            'filters' => $filters,
        ]);

        return $pdf->download('members_' . now()->format('Ymd_His') . '.pdf');

    }

    public function create()
    {
        return Inertia::render('admin/members/Create');
    }

    public function store(StoreMemberRequest $request)
    {
        $validated = $request->validated();

        $isMember = isset($validated['is_member']) && $validated['is_member'] === '1';

        DB::beginTransaction();

        try {
            $member = Member::create([
                'staff_id'          => $validated['staff_id'],
                'full_name'         => $validated['full_name'],
                'email'             => $validated['email'],
                'phone'             => $validated['phone'],
                'registration_date' => $validated['registration_date'],
                'is_member'         => $isMember,
                'rfid_uid'          => $isMember ? $validated['rfid_uid'] : null,
            ]);

            if ($isMember) {
                $member->points()->create([
                    'balance'         => 0,
                    'expiration_date' => now(),
                ]);
            }

            DB::commit();

            return redirect()->route('members.index')->with('success', 'Member created successfully');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Member creation failed: ' . $th->getMessage(), [
                'request_data' => $validated,
                'trace'        => $th->getTraceAsString(),
            ]);

            return back()
                ->withErrors(['error' => 'Failed to create member. Please try again.'])
                ->withInput();
        }
    }

    public function show($id)
    {
        $member = Member::with(['points', 'transactions', 'history'])->findOrFail($id);

        $histories = $member->history()->paginate(12)->withQueryString();

        return Inertia::render('admin/members/Show', [
            'member'    => $member,
            'histories' => $histories,
            'flash'     => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function edit($id)
    {
        $member = Member::findOrFail($id);

        return Inertia::render('admin/members/Edit', [
            'member' => $member,
        ]);
    }

    public function update(UpdateMemberRequest $request, $id)
    {
        $validated = $request->validated();

        $member = Member::findOrFail($id);

        $isMember = isset($validated['is_member']) && $validated['is_member'] === '1';

        DB::beginTransaction();

        try {
            $member->update([
                'staff_id'          => $validated['staff_id'],
                'full_name'         => $validated['full_name'],
                'email'             => $validated['email'],
                'phone'             => $validated['phone'],
                'registration_date' => $validated['registration_date'],
                'is_member'         => $isMember,
                'rfid_uid'          => $isMember ? $validated['rfid_uid'] : null,
            ]);

            if ($isMember && ! $member->points) {
                $member->points()->create([
                    'balance' => 0,
                ]);
            }

            if (! $isMember && $member->points) {
                $member->points()->delete();
            }

            DB::commit();

            return redirect()->route('members.show', $member->id)->with('success', 'Member updated successfully');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Member update failed: ' . $th->getMessage(), [
                'request_data' => $validated,
                'trace'        => $th->getTraceAsString(),
            ]);

            return back()
                ->withErrors(['error' => 'Failed to update member. Please try again.'])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $member = Member::findOrFail($id);

        $member->delete();

        return redirect()->route('members.index')->with('success', 'Member deleted successfully');
    }
}
