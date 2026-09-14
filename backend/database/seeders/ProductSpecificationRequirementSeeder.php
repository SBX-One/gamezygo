<?php

namespace Database\Seeders;

use App\Models\ProductSpecificationRequirement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSpecificationRequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($batch = 0; $batch < 100; $batch++) {
            ProductSpecificationRequirement::factory()->count(50)->create();
        }
    }
}
