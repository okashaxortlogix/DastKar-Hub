<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $makers = SellerProfile::with('user')
            ->where('seller_status', 'active')
            ->orderBy('rating_average', 'desc')
            ->paginate(12);

        return response()->json([
            'data' => $makers->items(),
            'meta' => [
                'current_page' => $makers->currentPage(),
                'total' => $makers->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $maker = SellerProfile::with([
            'user',
            'products' => function ($q) {
                $q->where('status', 'published')->with('primaryImage');
            },
            'reviews.buyer',
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        return response()->json([
            'data' => $maker,
        ]);
    }
}
