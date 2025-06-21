<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'trainer_id',
        'full_name',
        'image',
        'email',
        'phone_number',
        'registration_date',
        'status',
        'is_member',
        'rfid_uid',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'is_member'         => 'boolean',
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
        'deleted_at'        => 'datetime',
    ];

    public function registrationDate(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? date('d M Y', strtotime($value)) : null
        );
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function points(): HasOne
    {
        return $this->hasOne(Point::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function attendances()
    {
        return $this->morphMany(Attendance::class, 'attendable');
    }
}
