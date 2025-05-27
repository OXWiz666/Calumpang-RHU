<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;

class ThemeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(Request $request): void
    {
        // Get theme from cookie or default to system
        $theme = Cookie::get('theme', 'system');
        
        // Share the theme with all views
        View::share('theme', $theme);
        
        // Create a route to update the theme
        $this->app['router']->post('/theme/update', function (Request $request) {
            $theme = $request->input('theme', 'system');
            
            // Validate theme
            if (!in_array($theme, ['light', 'dark', 'system'])) {
                $theme = 'system';
            }
            
            // Set cookie for 1 year
            $cookie = Cookie::make('theme', $theme, 60 * 24 * 365);
            
            return redirect()->back()->withCookie($cookie);
        })->name('theme.update');
    }
}
