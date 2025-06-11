<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
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
            'staff_id'         => 'required|integer|exists:users,id',
            'member_id'        => 'required|integer|exists:members,id',
            'package_id'       => 'required|integer|exists:packages,id',
            'transaction_date' => 'required|date',
            'payment_method'   => 'required|string|max:255',
            'notes'            => 'nullable|string|max:255',
        ];
    }
}
