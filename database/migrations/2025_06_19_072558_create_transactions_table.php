<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUlid('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignUlid('package_id')->constrained('packages')->onDelete('cascade');
            $table->date('transaction_date');
            $table->unsignedInteger('amount')->nullable();
            $table->string('payment_method')->comment('cash,credit_card,bank_transfer,e_wallet,qris');
            $table->string('status')->default('pending')->comment('pending,completed,failed');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
