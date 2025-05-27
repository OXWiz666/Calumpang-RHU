<aside class="fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out"
       :class="sidebarOpen ? 'w-64' : 'w-16'">
    <div class="flex items-center justify-between h-16 px-4 border-b border-border">
        <div class="flex items-center gap-2" x-show="sidebarOpen">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span class="text-primary-foreground font-bold">BH</span>
            </div>
            <span class="font-semibold text-lg">Health Center</span>
        </div>
        <button @click="sidebarOpen = !sidebarOpen" 
                class="ml-auto p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                :class="!sidebarOpen && 'mx-auto'">
            <svg x-show="sidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            <svg x-show="!sidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
        </button>
    </div>
    <div class="py-4">
        <nav class="space-y-1 px-2">
            @php
            $navItems = [
                [
                    'title' => 'Dashboard',
                    'route' => 'dashboard',
                    'icon' => 'layout-dashboard'
                ],
                [
                    'title' => 'Patients',
                    'route' => 'patients.index',
                    'icon' => 'users'
                ],
                [
                    'title' => 'Appointments',
                    'route' => 'appointments.index',
                    'icon' => 'calendar'
                ],
                [
                    'title' => 'Medicine Inventory',
                    'route' => 'inventory.index',
                    'icon' => 'pill'
                ],
                [
                    'title' => 'Reports',
                    'route' => 'reports.index',
                    'icon' => 'file-text'
                ],
                [
                    'title' => 'Analytics',
                    'route' => 'analytics.index',
                    'icon' => 'bar-chart'
                ],
                [
                    'title' => 'Settings',
                    'route' => 'settings.index',
                    'icon' => 'settings'
                ]
            ];
            @endphp

            @foreach($navItems as $item)
                @php
                $isActive = request()->routeIs($item['route']);
                @endphp

                <template x-if="sidebarOpen">
                    <a href="{{ route($item['route']) }}"
                       class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md {{ $isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground' }}">
                        <x-icon name="{{ $item['icon'] }}" class="w-5 h-5" />
                        <span class="ml-3">{{ $item['title'] }}</span>
                    </a>
                </template>
                
                <template x-if="!sidebarOpen">
                    <div x-data="{ isTooltipOpen: false }" @mouseenter="isTooltipOpen = true" @mouseleave="isTooltipOpen = false" class="relative">
                        <a href="{{ route($item['route']) }}"
                           class="flex items-center justify-center p-2 mx-auto my-2 rounded-md {{ $isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground' }}">
                            <x-icon name="{{ $item['icon'] }}" class="w-5 h-5" />
                        </a>
                        
                        <div x-show="isTooltipOpen" 
                             x-transition
                             class="absolute left-full ml-2 top-0 z-50 px-2 py-1 text-xs rounded bg-foreground text-background whitespace-nowrap">
                            {{ $item['title'] }}
                        </div>
                    </div>
                </template>
            @endforeach
        </nav>
    </div>
</aside>