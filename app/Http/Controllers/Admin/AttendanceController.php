<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $query = Attendance::query()->with(['attendable'])->orderBy('entry_timestamp', 'asc');

        $search = request('search');

        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->whereHas('attendable', function ($query) use ($search) {
                    $query->where('full_name', 'like', '%' . $search . '%');
                });
            });
        }

        $attendances = $query->paginate(20)->withQueryString();

        $transformedAttendances = $attendances->getCollection()->map(function ($attendance) {
            return [
                'id'              => $attendance->id,
                'attendable'      => $attendance->attendable,
                'attendable_id'   => $attendance->attendable_id,
                'attendable_type' => $attendance->attendable_type,
                'entry_timestamp' => $attendance->entry_timestamp,
                'date'            => $attendance->entry_timestamp ? $attendance->entry_timestamp->format('d-m-Y') : null,
                'time'            => $attendance->entry_timestamp ? $attendance->entry_timestamp->format('H:i:s') : null,
            ];
        });

        $attendances->setCollection($transformedAttendances);

        return Inertia::render('admin/attendances/index', [
            'attendances' => $attendances,
            'filters'     => [
                'search' => request('search', ''),
            ],
            'flash'       => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $members = Member::select('id', 'full_name')->get();

        return Inertia::render('admin/attendances/create', [
            'members' => $members,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id'       => 'required|string|exists:members,id',
            'entry_timestamp' => 'required|date_format:Y-m-d H:i:s',
        ]);

        $staffId = Auth::user()->id;

        Attendance::create([
            'staff_id'        => $staffId,
            'attendable_id'   => $validated['member_id'],
            'attendable_type' => 'App\Models\Member',
            'entry_timestamp' => $validated['entry_timestamp'],
        ]);

        return redirect()->route('attendances.index')->with('success', 'Attendance created successfully.');
    }
}
