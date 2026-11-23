<?php

namespace Tests\Feature\Integration;

use App\Events\OrderFulfilledEvent;
use App\Mail\OrderDeliveryMail;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductInstruction;
use App\Models\ProductLauncherCategory;
use App\Models\User;
use App\Repositories\Contracts\Api\V1\User\Payment\PaymentRepositoryInterface;
use App\Services\Mail\EmailDispatcherService;
use App\Services\Storage\S3StorageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EmailDispatcherAndS3SyncTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        Mail::fake();

        $this->user = User::factory()->create([
            'name' => 'John Gamer',
            'email' => 'gamer@example.com',
            'status' => 'active',
        ]);

        $launcher = ProductLauncherCategory::create([
            'name' => 'Steam',
            'slug' => 'steam',
        ]);

        $instruction = ProductInstruction::create([
            'title' => 'Steam Setup',
            'content' => 'Follow activation steps',
        ]);

        $this->product = Product::create([
            'name' => 'Black Myth: Wukong',
            'slug' => 'black-myth-wukong',
            'description' => 'Mythology Action RPG',
            'price' => 699000,
            'steam_url' => 'https://store.steampowered.com/app/2358720',
            'product_launcher_category_id' => $launcher->id,
            'product_instruction_id' => $instruction->id,
            'status' => 'published',
        ]);
    }

    public function test_email_dispatcher_dispatches_order_fulfilled_event(): void
    {
        Event::fake([OrderFulfilledEvent::class]);

        $order = Order::create([
            'user_id' => $this->user->id,
            'order_code' => 'ORD-MAIL-001',
            'subtotal_price' => 699000,
            'discount_amount' => 0,
            'total_price' => 699000,
            'status' => 'paid',
            'expired_at' => now()->addHours(24),
            'paid_at' => now(),
        ]);

        $dispatcher = app(EmailDispatcherService::class);
        $result = $dispatcher->dispatchOrderDelivery($order);

        $this->assertTrue($result);
        Event::assertDispatched(OrderFulfilledEvent::class, function ($event) use ($order) {
            return $event->order->id === $order->id;
        });
    }

    public function test_payment_fulfillment_triggers_order_fulfilled_event(): void
    {
        Event::fake([OrderFulfilledEvent::class]);

        $order = Order::create([
            'user_id' => $this->user->id,
            'order_code' => 'ORD-PAY-002',
            'subtotal_price' => 699000,
            'discount_amount' => 0,
            'total_price' => 699000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
        ]);

        $orderItem = $order->items()->create([
            'purchasable_type' => Product::class,
            'purchasable_id' => $this->product->id,
            'price' => 699000,
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'qris',
            'gateway_reference' => 'MIDTRANS-MAIL-002',
            'amount' => 699000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
        ]);

        $paymentRepo = app(PaymentRepositoryInterface::class);
        $paymentRepo->fulfillOrder($payment);

        Event::assertDispatched(OrderFulfilledEvent::class, function ($event) use ($order) {
            return $event->order->id === $order->id;
        });
    }

    public function test_order_delivery_mail_renders_with_order_and_credentials(): void
    {
        $order = Order::create([
            'user_id' => $this->user->id,
            'order_code' => 'ORD-RENDER-003',
            'subtotal_price' => 699000,
            'discount_amount' => 0,
            'total_price' => 699000,
            'status' => 'paid',
            'expired_at' => now()->addHours(24),
            'paid_at' => now(),
        ]);

        $credentials = [
            [
                'game_title' => 'Black Myth: Wukong',
                'username' => 'wukong_user_88',
                'password' => 'super_secret_pw',
                'access_token' => 'STEAM-GUARD-77',
            ],
        ];

        $mailable = new OrderDeliveryMail($order, $credentials);

        $html = $mailable->render();

        $this->assertStringContainsString('ORD-RENDER-003', $html);
        $this->assertStringContainsString('Black Myth: Wukong', $html);
        $this->assertStringContainsString('wukong_user_88', $html);
        $this->assertStringContainsString('super_secret_pw', $html);
        $this->assertStringContainsString('STEAM-GUARD-77', $html);
        $this->assertStringContainsString('Game Library', $html);
    }

    public function test_s3_storage_service_uploads_and_deletes_files(): void
    {
        Storage::fake('public');

        $storageService = app(S3StorageService::class);

        $file = UploadedFile::fake()->image('cover_art.jpg', 600, 600);
        $url = $storageService->upload($file, 'products');

        $this->assertNotEmpty($url);
        $relativePath = $storageService->extractRelativePath($url);
        $this->assertNotNull($relativePath);

        $deleted = $storageService->delete($url);
        $this->assertTrue($deleted);
    }

    public function test_s3_sync_command_executes_successfully(): void
    {
        Storage::fake('public');

        // Create fake local files
        Storage::disk('public')->put('products/game1.jpg', 'fake-image-content-1');
        Storage::disk('public')->put('products/game2.jpg', 'fake-image-content-2');

        $exitCode = Artisan::call('gamezygo:s3-sync', [
            '--directory' => 'products',
            '--dry-run' => true,
        ]);

        $this->assertEquals(0, $exitCode);

        $output = Artisan::output();
        $this->assertStringContainsString('DRY-RUN', $output);
        $this->assertStringContainsString('Summary:', $output);
    }

    public function test_s3_sync_command_with_db_update(): void
    {
        Storage::fake('public');

        $exitCode = Artisan::call('gamezygo:s3-sync', [
            '--all' => true,
            '--db-update' => true,
        ]);

        $this->assertEquals(0, $exitCode);

        $output = Artisan::output();
        $this->assertStringContainsString('Updating database image URLs', $output);
    }
}
