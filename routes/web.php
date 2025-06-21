<?php

use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/member-register', [ClientController::class, 'register'])->name('client.register');
Route::post('/member-register', [ClientController::class, 'registerStore'])->name('client.register-store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/check-in', function () {
        return Inertia::render('client/check-in');
    })->name('client.check-in');
    Route::get('/check-data', function () {
        return Inertia::render('client/check-data');
    })->name('client.check-data');
    Route::get('/check-in/{rfid_uid}', [ClientController::class, 'storeCheckIn'])->name('client.store-check-in');
    Route::get('/check-data/{rfid_uid}', [ClientController::class, 'showCheckData'])->name('client.show-check-data');
    Route::post('/training/start', [ClientController::class, 'startTraining'])->name('training.start');
});

require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
