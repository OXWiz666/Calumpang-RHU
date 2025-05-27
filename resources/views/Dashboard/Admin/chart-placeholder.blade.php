@props([
    'type' => 'bar',
    'title' => null,
    'class' => ''
])

<div class="p-6 flex flex-col items-center justify-center {{ $class }}">
    @if($title)
        <div class="text-sm font-medium mb-4">{{ $title }}</div>
    @endif
    <div class="w-full h-[200px] bg-gray-100 dark:bg-gray-700/40 rounded-md flex items-center justify-center">
        @switch($type)
            @case('bar')
                <div class="flex items-end justify-around w-full h-full px-8 pb-8">
                    @foreach([40, 70, 30, 85, 50, 65, 75] as $height)
                        <div 
                            class="w-8 bg-blue-500 rounded-t-sm"
                            style="height: {{ $height }}%"
                        ></div>
                    @endforeach
                </div>
                @break
            @case('line')
                <svg viewBox="0 0 100 50" class="w-full h-full p-4">
                    <polyline
                        points="0,40 15,30 30,35 45,15 60,25 75,10 90,20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="text-blue-500"
                    />
                    <line
                        x1="0"
                        y1="45"
                        x2="100"
                        y2="45"
                        stroke="currentColor"
                        stroke-width="0.5"
                        class="text-gray-500"
                    />
                </svg>
                @break
            @case('pie')
                <svg viewBox="0 0 100 100" class="w-[150px] h-[150px]">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="20"
                        stroke-dasharray="70 30"
                        stroke-dashoffset="25"
                        class="text-blue-500"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="20"
                        stroke-dasharray="25 75"
                        stroke-dashoffset="95"
                        class="text-blue-500 opacity-70"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="20"
                        stroke-dasharray="20 80"
                        stroke-dashoffset="70"
                        class="text-blue-500 opacity-40"
                    />
                </svg>
                @break
            @case('donut')
                <svg viewBox="0 0 100 100" class="w-[150px] h-[150px]">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="15"
                        stroke-dasharray="70 30"
                        stroke-dashoffset="25"
                        class="text-blue-500"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="15"
                        stroke-dasharray="25 75"
                        stroke-dashoffset="95"
                        class="text-blue-500 opacity-70"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="15"
                        stroke-dasharray="20 80"
                        stroke-dashoffset="70"
                        class="text-blue-500 opacity-40"
                    />
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="25" 
                        class="fill-white dark:fill-gray-800"
                    />
                </svg>
                @break
        @endswitch
    </div>
</div>