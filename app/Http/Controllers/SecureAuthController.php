<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Str;

class SecureAuthController extends Controller
{
    /**
     * Secure login with rate limiting and proper validation
     */
    public function login(Request $request, $role)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
            'remember' => 'boolean'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Rate limiting
        $key = 'login.' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'error' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        // Attempt authentication
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($key, 300); // 5 minutes lockout
            return back()->withErrors([
                'error' => 'Invalid credentials',
            ]);
        }

        // Clear rate limiting on successful login
        RateLimiter::clear($key);

        // Get the authenticated user
        $user = Auth::user();

        // Check if the user's account is archived
        if ($user->status == 5) { // 5 = Archived status
            Auth::logout();
            return back()->withErrors([
                'error' => 'Your account has been archived. Please contact an administrator for assistance.',
            ]);
        }

        // Check if the user's role matches the expected role
        if ($user->roleID != $role) {
            Auth::logout();
            return back()->withErrors([
                'error' => 'You are not authorized to access this area.',
            ]);
        }

        // Regenerate session for security
        $request->session()->regenerate();

        // Log successful login
        \Log::info('User logged in successfully', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $role,
            'ip' => $request->ip()
        ]);

        return redirect()->intended(route('home'));
    }

    /**
     * Secure logout
     */
    public function logout(Request $request)
    {
        $user = Auth::user();
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Log logout
        if ($user) {
            \Log::info('User logged out', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);
        }

        return redirect('/');
    }

    /**
     * Secure password change
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $user = Auth::user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Current password is incorrect.'
            ]);
        }

        // Check if new password is different from current
        if (Hash::check($request->new_password, $user->password)) {
            return back()->withErrors([
                'new_password' => 'New password must be different from current password.'
            ]);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        // Log password change
        \Log::info('User changed password', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip()
        ]);

        return back()->with('success', 'Password changed successfully.');
    }
}
