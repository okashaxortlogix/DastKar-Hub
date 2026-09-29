<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with(['children' => function ($q) {
            $q->where('status', 'active')->withCount('products')->orderBy('sort_order');
        }])
        ->withCount('products')
        ->whereNull('parent_id')
        ->where('status', 'active')
        ->orderBy('sort_order')
        ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $category = Category::with(['children', 'products' => function ($q) {
            $q->where('status', 'published')->with(['primaryImage', 'seller'])->take(20);
        }])
        ->where('slug', $slug)
        ->firstOrFail();

        return response()->json([
            'data' => $category,
        ]);
    }
}
