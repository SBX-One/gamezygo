<?php

namespace Database\Seeders;

use App\Models\CommunityTag;
use Illuminate\Database\Seeder;

class CommunityTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = ['Discord', 'Telegram', 'WhatsApp', 'Steam Group', 'Reddit', 'Forum'];

        foreach ($tags as $tagName) {
            CommunityTag::create([
                'name' => $tagName,
                'slug' => str()->slug($tagName),
            ]);
        }
    }
}
