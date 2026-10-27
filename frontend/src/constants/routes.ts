/**
 * Route Configuration & Access Control
 * Defines route permissions for Guest, Authenticated User, and Admin.
 */

/**
 * Protected routes exclusive to authenticated user dashboard.
 * If a guest attempts to visit these routes directly via URL address bar,
 * they will be intercepted and redirected to /login with a return redirect parameter.
 *
 * Per requirements:
 * - /bundle is accessible to guests (preview & plans) but requires login for real action (subscribe)
 * - /library, /history, /wishlist, /request, /profile, /credentials/*, /dashboard/* are private user routes
 * - Shared routes (/store, /leaderboard, /review, /blogs, /about, /cart, /bundle, /) remain freely accessible to guests
 * - Admin routes (/admin/*) are left untouched during current development phase
 */
export const PROTECTED_USER_ROUTES = [
  "/library",
  "/history",
  "/wishlist",
  "/request",
  "/profile",
  "/credentials",
  "/dashboard",
  "/checkout",
] as const;

/**
 * Checks whether the given pathname requires user authentication.
 *
 * @param pathname - The Next.js router pathname or asPath
 * @returns boolean indicating if the route is a private user dashboard route
 */
export function isUserProtectedRoute(pathname: string): boolean {
  if (!pathname) return false;

  // Clean pathname: strip query params, hashes, and trailing slashes
  const cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  return PROTECTED_USER_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`)
  );
}
