<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ValidateInput
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Sanitize all string inputs
        $input = $request->all();
        
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                // Remove potentially dangerous characters
                $input[$key] = strip_tags($value);
                $input[$key] = htmlspecialchars($input[$key], ENT_QUOTES, 'UTF-8');
            }
        }
        
        $request->merge($input);

        // Validate common patterns
        $validator = Validator::make($request->all(), [
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'name' => 'nullable|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'password' => 'nullable|string|min:6|max:255',
            'description' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $validator->errors()
            ], 422);
        }

        return $next($request);
    }
}
