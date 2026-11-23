<?php

namespace App\Http\Controllers\Api\V1\Admin\Instruction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Instruction\AdminInstructionIndexRequest;
use App\Http\Requests\Api\V1\Admin\Instruction\AdminInstructionStoreRequest;
use App\Http\Requests\Api\V1\Admin\Instruction\AdminInstructionUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Instruction\AdminInstructionRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminInstructionController extends Controller
{
    public function __construct(
        protected AdminInstructionRepositoryInterface $instructionRepository
    ) {}

    /**
     * List instruction templates with search, is_used filter, and pagination.
     */
    public function index(AdminInstructionIndexRequest $request): JsonResponse
    {
        $data = $this->instructionRepository->getInstructions($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Instructions retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Show single instruction template details.
     */
    public function show(int $instructionId): JsonResponse
    {
        $data = $this->instructionRepository->getInstructionById($instructionId);

        return response()->json([
            'success' => true,
            'message' => 'Instruction retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Create a new instruction template.
     */
    public function store(AdminInstructionStoreRequest $request): JsonResponse
    {
        $data = $this->instructionRepository->createInstruction($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Instruction template created successfully',
            'data' => $data,
        ], 201);
    }

    /**
     * Update instruction template by ID.
     */
    public function update(AdminInstructionUpdateRequest $request, int $instructionId): JsonResponse
    {
        $data = $this->instructionRepository->updateInstruction($instructionId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Instruction template updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Delete instruction template by ID.
     */
    public function destroy(int $instructionId): JsonResponse
    {
        $this->instructionRepository->deleteInstruction($instructionId);

        return response()->json([
            'success' => true,
            'message' => 'Instruction template deleted successfully',
            'data' => null,
        ]);
    }
}
