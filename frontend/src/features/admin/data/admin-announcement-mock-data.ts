import type { AdminAnnouncementItem } from "../types/admin-announcement.types";

export const MOCK_ADMIN_ANNOUNCEMENTS: AdminAnnouncementItem[] = [
  {
    id: "announcement-1",
    pageLink: "/promo/summer",
    imageUrl: "/assets/png/Banner.png",
    isPublished: true,
    orderNumber: 1,
    lastEdit: "Just now",
  },
  {
    id: "announcement-2",
    pageLink: "/store/special-deals",
    imageUrl: "/assets/png/Banner.png",
    isPublished: false,
    orderNumber: 2,
    lastEdit: "Just now",
  },
];
