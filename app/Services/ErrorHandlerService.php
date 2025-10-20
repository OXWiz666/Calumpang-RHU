<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;

class ErrorHandlerService
{
    /**
     * Log error with context
     */
    public static function logError(Exception $exception, array $context = [])
    {
        Log::error($exception->getMessage(), [
            'exception' => $exception,
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'context' => $context,
            'user_id' => auth()->id(),
            'url' => request()->url(),
            'method' => request()->method(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Handle database errors
     */
    public static function handleDatabaseError(Exception $exception, string $operation = 'database operation')
    {
        self::logError($exception, ['operation' => $operation]);
        
        return response()->json([
            'success' => false,
            'message' => 'A database error occurred. Please try again.',
            'error_code' => 'DATABASE_ERROR'
        ], 500);
    }

    /**
     * Handle validation errors
     */
    public static function handleValidationError(array $errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ], 422);
    }

    /**
     * Handle authentication errors
     */
    public static function handleAuthError(string $message = 'Authentication failed')
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => 'AUTH_ERROR'
        ], 401);
    }

    /**
     * Handle authorization errors
     */
    public static function handleAuthorizationError(string $message = 'Access denied')
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => 'AUTHORIZATION_ERROR'
        ], 403);
    }

    /**
     * Handle not found errors
     */
    public static function handleNotFoundError(string $resource = 'Resource')
    {
        return response()->json([
            'success' => false,
            'message' => "{$resource} not found",
            'error_code' => 'NOT_FOUND'
        ], 404);
    }

    /**
     * Handle rate limit errors
     */
    public static function handleRateLimitError(int $retryAfter = 60)
    {
        return response()->json([
            'success' => false,
            'message' => 'Too many requests. Please try again later.',
            'retry_after' => $retryAfter,
            'error_code' => 'RATE_LIMIT'
        ], 429);
    }

    /**
     * Send critical error notification to admin
     */
    public static function notifyCriticalError(Exception $exception, array $context = [])
    {
        try {
            $errorData = [
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'context' => $context,
                'timestamp' => now()->toDateTimeString(),
                'url' => request()->url(),
                'user_id' => auth()->id(),
            ];

            // Log critical error
            Log::critical('Critical error occurred', $errorData);

            // Send email notification (uncomment when email is configured)
            // Mail::to(config('mail.admin_email'))->send(new CriticalErrorMail($errorData));

        } catch (Exception $e) {
            Log::error('Failed to send critical error notification', [
                'original_error' => $exception->getMessage(),
                'notification_error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle API errors consistently
     */
    public static function handleApiError(Exception $exception, string $operation = 'API operation')
    {
        self::logError($exception, ['operation' => $operation]);

        // Determine error type and response
        if ($exception instanceof \Illuminate\Validation\ValidationException) {
            return self::handleValidationError($exception->errors());
        }

        if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
            return self::handleAuthError();
        }

        if ($exception instanceof \Illuminate\Auth\Access\AuthorizationException) {
            return self::handleAuthorizationError();
        }

        if ($exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
            return self::handleNotFoundError();
        }

        // Default error response
        return response()->json([
            'success' => false,
            'message' => 'An error occurred. Please try again.',
            'error_code' => 'INTERNAL_ERROR'
        ], 500);
    }
}
