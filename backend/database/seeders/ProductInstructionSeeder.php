<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductInstructionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($batch = 0; $batch < 100; $batch++) {
            ProductInstruction::factory()->count(50)->create();
        }   
    }
}
