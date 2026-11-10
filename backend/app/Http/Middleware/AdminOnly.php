<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
  /**
   * Handle an incoming request.
   *
   * @param Request $request
   * @param Closure $next
   * @return Response
   */
  public function handle(Request $request, Closure $next): Response
  {
    $admin = auth('admin')->user() ?? $request->user('admin');

    if (!$admin || !($admin instanceof Admin)) {
      return response()->json([
        'success' => false,
        'message' => 'Unauthorized. Admin access only.',
      ], 403);
    }

    return $next($request);
  }
}

