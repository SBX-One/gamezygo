<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Instruction;

interface AdminInstructionRepositoryInterface
{
    /**
     * Get paginated instruction templates with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function getInstructions(array $filters): array;

    /**
     * Get single instruction template by ID.
     *
     * @return array<string, mixed>
     */
    public function getInstructionById(int $id): array;

    /**
     * Create a new instruction template.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createInstruction(array $data): array;

    /**
     * Update instruction template by ID.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updateInstruction(int $id, array $data): array;

    /**
     * Delete instruction template by ID.
     */
    public function deleteInstruction(int $id): void;
}
