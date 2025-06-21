<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ReportAnalyticController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\TrainerController;
use App\Http\Controllers\Admin\TransactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::prefix('trainers')->group(function () {
            Route::get('/', [TrainerController::class, 'index'])->name('trainers.index');
            Route::get('/create', [TrainerController::class, 'create'])->name('trainers.create');
            Route::post('/create', [TrainerController::class, 'store'])->name('trainers.store');
            Route::get('/{id}', [TrainerController::class, 'show'])->name('trainers.show');
            Route::get('/{id}/edit', [TrainerController::class, 'edit'])->name('trainers.edit');
            Route::put('/{id}/edit', [TrainerController::class, 'update'])->name('trainers.update');
            Route::delete('/{id}', [TrainerController::class, 'destroy'])->name('trainers.destroy');
        });

        Route::prefix('members')->group(function () {
            Route::get('/', [MemberController::class, 'index'])->name('members.index');
            Route::get('/create', [MemberController::class, 'create'])->name('members.create');
            Route::post('/create', [MemberController::class, 'store'])->name('members.store');
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

        Route::prefix('/attendances')->group(function () {
            Route::get('/', [AttendanceController::class, 'index'])->name('attendances.index');
            Route::get('/create', [AttendanceController::class, 'create'])->name('attendances.create');
            Route::post('/create', [AttendanceController::class, 'store'])->name('attendances.store');
        });

        Route::prefix('/report-analytics')->group(function () {
            Route::get('/', [ReportAnalyticController::class, 'index'])->name('report-analytics.index');
        });

        Route::prefix('/staffs')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('staffs.index');
        });
    });
});
