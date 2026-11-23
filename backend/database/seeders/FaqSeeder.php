<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Apa itu Game Store?',
                'answer' => 'Game Store adalah platform untuk membeli dan mengelola game digital secara mudah dan aman.',
                'order_number' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara membeli game?',
                'answer' => 'Pilih game yang ingin dibeli, tambahkan ke cart, lanjutkan ke checkout, lalu lakukan pembayaran.',
                'order_number' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara mendapatkan game setelah pembayaran?',
                'answer' => 'Setelah pembayaran berhasil dikonfirmasi, game akan otomatis masuk ke library akun kamu.',
                'order_number' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faqData) {
            Faq::updateOrCreate(
                ['question' => $faqData['question']],
                $faqData
            );
        }
    }
}
