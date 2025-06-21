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
        Schema::create('attendances', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('attendable_id');
            $table->string('attendable_type');
            $table->timestamp('entry_timestamp');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['attendable_type', 'attendable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
