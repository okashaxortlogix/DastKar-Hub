<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:25',
            'role' => 'nullable|string|in:buyer,seller',
            'business_name' => 'required_if:role,seller|nullable|string|max:150',
            'craft_description' => 'nullable|string|max:1000',
            'location_city' => 'nullable|string|max:100',
        ]);

        $role = $validated['role'] ?? 'buyer';

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => $role,
            'status' => 'active',
        ]);

        if ($role === 'seller') {
            $businessName = $validated['business_name'] ?? ($user->name . "'s Crafts");
            SellerProfile::create([
                'user_id' => $user->id,
                'business_name' => $businessName,
                'slug' => Str::slug($businessName) . '-' . rand(100, 999),
                'craft_description' => $validated['craft_description'] ?? 'Handmade Pakistani crafts',
                'location_city' => $validated['location_city'] ?? 'Karachi',
                'location_region' => 'Pakistan',
                'verification_status' => 'basic',
                'seller_status' => 'active',
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => $user->load('sellerProfile'),
                'token' => $token,
            ],
            'message' => 'Registration successful.',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Your account has been suspended. Please contact DastKar support.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => $user->load('sellerProfile'),
                'token' => $token,
            ],
            'message' => 'Logged in successfully.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'user' => $request->user()->load(['sellerProfile', 'addresses']),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }
}
