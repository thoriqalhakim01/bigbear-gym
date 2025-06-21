<?php
namespace App\Http\Requests\Admin;

use App\Rules\UniqueRfidAcrossTables;
use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name'         => 'required|string',
            'email'             => 'required|email|unique:members,email',
            'phone_number'      => 'required|numeric|min:3',
            'registration_date' => 'required|date',
            'trainer_id'        => 'required|exists:trainers,id',
            'is_member'         => 'required|boolean',
            'rfid_uid'          => [
                'required_if:is_member,true',
                'nullable',
                new UniqueRfidAcrossTables('members'),
            ],
        ];
    }
}
