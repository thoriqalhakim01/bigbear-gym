<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'attendable_id',
        'attendable_type',
        'entry_timestamp',
    ];

    protected $casts = [
        'entry_timestamp' => 'datetime',
        'created_at'      => 'datetime',
        'updated_at'      => 'datetime',
        'deleted_at'      => 'datetime',
    ];

    public function attendable(): MorphTo
    {
        return $this->morphTo();
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
