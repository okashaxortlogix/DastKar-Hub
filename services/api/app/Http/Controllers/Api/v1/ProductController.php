<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['seller', 'primaryImage', 'images', 'category'])
            ->where('status', 'published');

        // Search by keyword
        if ($request->filled('q')) {
            $term = '%' . trim($request->input('q')) . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                  ->orWhere('description', 'like', $term)
                  ->orWhere('materials', 'like', $term)
                  ->orWhereHas('seller', function ($sq) use ($term) {
                      $sq->where('business_name', 'like', $term)
                         ->orWhere('craft_description', 'like', $term)
                         ->orWhere('location_city', 'like', $term);
                  });
            });
        }

        // Filter by category slug
        if ($request->filled('category')) {
            $catSlug = $request->input('category');
            $category = Category::where('slug', $catSlug)->first();
            if ($category) {
                $categoryIds = [$category->id];
                $childIds = Category::where('parent_id', $category->id)->pluck('id')->toArray();
                $categoryIds = array_merge($categoryIds, $childIds);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        // Filter by Price range (PKR)
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', (float) $request->input('max_price'));
        }

        // Filter by Rating
        if ($request->filled('min_rating')) {
            $query->where('rating_average', '>=', (float) $request->input('min_rating'));
        }

        // Filter by Materials
        if ($request->filled('material')) {
            $mat = '%' . trim($request->input('material')) . '%';
            $query->where('materials', 'like', $mat);
        }

        // Filter by subcategory slug
        if ($request->filled('subcategory')) {
            $subSlug = $request->input('subcategory');
            $subCat = Category::where('slug', $subSlug)->first();
            if ($subCat) {
                $query->where('category_id', $subCat->id);
            }
        }

        // Filter by availability (in_stock vs made_to_order)
        if ($request->filled('availability')) {
            $avail = $request->input('availability');
            if ($avail === 'in_stock') {
                $query->where('stock_quantity', '>', 0);
            } elseif ($avail === 'made_to_order') {
                $query->where(function ($q) {
                    $q->whereNull('stock_quantity')->orWhere('stock_quantity', '<=', 0);
                });
            }
        }

        // Filter by customization
        if ($request->filled('customization')) {
            $cust = $request->input('customization');
            if ($cust === 'customizable') {
                $query->where('is_customizable', true);
            } elseif ($cust === 'standard') {
                $query->where('is_customizable', false);
            }
        }

        // Filter by Featured
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sort = $request->input('sort');
        $hasSearch = $request->filled('q');
        $searchTerm = $hasSearch ? trim($request->input('q')) : null;

        // Default to ranked discovery sorting if search or sort=ranked/featured
        if ($sort === 'ranked' || (!$sort && $hasSearch) || $sort === 'featured') {
            $allProducts = $query->get();
            $ranked = app(\App\Services\Discovery\ProductRankingService::class)
                ->rankProducts($allProducts, $searchTerm);

            $perPage = (int) $request->input('per_page', 16);
            $page = (int) $request->input('page', 1);
            $sliced = $ranked->slice(($page - 1) * $perPage, $perPage)->values();

            return response()->json([
                'data' => $sliced,
                'meta' => [
                    'current_page' => $page,
                    'last_page' => (int) ceil($ranked->count() / max(1, $perPage)),
                    'per_page' => $perPage,
                    'total' => $ranked->count(),
                    'sorted_by' => 'ranked',
                ],
            ]);
        }

        switch ($sort) {
            case 'price_low':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('base_price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating_average', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('ranking_score', 'desc')->orderBy('rating_average', 'desc');
                break;
        }

        $perPage = (int) $request->input('per_page', 16);
        $products = $query->paginate($perPage);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with([
            'seller.user',
            'category',
            'images',
            'variants',
            'customizationOptions',
            'reviews.buyer',
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        // Also fetch related products from same category or maker
        $relatedProducts = Product::with(['seller', 'primaryImage'])
            ->where('status', 'published')
            ->where('id', '!=', $product->id)
            ->where(function ($q) use ($product) {
                $q->where('category_id', $product->category_id)
                  ->orWhere('seller_id', $product->seller_id);
            })
            ->take(4)
            ->get();

        return response()->json([
            'data' => [
                'product' => $product,
                'related' => $relatedProducts,
            ],
        ]);
    }

    public function featured(): JsonResponse
    {
        $featured = Product::with(['seller', 'primaryImage'])
            ->where('status', 'published')
            ->where('is_featured', true)
            ->take(8)
            ->get();

        return response()->json([
            'data' => $featured,
        ]);
    }
}
