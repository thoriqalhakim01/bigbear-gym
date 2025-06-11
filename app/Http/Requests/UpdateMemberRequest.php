<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'staff_id'          => 'required|integer|exists:users,id',
            'full_name'         => 'required|string|max:255',
            'email'             => 'required|email|unique:members,email',
            'phone'             => 'required|string|max:20',
            'registration_date' => 'required|date',
            'is_member'         => 'required|in:0,1',
            'rfid_uid'          => 'required_if:is_member,1|nullable|string|unique:members,rfid_uid',
        ];
    }
}
