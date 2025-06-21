<?php
namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueRfidAcrossTables implements ValidationRule
{
    protected $currentTable;
    protected $currentId;

    public function __construct($currentTable = null, $currentId = null)
    {
        $this->currentTable = $currentTable;
        $this->currentId    = $currentId;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            return;
        }

        $memberExists = DB::table('members')
            ->where('rfid_uid', $value)
            ->when($this->currentTable === 'members' && $this->currentId, function ($query) {
                return $query->where('id', '!=', $this->currentId);
            })
            ->exists();

        $trainerExists = DB::table('trainers')
            ->where('rfid_uid', $value)
            ->when($this->currentTable === 'trainers' && $this->currentId, function ($query) {
                return $query->where('id', '!=', $this->currentId);
            })
            ->exists();

        if ($memberExists || $trainerExists) {
            $fail('The RFID card is already assigned to another member or trainer.');
        }
    }
}
