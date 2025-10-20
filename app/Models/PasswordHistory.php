<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'password_hash',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    /**
     * Get the user that owns the password history.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a password has been used recently by this user.
     */
    public static function hasUsedPassword($userId, $password, $historyCount = 5)
    {
        $hashedPassword = bcrypt($password);
        
        // Get the last N password hashes for this user
        $recentPasswords = self::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($historyCount)
            ->pluck('password_hash')
            ->toArray();

        // Check if the new password matches any of the recent passwords
        foreach ($recentPasswords as $oldHash) {
            if (password_verify($password, $oldHash)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Add a new password to the history.
     */
    public static function addPassword($userId, $password)
    {
        self::create([
            'user_id' => $userId,
            'password_hash' => bcrypt($password),
        ]);

        // Keep only the last 5 passwords
        $userPasswords = self::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($userPasswords->count() > 5) {
            $passwordsToDelete = $userPasswords->skip(5);
            foreach ($passwordsToDelete as $password) {
                $password->delete();
            }
        }
    }
}