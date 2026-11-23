<?php

namespace App\Console\Commands;

use App\Services\Credential\CredentialAllocationService;
use Illuminate\Console\Command;

class ReleaseExpiredReservationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gamezygo:release-expired-reservations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Release expired game credential reservations back to available inventory';

    /**
     * Execute the console command.
     */
    public function handle(CredentialAllocationService $allocationService): int
    {
        $this->info('Scanning for expired credential reservations...');

        $released = $allocationService->releaseExpiredReservations();

        $this->info("Released {$released} expired reservation(s) back to available stock.");

        return Command::SUCCESS;
    }
}
