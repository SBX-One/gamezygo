<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoucherUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id');
        $voucherIds = Voucher::pluck('id');

        $data = [];

        for ($i = 0; $i < 1000; $i++) {
            $data[] = [
                'user_id'    => $userIds->random(),
                'voucher_id' => $voucherIds->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('voucher_users')->insert($data);
    }
}
