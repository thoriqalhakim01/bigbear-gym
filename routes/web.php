<?php

use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/check-in', [ClientController::class, 'checkIn'])->name('client.check-in');
    Route::get('/check-data', [ClientController::class, 'checkData'])->name('client.check-data');
    Route::get('/check-in/{rfid_uid}', [ClientController::class, 'showCheckIn'])->name('client.show-check-in');
    Route::get('/check-data/{rfid_uid}', [ClientController::class, 'showCheckData'])->name('client.show-check-data');
});

require __DIR__ . '/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
