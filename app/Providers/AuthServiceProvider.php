<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define a 'admin' ability
        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        // Define a 'patient' ability
        Gate::define('patient', function ($user) {
            return $user->role === 'patient';
        });
    }
} 