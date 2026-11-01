<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $announcements = [
            [
                'banner_file_url' => 'https://example.com/announcements/banner-1.jpg',
                'link'            => 'https://example.com/promo/summer-sale',
                'is_published'    => true,
                'sort_order'      => 1,
            ],
            [
                'banner_file_url' => 'https://example.com/announcements/banner-2.jpg',
                'link'            => 'https://example.com/games',
                'is_published'    => true,
                'sort_order'      => 2,
            ],
        ];

        foreach ($announcements as $announcementData) {
            Announcement::updateOrCreate(
                ['banner_file_url' => $announcementData['banner_file_url']],
                $announcementData
            );
        }
    }
}
