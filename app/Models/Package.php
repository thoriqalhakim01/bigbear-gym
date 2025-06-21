<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'name',
        'price',
        'points',
        'duration',
    ];

    protected $casts = [
        'price'      => 'integer',
        'duration'   => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function getDurationInMonthsAttribute(): float
    {
        return round($this->duration / 30, 1);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
