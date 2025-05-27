@props([
    'title',
    'description' => null,
    'class' => ''
])

<div {{ $attributes->merge(['class' => 'bg-card rounded-lg border border-border overflow-hidden ' . $class]) }}>
    <div class="p-4 pb-2">
        <h3 class="text-lg font-medium">{{ $title }}</h3>
        @if($description)
            <p class="text-sm text-muted-foreground">{{ $description }}</p>
        @endif
    </div>
    <div class="p-0">
        {{ $slot }}
    </div>
</div>