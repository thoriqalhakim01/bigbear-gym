<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMemberRequest extends FormRequest
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
        $memberId = $this->route('id');

        return [
            'full_name'         => 'required|string',
            'email'             => [
                'required',
                'email',
                Rule::unique('members', 'email')->ignore($memberId),
            ],
            'phone_number'      => 'required|numeric|min:3',
            'registration_date' => 'required|date',
            'trainer_id'        => 'nullable|exists:trainers,id',
            'is_member'         => 'required|boolean',
            'rfid_uid'          => [
                'required_if:is_member,true',
                Rule::unique('members', 'rfid_uid')->ignore($memberId),
            ],
        ];
    }
}
