<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUlids;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function createdMembers()
    {
        return $this->hasMany(Member::class, 'staff_id');
    }

    public function createdTrainers()
    {
        return $this->hasMany(Trainer::class, 'staff_id');
    }

    public function processedTransactions()
    {
        return $this->hasMany(Transaction::class, 'staff_id');
    }

    public function recordedAttendances()
    {
        return $this->hasMany(Attendance::class, 'staff_id');
    }
}
