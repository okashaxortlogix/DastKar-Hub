<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\SellerProfile;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Support\Facades\DB;

class VerificationService
{
    /**
     * Submit verification documents for seller artisan workshop.
     */
    public function submitVerification(SellerProfile $seller, array $data): Verification
    {
        return DB::transaction(function () use ($seller, $data) {
            $verification = Verification::create([
                'seller_id' => $seller->id,
                'type' => $data['type'] ?? 'maker_evidence',
                'status' => 'under_review',
                'document_number' => $data['document_number'] ?? null,
                'document_file_path' => $data['document_file_path'] ?? null,
                'workshop_address' => $data['workshop_address'] ?? null,
                'experience_years' => $data['experience_years'] ?? null,
                'metadata_json' => $data['metadata'] ?? null,
                'submitted_at' => now(),
            ]);

            $seller->update([
                'verification_status' => 'under_review',
            ]);

            AuditLog::create([
                'user_id' => $seller->user_id,
                'action' => 'seller.verification_submitted',
                'entity_type' => 'Verification',
                'entity_id' => $verification->id,
                'changes_json' => [
                    'seller_id' => $seller->id,
                    'type' => $verification->type,
                ],
            ]);

            return $verification;
        });
    }

    /**
     * Admin review decision on verification.
     */
    public function reviewVerification(Verification $verification, string $decision, ?string $reason, User $admin): Verification
    {
        return DB::transaction(function () use ($verification, $decision, $reason, $admin) {
            $isApproved = ($decision === 'approved');

            $verification->update([
                'status' => $isApproved ? 'approved' : 'rejected',
                'rejection_reason' => $isApproved ? null : $reason,
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            $seller = $verification->seller;
            $seller->update([
                'verification_status' => $isApproved ? 'verified' : 'rejected',
            ]);

            // Notify seller user
            if ($seller->user) {
                NotificationService::send(
                    $seller->user->id,
                    'seller_verified',
                    $isApproved ? 'Artisan Storefront Verified!' : 'Verification Update',
                    $isApproved
                        ? 'Congratulations! Your workshop verification has been approved. You now hold the DastKar Verified Maker Badge.'
                        : "Verification status update: {$reason}. Please submit updated documentation.",
                    '/seller/profile',
                    ['verification_id' => $verification->id]
                );
            }

            AuditLog::create([
                'user_id' => $admin->id,
                'action' => 'seller.verification_reviewed',
                'entity_type' => 'Verification',
                'entity_id' => $verification->id,
                'changes_json' => [
                    'decision' => $decision,
                    'reason' => $reason,
                ],
            ]);

            return $verification;
        });
    }
}
