<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendanceHistory extends Model
{
    use SoftDeletes;

    protected $table = 'attendance_histories';

    protected $fillable = [
        'member_id',
        'entry_timestamp',
        'points_deducted',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
