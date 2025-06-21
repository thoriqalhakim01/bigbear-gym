<?php
namespace App\Models;

use App\PaymentMethod;
use DateTime;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use IntlDateFormatter;

class Transaction extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $fillable = [
        'staff_id',
        'member_id',
        'package_id',
        'transaction_date',
        'amount',
        'payment_method',
        'status',
        'notes',
    ];

    protected $casts = [
        'payment_method'   => PaymentMethod::class,
        'transaction_date' => 'date',
        'created_at'       => 'datetime',
        'updated_at'       => 'datetime',
        'deleted_at'       => 'datetime',
    ];

    protected function transactionDate(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (! $value) {
                    return null;
                }

                $formatter = new IntlDateFormatter(
                    'en_US',
                    IntlDateFormatter::FULL,
                    IntlDateFormatter::NONE,
                    null,
                    null,
                    'EEEE, d MMMM yyyy'
                );

                return $formatter->format(new DateTime($value));
            }
        );
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
