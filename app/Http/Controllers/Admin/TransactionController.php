<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTransactionRequest;
use App\Http\Requests\Admin\UpdateTransactionRequest;
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
        $query = Transaction::query()->with(['member', 'package']);

        $search = request('search');

        if ($search) {
            $query->whereHas('member', (function ($q) use ($search) {
                $q->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($search) . '%'])
                ;
            }));
        }

        $transactions = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/transactions/index', [
            'transactions' => $transactions,
            'flash'        => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $members = Member::select('id', 'full_name', 'is_member')->get();
        $options = Package::all();

        return Inertia::render('admin/transactions/create', [
            'members' => $members,
            'options' => $options,
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
                'member_id'        => $validated['member_id'],
                'package_id'       => $validated['package_id'],
                'transaction_date' => $validated['transaction_date'],
                'amount'           => $validated['amount'],
                'payment_method'   => $validated['payment_method'],
                'notes'            => $validated['notes'],
            ]);

            if ($member->is_member && $member->points) {
                $currentPoint = $member->points->balance ?? 0;
                $pointAdded   = $package->points ?? 0;

                $member->points()->update([
                    'balance'    => $currentPoint + $pointAdded,
                    'expires_at' => now()->addDays($package->duration),
                ]);
            } elseif ($member->is_member && ! $member->points) {
                $member->points()->create([
                    'balance'    => $package->points ?? 0,
                    'expires_at' => now()->addDays($package->duration),
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

    public function edit(string $id)
    {
        $transaction = Transaction::with(['member', 'package'])->findOrFail($id);
        $members     = Member::select('id', 'full_name', 'is_member')->get();
        $options     = Package::all();

        return Inertia::render('admin/transactions/edit', [
            'transaction' => $transaction,
            'members'     => $members,
            'options'     => $options,
        ]);
    }

    public function update(UpdateTransactionRequest $request, string $id)
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
                'member_id'        => $validated['member_id'],
                'package_id'       => $validated['package_id'],
                'transaction_date' => $validated['transaction_date'],
                'amount'           => $validated['amount'],
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

    public function destroy(string $id)
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
