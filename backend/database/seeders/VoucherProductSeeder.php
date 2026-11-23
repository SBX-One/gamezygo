<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoucherProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productIds = Product::pluck('id');
        $voucherIds = Voucher::pluck('id');

        $data = [];

        for ($i = 0; $i < 1000; $i++) {
            $data[] = [
                'product_id' => $productIds->random(),
                'voucher_id' => $voucherIds->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('voucher_products')->insert($data);
    }
}
