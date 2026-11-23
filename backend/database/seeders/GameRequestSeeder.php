<?php

namespace Database\Seeders;

use App\Models\GameRequest;
use Illuminate\Database\Seeder;

class GameRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GameRequest::factory()->count(25)->create();
    }
}
