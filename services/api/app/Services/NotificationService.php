<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Send in-app notification to a user.
     */
    public static function send(
        User|int $user,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?array $metadata = null
    ): Notification {
        $userId = $user instanceof User ? $user->id : $user;

        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'is_read' => false,
            'metadata_json' => $metadata,
        ]);
    }
}
