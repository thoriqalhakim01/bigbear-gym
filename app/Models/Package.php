<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes;

    protected $table = 'packages';

    protected $fillable = [
        'staff_id',
        'name',
        'points',
        'price',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
