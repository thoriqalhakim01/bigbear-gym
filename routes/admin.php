<?php

use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/Dashboard');
        })->name('dashboard');

        Route::prefix('members')->group(function () {
            Route::get('/', [MemberController::class, 'index'])->name('members.index');
            Route::get('/create', [MemberController::class, 'create'])->name('members.create');
            Route::post('/create', [MemberController::class, 'store'])->name('members.store');
            Route::get('/export-excel', [MemberController::class, 'exportExcel'])->name('members.export-excel');
            Route::get('/export-pdf', [MemberController::class, 'exportPdf'])->name('members.export-pdf');
            Route::get('/{id}', [MemberController::class, 'show'])->name('members.show');
            Route::get('/{id}/edit', [MemberController::class, 'edit'])->name('members.edit');
            Route::put('/{id}/edit', [MemberController::class, 'update'])->name('members.update');
            Route::delete('/{id}', [MemberController::class, 'destroy'])->name('members.destroy');
        });

        Route::prefix('packages')->group(function () {
            Route::get('/', [PackageController::class, 'index'])->name('packages.index');
            Route::post('/', [PackageController::class, 'store'])->name('packages.store');
            Route::put('/{id}', [PackageController::class, 'update'])->name('packages.update');
            Route::delete('/{id}', [PackageController::class, 'destroy'])->name('packages.destroy');
        });

        Route::prefix('transactions')->group(function () {
            Route::get('/', [TransactionController::class, 'index'])->name('transactions.index');
            Route::get('/create', [TransactionController::class, 'create'])->name('transactions.create');
            Route::post('/create', [TransactionController::class, 'store'])->name('transactions.store');
            Route::get('/{id}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
            Route::put('/{id}/edit', [TransactionController::class, 'update'])->name('transactions.update');
            Route::delete('/{id}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
        });
    });
});
