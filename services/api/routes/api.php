<?php

use App\Http\Controllers\Api\v1\AdminController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\CategoryController;
use App\Http\Controllers\Api\v1\OrderController;
use App\Http\Controllers\Api\v1\ProductController;
use App\Http\Controllers\Api\v1\SellerController;
use App\Http\Controllers\Api\v1\SellerDashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication (Rate limited against brute-force attacks)
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

    // Public Catalog
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/makers', [SellerController::class, 'index']);
    Route::get('/makers/{slug}', [SellerController::class, 'show']);

    // Cart / Checkout Quote (Accessible to both guests & logged in)
    Route::post('/checkout/quote', [OrderController::class, 'quote']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Buyer Orders & Addresses
        Route::post('/checkout/process', [OrderController::class, 'checkout']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
        Route::post('/orders/{orderNumber}/review', [OrderController::class, 'submitReview']);
        Route::get('/addresses', [OrderController::class, 'addresses']);
        Route::post('/addresses', [OrderController::class, 'saveAddress']);

        // Seller Hub Routes
        Route::prefix('seller')->group(function () {
            Route::get('/stats', [SellerDashboardController::class, 'stats']);
            Route::get('/products', [SellerDashboardController::class, 'products']);
            Route::post('/products', [SellerDashboardController::class, 'storeProduct']);
            Route::put('/products/{id}', [SellerDashboardController::class, 'updateProduct']);
            Route::delete('/products/{id}', [SellerDashboardController::class, 'deleteProduct']);
            Route::get('/orders', [SellerDashboardController::class, 'orders']);
            Route::patch('/orders/{id}/status', [SellerDashboardController::class, 'updateOrderStatus']);
        });

        // Admin Console Routes
        Route::prefix('admin')->group(function () {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::post('/sellers/{id}/verify', [AdminController::class, 'verifySeller']);
            Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
        });
    });
});
