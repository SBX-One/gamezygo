<?php

namespace Database\Seeders;

use App\Models\CustomSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CustomSection::factory()->count(5)->create();
    }
}
