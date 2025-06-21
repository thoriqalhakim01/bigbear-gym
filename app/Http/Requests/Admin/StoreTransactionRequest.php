<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'member_id'        => 'required|string|exists:members,id',
            'package_id'       => 'required|string|exists:packages,id',
            'transaction_date' => 'required|date',
            'amount'           => 'required|decimal:0,2|min:0',
            'payment_method'   => 'required|string|max:255',
            'notes'            => 'nullable|string|max:255',
        ];
    }
}
