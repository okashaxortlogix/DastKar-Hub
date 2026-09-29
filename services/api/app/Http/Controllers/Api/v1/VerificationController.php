<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use App\Services\VerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    protected VerificationService $verificationService;

    public function __construct(VerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Seller: check current verification status
     */
    public function status(Request $request): JsonResponse
    {
        $seller = $request->user()->sellerProfile;
        if (!$seller) {
            return response()->json(['message' => 'Seller profile required.'], 403);
        }

        $verifications = Verification::where('seller_id', $seller->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => [
                'is_verified' => $seller->verification_status === 'verified',
                'verification_status' => $seller->verification_status,
                'submissions' => $verifications,
            ],
        ]);
    }

    /**
     * Seller: submit documents for artisan workshop verification
     */
    public function store(Request $request): JsonResponse
    {
        $seller = $request->user()->sellerProfile;
        if (!$seller) {
            return response()->json(['message' => 'Seller profile required.'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:cnic,artisan_card,workshop_photo,maker_evidence',
            'document_number' => 'nullable|string|max:100',
            'document_file_path' => 'nullable|string|max:500',
            'workshop_address' => 'required|string|max:500',
            'experience_years' => 'required|string|max:50',
            'metadata' => 'nullable|array',
        ]);

        $verification = $this->verificationService->submitVerification($seller, $validated);

        return response()->json([
            'data' => $verification,
            'message' => 'Artisan verification evidence submitted successfully for admin review.',
        ], 201);
    }

    /**
     * Admin: list verifications pending review
     */
    public function adminIndex(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $status = $request->query('status', 'under_review');
        $query = Verification::with(['seller.user']);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $verifications = $query->latest('submitted_at')->paginate(20);

        return response()->json([
            'data' => $verifications->items(),
            'meta' => [
                'current_page' => $verifications->currentPage(),
                'total' => $verifications->total(),
            ],
        ]);
    }

    /**
     * Admin: approve or reject verification
     */
    public function review(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $validated = $request->validate([
            'decision' => 'required|string|in:approved,rejected',
            'reason' => 'nullable|string|max:500',
        ]);

        $verification = Verification::with('seller')->findOrFail($id);

        $reviewed = $this->verificationService->reviewVerification(
            $verification,
            $validated['decision'],
            $validated['reason'] ?? null,
            $request->user()
        );

        return response()->json([
            'data' => $reviewed,
            'message' => "Artisan verification {$validated['decision']} successfully.",
        ]);
    }
}
