<?php

namespace Database\Seeders;

use App\Models\ProductInstruction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductInstructionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $instructions = [
            'Standard Steam Shared Account Setup Guide',
            'Epic Games Shared Login & Offline Mode Setup',
            'Ubisoft Connect Activation & Play Guide',
            'EA App Shared Library Access Instructions',
        ];

        foreach ($instructions as $title) {
            ProductInstruction::firstOrCreate(
                ['title' => $title],
                ['content' => "1. Turn off Steam Cloud Sync.\n2. Login using given credentials.\n3. Switch to Offline Mode before playing."]
            );
        }
    }
}
