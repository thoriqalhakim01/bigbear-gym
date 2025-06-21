<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMemberRequest;
use App\Http\Requests\Admin\UpdateMemberRequest;
use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        $query = Member::query()->with(['points', 'trainer']);

        $search    = request('search');
        $type      = request('type');
        $status    = request('status');
        $startDate = request('start_date');
        $endDate   = request('end_date');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(rfid_uid) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereHas('trainer', function ($q) use ($search) {
                        $q->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($search) . '%']);
                    })
                ;
            });
        }

        if ($type && $type !== 'all') {
            $isMember = ($type === 'member');
            $query->where('is_member', $isMember);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('registration_date', [$startDate, $endDate]);
        }

        $members = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'filters' => [
                'search'     => request('search', ''),
                'status'     => request('status', 'all'),
                'type'       => request('type', 'all'),
                'start_date' => request('start_date', null),
                'end_date'   => request('end_date', null),
            ],
        ]);
    }

    public function create()
    {
        $trainers = Trainer::select('id', 'full_name')->get();

        return Inertia::render('admin/members/create', [
            'trainers' => $trainers,
        ]);
    }

    public function store(StoreMemberRequest $request)
    {

        $validated = $request->validated();

        $isMember = isset($validated['is_member']) && $validated['is_member'] === '1';

        DB::beginTransaction();

        try {
            $member = Member::create([
                'trainer_id'        => $validated['trainer_id'],
                'full_name'         => $validated['full_name'],
                'email'             => $validated['email'],
                'phone_number'      => $validated['phone_number'],
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

    public function show(string $id)
    {
        $member = Member::with(['attendances' => function ($query) {
            $query->orderBy('entry_timestamp', 'desc');
        }, 'trainer', 'points'])->findOrFail($id);

        $formattedAttendances = $member->attendances->map(function ($attendance) {
            return [
                'id'         => $attendance->id,
                'entry_date' => $attendance->entry_timestamp ? $attendance->entry_timestamp->format('d-m-Y') : null,
                'entry_time' => $attendance->entry_timestamp ? $attendance->entry_timestamp->format('H:i:s') : null,
            ];
        });

        return Inertia::render('admin/members/show', [
            'member' => [
                 ...$member->toArray(),
                'attendances' => $formattedAttendances,
            ],
            'flash'  => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function edit(string $id)
    {
        $member = Member::FindOrFail($id);

        $trainers = Trainer::select('id', 'full_name')->get();

        return Inertia::render('admin/members/edit', [
            'member'   => $member,
            'trainers' => $trainers,
        ]);
    }

    public function update(UpdateMemberRequest $request, string $id)
    {
        $validated = $request->validated();

        $member = Member::findOrFail($id);

        $isMember = isset($validated['is_member']) && $validated['is_member'] === '1';

        DB::beginTransaction();

        try {
            $member->update([
                'full_name'         => $validated['full_name'],
                'email'             => $validated['email'],
                'phone_number'      => $validated['phone_number'],
                'registration_date' => $validated['registration_date'],
                'is_member'         => $isMember,
                'rfid_uid'          => $isMember ? $validated['rfid_uid'] : null,
                'status'            => 'active',
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

    public function destroy(string $id)
    {
        $member = Member::FindOrFail($id);

        $member->delete();

        return redirect()->route('members.index')->with('success', 'Member deleted successfully');
    }
}
