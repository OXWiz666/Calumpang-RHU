<header class="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b bg-background border-border">
    <div class="flex items-center flex-1 gap-4">
        <div class="relative w-full max-w-md">
            <div class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                <x-icon name="search" class="w-4 h-4" />
            </div>
            <input type="search" placeholder="Search..." class="w-full pl-9 bg-background md:w-64 lg:w-96 h-10 rounded-md border border-input">
        </div>
    </div>

    <div class="flex items-center gap-4">
        <div class="relative">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <x-icon name="bell" class="h-5 w-5" />
                @php
                $notifications = 3;  // This would come from your backend
                @endphp
                
                @if($notifications > 0)
                <span class="absolute top-0 right-0 flex h-5 w-5 -translate-y-1/3 translate-x-1/3">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span class="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground">
                        {{ $notifications }}
                    </span>
                </span>
                @endif
            </button>
        </div>

        <button @click="darkMode = !darkMode" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <template x-if="darkMode">
                <x-icon name="sun" class="h-5 w-5" />
            </template>
            <template x-if="!darkMode">
                <x-icon name="moon" class="h-5 w-5" />
            </template>
        </button>

        <div x-data="{ open: false }" class="relative">
            <button @click="open = !open" class="flex items-center bg-background text-foreground hover:bg-accent rounded-full">
                <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=health-admin" alt="Avatar" class="h-full w-full object-cover" />
                </div>
            </button>

            <div x-show="open" 
                 @click.away="open = false"
                 x-transition
                 class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border">
                <div class="py-2 px-4">
                    <p class="text-sm font-medium leading-none">Dr. Santos</p>
                    <p class="text-xs leading-none text-muted-foreground mt-1">admin@barangayhealth.gov</p>
                </div>
                <div class="border-t border-border"></div>
                <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm hover:bg-muted">Profile</a>
                <a href="{{ route('settings.index') }}" class="block px-4 py-2 text-sm hover:bg-muted">Settings</a>
                <div class="border-t border-border"></div>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm hover:bg-muted">
                        Log out
                    </button>
                </form>
            </div>
        </div>
    </div>
</header>