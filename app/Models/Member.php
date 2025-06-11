<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use SoftDeletes;

    protected $table = 'members';

    protected $fillable = [
        'staff_id',
        'full_name',
        'email',
        'phone',
        'registration_date',
        'is_member',
        'rfid_uid',
    ];

    public function history()
    {
        return $this->hasMany(AttendanceHistory::class);
    }

    public function points()
    {
        return $this->hasOne(Point::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
