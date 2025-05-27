@props([
    'title',
    'value',
    'icon',
    'description' => null,
    'trend' => null,
    'class' => ''
])

<div {{ $attributes->merge(['class' => 'bg-card rounded-lg border border-border overflow-hidden ' . $class]) }}>
    <div class="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
        <h3 class="text-sm font-medium">{{ $title }}</h3>
        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <x-icon name="{{ $icon }}" class="h-5 w-5" />
        </div>
    </div>
    <div class="p-4 pt-0">
        <div class="text-2xl font-bold">{{ $value }}</div>
        @if($description || $trend)
            <div class="flex items-center mt-1">
                @if($trend)
                    <span class="text-xs font-medium mr-2 {{ $trend['isPositive'] ? 'text-green-500' : 'text-red-500' }}">
                        {{ $trend['isPositive'] ? '+' : '' }}{{ $trend['value'] }}%
                    </span>
                @endif
                @if($description)
                    <p class="text-xs text-muted-foreground">{{ $description }}</p>
                @endif
            </div>
        @endif
    </div>
</div>