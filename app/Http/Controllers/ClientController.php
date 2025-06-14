<?php
namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function checkIn()
    {
        return Inertia::render('client/CheckIn');
    }

    public function checkData()
    {
        return Inertia::render('client/CheckData');
    }

    public function showCheckIn($rfid_uid)
    {
        try {
            if (empty($rfid_uid) || strlen($rfid_uid) < 4) {
                return Inertia::render('client/CheckIn', [
                    'error' => 'Invalid RFID UID format. Please scan a valid card.',
                ]);
            }

            $cleanRfidUid = trim($rfid_uid);

            $staff = Auth::user()->id;

            $member = Member::with('points')->where('rfid_uid', $cleanRfidUid)->first();

            if (! $member) {
                return Inertia::render('client/CheckIn', [
                    'error' => "RFID card '{$cleanRfidUid}' is not registered. Please contact gym staff for registration.",
                ]);
            }

            $alreadyCheckedInToday = $member->history()->whereDate('entry_timestamp', date('Y-m-d'))->exists();

            if ($alreadyCheckedInToday) {
                return Inertia::render('client/CheckIn', [
                    'error' => "RFID card '{$cleanRfidUid}' has already checked in today.",
                ]);
            }

            $currentPoints = $member->points()->first()->balance ?? 0;

            if ($currentPoints <= 0) {
                return Inertia::render('client/CheckIn', [
                    'error' => "RFID card '{$cleanRfidUid}' has no available points. Please contact gym staff for more information.",
                ]);
            }

            $member->points()->update([
                'balance' => $currentPoints - 1,
            ]);

            $member->history()->create([
                'staff_id'        => $staff,
                'entry_timestamp' => now(),
                'points_deducted' => 1,
            ]);

            $member->refresh();
            $member->load('points');

            return Inertia::render('client/CheckIn', [
                'member'  => $member,
                'success' => 'Member checked in successfully',
            ]);

        } catch (\Throwable $th) {
            Log::error('Error fetching member data: ' . $th->getMessage(), [
                'rfid_uid'    => $rfid_uid,
                'stack_trace' => $th->getTraceAsString(),
            ]);

            return Inertia::render('client/CheckIn', [
                'error' => 'System error occurred while check in. Please try again or contact support.',
            ]);
        }
    }

    public function showCheckData($rfid_uid)
    {

        try {
            if (empty($rfid_uid) || strlen($rfid_uid) < 4) {
                return Inertia::render('client/CheckData', [
                    'error' => 'Invalid RFID UID format. Please scan a valid card.',
                ]);
            }

            $cleanRfidUid = trim($rfid_uid);

            $member = Member::with('points')->where('rfid_uid', $cleanRfidUid)->first();

            if (! $member) {
                return Inertia::render('client/CheckData', [
                    'error' => "RFID card '{$cleanRfidUid}' is not registered. Please contact gym staff for registration.",
                ]);
            }

            return Inertia::render('client/CheckData', [
                'member'  => $member,
                'success' => 'Member data loaded successfully',
            ]);

        } catch (\Exception $th) {
            Log::error('Error fetching member data: ' . $th->getMessage(), [
                'rfid_uid'    => $rfid_uid,
                'stack_trace' => $th->getTraceAsString(),
            ]);

            return Inertia::render('client/CheckData', [
                'error' => 'System error occurred while checking member data. Please try again or contact support.',
            ]);
        }
    }
}
