<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Member;
use App\Models\Package;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $query = Transaction::with(['member', 'package']);

        $search    = request('search');
        $startDate = request('start_date');
        $endDate   = request('end_date');

        if ($search) {
            $query->whereHas('member', function ($q) use ($search) {
                $q->where('full_name', 'like', '%' . $search . '%');
            });
        }

        if ($startDate) {
            $query->whereDate('transaction_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('transaction_date', '<=', $endDate);
        }

        $transactions = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/transactions/Index', [
            'transactions' => $transactions,
            'filters'      => [
                'search'     => request('search', ''),
                'start_date' => request('start_date', null),
                'end_date'   => request('end_date', null),
            ],
            'flash'        => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $members  = Member::select('id', 'full_name', 'is_member')->get();
        $packages = Package::select('id', 'name')->get();

        return Inertia::render('admin/transactions/Create', [
            'members'  => $members,
            'packages' => $packages,
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $member  = Member::with('points')->findOrFail($validated['member_id']);
            $package = Package::findOrFail($validated['package_id']);

            Transaction::create([
                'staff_id'         => $validated['staff_id'],
                'member_id'        => $validated['member_id'],
                'package_id'       => $validated['package_id'],
                'transaction_date' => $validated['transaction_date'],
                'payment_method'   => $validated['payment_method'],
                'notes'            => $validated['notes'],
            ]);

            if ($member->is_member && $member->points) {
                $currentPoint = $member->points->balance ?? 0;
                $pointAdded   = $package->points ?? 0;

                $member->points()->update([
                    'balance' => $currentPoint + $pointAdded,
                ]);
            } elseif ($member->is_member && ! $member->points) {
                $member->points()->create([
                    'balance' => $package->points ?? 0,
                ]);
            }

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaction created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Transaction creation failed: ' . $th->getMessage(), [
                'request_data' => $validated,
                'trace'        => $th->getTraceAsString(),
            ]);

            return back()
                ->withErrors(['error' => 'Failed to create transaction. Please try again.'])
                ->withInput();
        }
    }

    public function edit($id)
    {
        $members     = Member::select('id', 'full_name', 'is_member')->get();
        $packages    = Package::select('id', 'name')->get();
        $transaction = Transaction::findOrFail($id);

        return Inertia::render('admin/transactions/Edit', [
            'members'     => $members,
            'packages'    => $packages,
            'transaction' => $transaction,
        ]);
    }

    public function update(UpdateTransactionRequest $request, $id)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $transaction  = Transaction::findOrFail($id);
            $oldMemberId  = $transaction->member_id;
            $oldPackageId = $transaction->package_id;

            $oldMember  = Member::with('points')->findOrFail($oldMemberId);
            $oldPackage = Package::findOrFail($oldPackageId);

            $newMember  = Member::with('points')->findOrFail($validated['member_id']);
            $newPackage = Package::findOrFail($validated['package_id']);

            $transaction->update([
                'staff_id'         => $validated['staff_id'],
                'member_id'        => $validated['member_id'],
                'package_id'       => $validated['package_id'],
                'transaction_date' => $validated['transaction_date'],
                'payment_method'   => $validated['payment_method'],
                'notes'            => $validated['notes'] ?? null,
            ]);

            if ($oldMemberId == $validated['member_id']) {
                if ($oldPackageId != $validated['package_id'] && $newMember->is_member) {
                    $oldPoints       = $oldPackage->points ?? 0;
                    $newPoints       = $newPackage->points ?? 0;
                    $pointDifference = $newPoints - $oldPoints;

                    if ($newMember->points) {
                        $currentBalance = $newMember->points->balance ?? 0;
                        $newBalance     = max(0, $currentBalance + $pointDifference);

                        $newMember->points()->update([
                            'balance' => $newBalance,
                        ]);
                    } elseif ($pointDifference > 0) {
                        $newMember->points()->create([
                            'balance' => $pointDifference,
                        ]);
                    }
                }
            } else {
                if ($oldMember->is_member && $oldMember->points) {
                    $currentPoint  = $oldMember->points->balance ?? 0;
                    $pointToDeduct = $oldPackage->points ?? 0;

                    $oldMember->points()->update([
                        'balance' => max(0, $currentPoint - $pointToDeduct),
                    ]);
                }

                if ($newMember->is_member) {
                    $pointToAdd = $newPackage->points ?? 0;

                    if ($newMember->points) {
                        $currentPoint = $newMember->points->balance ?? 0;
                        $newMember->points()->update([
                            'balance' => $currentPoint + $pointToAdd,
                        ]);
                    } else {
                        $newMember->points()->create([
                            'balance' => $pointToAdd,
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Transaction update failed: ' . $th->getMessage(), [
                'request_data' => $validated,
                'trace'        => $th->getTraceAsString(),
            ]);

            return back()
                ->withErrors(['error' => 'Failed to update transaction. Please try again.'])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $transaction = Transaction::with(['member.points', 'package'])->findOrFail($id);

            if ($transaction->member->is_member && $transaction->member->points) {
                $currentPoint  = $transaction->member->points->balance ?? 0;
                $pointToDeduct = $transaction->package->points ?? 0;

                $transaction->member->points()->update([
                    'balance' => max(0, $currentPoint - $pointToDeduct),
                ]);
            }

            $transaction->delete();

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            Log::error('Transaction deletion failed: ' . $th->getMessage(), [
                'trace' => $th->getTraceAsString(),
            ]);

            return back()->with('error', 'Failed to delete transaction. Please try again.');
        }
    }
}
