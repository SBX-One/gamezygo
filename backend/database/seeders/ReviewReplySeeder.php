<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewReplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviewIds = Review::pluck('id');
        $userIds = User::pluck('id');

        if ($reviewIds->isEmpty() || $userIds->isEmpty()) {
            return;
        }

        $data = [];

        for ($i = 0; $i < 50; $i++) {
            $data[] = [
                'review_id'  => $reviewIds->random(),
                'user_id'    => $userIds->random(),
                'message'    => fake()->sentence(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('review_replies')->insert($data);
    }
}
