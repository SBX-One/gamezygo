<?php

namespace App\Repositories\Contracts\Api\V1\Admin\Announcement;

interface AdminAnnouncementRepositoryInterface
{
  /**
   * Get list of announcements with filters.
   *
   * @param array<string, mixed> $filters
   * @return array<string, mixed>
   */
  public function getAnnouncements(array $filters): array;

  /**
   * Get single announcement by ID.
   *
   * @param int $id
   * @return array<string, mixed>
   */
  public function getAnnouncementById(int $id): array;

  /**
   * Create a new announcement banner.
   *
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function createAnnouncement(array $data): array;

  /**
   * Update announcement banner by ID.
   *
   * @param int $id
   * @param array<string, mixed> $data
   * @return array<string, mixed>
   */
  public function updateAnnouncement(int $id, array $data): array;

  /**
   * Update publish status of announcement.
   *
   * @param int $id
   * @param bool $isPublish
   * @return array<string, mixed>
   */
  public function updatePublish(int $id, bool $isPublish): array;

  /**
   * Sort announcements by array of IDs.
   *
   * @param array<int> $announcementIds
   * @return void
   */
  public function sortAnnouncements(array $announcementIds): void;

  /**
   * Delete announcement by ID.
   *
   * @param int $id
   * @return void
   */
  public function deleteAnnouncement(int $id): void;
}

