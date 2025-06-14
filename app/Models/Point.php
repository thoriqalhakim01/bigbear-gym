<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Point extends Model
{
    use SoftDeletes;

    protected $table = 'points';

    protected $fillable = [
        'member_id',
        'balance',
        'expiration_date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
