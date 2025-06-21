<?php
namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function register()
    {
        $trainers = Trainer::select('id', 'full_name')->get();

        return Inertia::render('client/register/index', [
            'trainers' => $trainers,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function registerStore(Request $request)
    {
        $validated = $request->validate([
            'full_name'    => 'required|string|max:255',
            'email'        => 'required|string|email|max:255|unique:members,email',
            'phone_number' => 'required|string|min:10|max:15',
            'trainer_id'   => 'nullable|exists:trainers,id',
        ]);

        try {
            Member::create([
                'full_name'    => $validated['full_name'],
                'email'        => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'trainer_id'   => $validated['trainer_id'] ?? null,
                'status'       => 'inactive',
            ]);

            return redirect()->route('client.register')->with('success', 'Registration successful! Please contact our staff to verify your account and complete the registration process.');

        } catch (\Exception $e) {
            Log::error('Member registration failed: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', 'Registration failed. Please try again or contact support if the problem persists.');
        }
    }

    public function storeCheckIn($rfid_uid)
    {
        try {
            if (empty($rfid_uid)) {
                return $this->renderCheckInError('Invalid RFID UID format. Please scan a valid card.');
            }

            $cleanRfidUid = trim($rfid_uid);
            $staffId      = Auth::id();

            $member  = Member::with(['points'])->where('rfid_uid', $cleanRfidUid)->first();
            $trainer = Trainer::where('rfid_uid', $cleanRfidUid)->first();

            if ($member) {
                return $this->handleMemberCheckIn($member, $staffId, $cleanRfidUid);
            }

            if ($trainer) {
                return $this->handleTrainerCheckIn($trainer, $staffId, $cleanRfidUid);
            }

            return $this->renderCheckInError("Member card '{$cleanRfidUid}' is not registered.");
        } catch (\Throwable $th) {
            Log::error('Check-in error: ' . $th->getMessage(), [
                'rfid_uid' => $rfid_uid,
                'trace'    => $th->getTraceAsString(),
            ]);

            return $this->renderCheckInError('System error occurred. Please try again or contact support.');
        }
    }

    protected function handleMemberCheckIn(Member $member, string $staffId, string $rfidUid)
    {
        if ($member->attendances()->whereDate('entry_timestamp', today())->exists()) {
            return $this->renderCheckInError("Member '{$rfidUid}' has already checked in today.");
        }

        if (($member->points->balance ?? 0) <= 0) {
            return $this->renderCheckInError("Member '{$rfidUid}' has no available points.");
        }

        if ($member->points->expires_at < now()) {
            return $this->renderCheckInError("Member '{$rfidUid}' has expired points.");
        }

        DB::transaction(function () use ($member, $staffId) {
            $member->points()->decrement('balance');
            $member->attendances()->create([
                'staff_id'        => $staffId,
                'entry_timestamp' => now()->timezone('Asia/Jakarta'),
            ]);
        });

        return Inertia::render('client/check-in', [
            'member'   => $member->fresh(['points']),
            'userType' => 'member',
            'success'  => 'Member checked in successfully',
        ]);
    }

    protected function handleTrainerCheckIn(Trainer $trainer, string $staffId, string $rfidUid)
    {
        if ($trainer->attendances()->whereDate('entry_timestamp', today())->exists()) {
            return $this->renderCheckInError("Trainer '{$rfidUid}' has already checked in today.");
        }

        DB::transaction(function () use ($trainer, $staffId) {
            $trainer->attendances()->create([
                'staff_id'        => $staffId,
                'entry_timestamp' => now()->timezone('Asia/Jakarta'),
            ]);
        });

        return Inertia::render('client/check-in', [
            'trainer'  => $trainer,
            'userType' => 'trainer',
            'success'  => 'Trainer checked in successfully',
        ]);
    }

    protected function renderCheckInError(string $error)
    {
        return Inertia::render('client/check-in', [
            'error' => $error,
        ]);
    }

    public function showCheckData($rfid_uid)
    {
        try {
            if (empty($rfid_uid) || strlen($rfid_uid) < 4) {
                return Inertia::render('client/check-data', [
                    'error' => 'Invalid RFID UID format. Please scan a valid card.',
                ]);
            }

            $cleanRfidUid = trim($rfid_uid);

            $member = Member::with('points')->where('rfid_uid', $cleanRfidUid)->first();

            if (! $member) {
                return Inertia::render('client/check-data', [
                    'error' => "Member card '{$cleanRfidUid}' is not registered. Please contact gym staff for registration.",
                ]);
            }

            return Inertia::render('client/check-data', [
                'member'  => $member,
                'success' => 'Member data loaded successfully',
            ]);

        } catch (\Exception $th) {
            Log::error('Error fetching member data: ' . $th->getMessage(), [
                'rfid_uid'    => $rfid_uid,
                'stack_trace' => $th->getTraceAsString(),
            ]);

            return Inertia::render('client/check-data', [
                'error' => 'System error occurred while checking member data. Please try again or contact support.',
            ]);
        }
    }
}
