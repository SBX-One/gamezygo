<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'user@gamezygo.com'],
            [
                'name'              => 'Test User',
                'email_verified_at' => now(),
                'password'          => Hash::make('password'),
                'phone'             => '081234567890',
                'status'            => 'active',
                'total_points'      => 500,
                'total_transaction' => 10,
            ]
        );

        User::factory()->count(49)->create();
    }
}
