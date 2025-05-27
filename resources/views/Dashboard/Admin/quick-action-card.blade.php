@props([
    'title',
    'description',
    'icon',
    'action',
    'class' => ''
])

<div {{ $attributes->merge(['class' => 'bg-card rounded-lg border border-border overflow-hidden ' . $class]) }}>
    <div class="p-4 pb-2">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
            <x-icon name="{{ $icon }}" class="h-6 w-6" />
        </div>
        <h3 class="text-lg font-medium">{{ $title }}</h3>
        <p class="text-sm text-muted-foreground">{{ $description }}</p>
    </div>
    <div class="p-4">
        <a href="{{ route($action['route']) }}" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
            {{ $action['label'] }}
        </a>
    </div>
</div>