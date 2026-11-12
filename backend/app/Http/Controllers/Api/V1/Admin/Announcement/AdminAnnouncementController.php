<?php

namespace App\Http\Controllers\Api\V1\Admin\Announcement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\Announcement\AdminAnnouncementIndexRequest;
use App\Http\Requests\Api\V1\Admin\Announcement\AdminAnnouncementPublishRequest;
use App\Http\Requests\Api\V1\Admin\Announcement\AdminAnnouncementSortRequest;
use App\Http\Requests\Api\V1\Admin\Announcement\AdminAnnouncementStoreRequest;
use App\Http\Requests\Api\V1\Admin\Announcement\AdminAnnouncementUpdateRequest;
use App\Repositories\Contracts\Api\V1\Admin\Announcement\AdminAnnouncementRepositoryInterface;
use Illuminate\Http\JsonResponse;

class AdminAnnouncementController extends Controller
{
  public function __construct(
    protected AdminAnnouncementRepositoryInterface $announcementRepository
  ) {}

  /**
   * List announcements with search, publish status filter, and sorting.
   *
   * @param AdminAnnouncementIndexRequest $request
   * @return JsonResponse
   */
  public function index(AdminAnnouncementIndexRequest $request): JsonResponse
  {
    $data = $this->announcementRepository->getAnnouncements($request->validated());

    return response()->json([
      'success' => true,
      'message' => 'Announcements retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Show single announcement details.
   *
   * @param int $announcementId
   * @return JsonResponse
   */
  public function show(int $announcementId): JsonResponse
  {
    $data = $this->announcementRepository->getAnnouncementById($announcementId);

    return response()->json([
      'success' => true,
      'message' => 'Announcement retrieved successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Create a new announcement banner.
   *
   * @param AdminAnnouncementStoreRequest $request
   * @return JsonResponse
   */
  public function store(AdminAnnouncementStoreRequest $request): JsonResponse
  {
    $data = $this->announcementRepository->createAnnouncement($request->all());

    return response()->json([
      'success' => true,
      'message' => 'Announcement created successfully',
      'data'    => $data,
    ], 201);
  }

  /**
   * Update announcement banner by ID.
   *
   * @param AdminAnnouncementUpdateRequest $request
   * @param int $announcementId
   * @return JsonResponse
   */
  public function update(AdminAnnouncementUpdateRequest $request, int $announcementId): JsonResponse
  {
    $data = $this->announcementRepository->updateAnnouncement($announcementId, $request->all());

    return response()->json([
      'success' => true,
      'message' => 'Announcement updated successfully',
      'data'    => $data,
    ]);
  }

  /**
   * Update publish status of announcement.
   *
   * @param AdminAnnouncementPublishRequest $request
   * @param int $announcementId
   * @return JsonResponse
   */
  public function publish(AdminAnnouncementPublishRequest $request, int $announcementId): JsonResponse
  {
    $isPublish = (bool) $request->validated('is_publish');
    $data = $this->announcementRepository->updatePublish($announcementId, $isPublish);
    $actionText = $isPublish ? 'published' : 'unpublished';

    return response()->json([
      'success' => true,
      'message' => "Announcement {$actionText} successfully",
      'data'    => $data,
    ]);
  }

  /**
   * Sort announcements by array of IDs.
   *
   * @param AdminAnnouncementSortRequest $request
   * @return JsonResponse
   */
  public function sort(AdminAnnouncementSortRequest $request): JsonResponse
  {
    $this->announcementRepository->sortAnnouncements($request->validated('announcement_ids'));

    return response()->json([
      'success' => true,
      'message' => 'Announcements sorted successfully',
      'data'    => null,
    ]);
  }

  /**
   * Delete announcement by ID.
   *
   * @param int $announcementId
   * @return JsonResponse
   */
  public function destroy(int $announcementId): JsonResponse
  {
    $this->announcementRepository->deleteAnnouncement($announcementId);

    return response()->json([
      'success' => true,
      'message' => 'Announcement deleted successfully',
      'data'    => null,
    ]);
  }
}

