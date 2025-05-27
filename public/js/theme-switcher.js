// Theme Switcher Utility

function initTheme() {
    // Check for saved theme preference or use system default
    const theme = localStorage.getItem('theme') || 'system';
    
    // Apply the theme
    applyTheme(theme);
    
    // Set up listeners for theme changes
    setupThemeListeners();
}

function applyTheme(theme) {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // If system preference, check user's OS settings
    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        
        root.classList.add(systemTheme);
    } else {
        // Otherwise apply the selected theme
        root.classList.add(theme);
    }
}

function setupThemeListeners() {
    // Listen for OS theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const theme = localStorage.getItem('theme') || 'system';
        if (theme === 'system') {
            applyTheme('system');
        }
    });
    
    // Set up any theme toggle buttons
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'system';
                let newTheme;
                
                // Cycle through themes: system -> light -> dark -> system
                if (currentTheme === 'system') {
                    newTheme = 'light';
                } else if (currentTheme === 'light') {
                    newTheme = 'dark';
                } else {
                    newTheme = 'system';
                }
                
                // Save and apply the new theme
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
                
                // Update the server-side theme (optional)
                updateServerTheme(newTheme);
                
                // Update toggle button icons if needed
                updateThemeToggleIcons(newTheme);
            });
        });
    });
}

function updateServerTheme(theme) {
    // Send the theme preference to the server (optional)
    // This can be used to persist the theme across devices
    fetch('/theme/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        body: JSON.stringify({ theme })
    }).catch(error => console.error('Error updating theme on server:', error));
}

function updateThemeToggleIcons(theme) {
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');
    
    themeToggles.forEach(toggle => {
        const sunIcon = toggle.querySelector('.sun-icon');
        const moonIcon = toggle.querySelector('.moon-icon');
        const systemIcon = toggle.querySelector('.system-icon');
        
        if (sunIcon && moonIcon && systemIcon) {
            // Hide all icons first
            sunIcon.classList.add('hidden');
            moonIcon.classList.add('hidden');
            systemIcon.classList.add('hidden');
            
            // Show the appropriate icon
            if (theme === 'light') {
                sunIcon.classList.remove('hidden');
            } else if (theme === 'dark') {
                moonIcon.classList.remove('hidden');
            } else {
                systemIcon.classList.remove('hidden');
            }
        }
    });
}

// Initialize theme on page load
initTheme();
