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
        // Add indexes for appointments table
        Schema::table('appointments', function (Blueprint $table) {
            $table->index(['date', 'status'], 'appointments_date_status_index');
            $table->index(['user_id'], 'appointments_user_id_index');
            $table->index(['servicetype_id'], 'appointments_servicetype_id_index');
            $table->index(['status'], 'appointments_status_index');
            $table->index(['created_at'], 'appointments_created_at_index');
        });

        // Add indexes for inventory table
        Schema::table('inventory', function (Blueprint $table) {
            $table->index(['category_id'], 'inventory_category_id_index');
            $table->index(['expiry_date'], 'inventory_expiry_date_index');
            $table->index(['status'], 'inventory_status_index');
            $table->index(['created_at'], 'inventory_created_at_index');
        });

        // Add indexes for users table
        Schema::table('users', function (Blueprint $table) {
            $table->index(['roleID'], 'users_role_id_index');
            $table->index(['status'], 'users_status_index');
            $table->index(['email'], 'users_email_index');
            $table->index(['created_at'], 'users_created_at_index');
        });

        // Add indexes for stocks table
        Schema::table('stocks', function (Blueprint $table) {
            $table->index(['inventory_id'], 'stocks_inventory_id_index');
            $table->index(['stocks'], 'stocks_quantity_index');
            $table->index(['minimum_stock'], 'stocks_minimum_stock_index');
        });

        // Add indexes for stock_movements table
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->index(['inventory_id'], 'stock_movements_inventory_id_index');
            $table->index(['movement_type'], 'stock_movements_type_index');
            $table->index(['created_at'], 'stock_movements_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes for appointments table
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('appointments_date_status_index');
            $table->dropIndex('appointments_user_id_index');
            $table->dropIndex('appointments_servicetype_id_index');
            $table->dropIndex('appointments_status_index');
            $table->dropIndex('appointments_created_at_index');
        });

        // Drop indexes for inventory table
        Schema::table('inventory', function (Blueprint $table) {
            $table->dropIndex('inventory_category_id_index');
            $table->dropIndex('inventory_expiry_date_index');
            $table->dropIndex('inventory_status_index');
            $table->dropIndex('inventory_created_at_index');
        });

        // Drop indexes for users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_id_index');
            $table->dropIndex('users_status_index');
            $table->dropIndex('users_email_index');
            $table->dropIndex('users_created_at_index');
        });

        // Drop indexes for stocks table
        Schema::table('stocks', function (Blueprint $table) {
            $table->dropIndex('stocks_inventory_id_index');
            $table->dropIndex('stocks_quantity_index');
            $table->dropIndex('stocks_minimum_stock_index');
        });

        // Drop indexes for stock_movements table
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropIndex('stock_movements_inventory_id_index');
            $table->dropIndex('stock_movements_type_index');
            $table->dropIndex('stock_movements_created_at_index');
        });
    }
};