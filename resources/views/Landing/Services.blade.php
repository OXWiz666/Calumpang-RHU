<section class="py-12 px-2 md:px-4 bg-slate-50">
    <div class="container mx-auto max-w-4xl">
        <div class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ $title }}</h2>
            <p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">{{ $subtitle }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach ($services as $service)
            <div class="bg-white p-6 rounded-lg shadow-lg h-full border border-gray-300 flex flex-col">
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    @if ($service['icon'] === 'calendar')
                        <svg class="w-8 h-8 bg-gray-200 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    @elseif ($service['icon'] === 'file-text')
                        <svg class="w-8 h-8 bg-gray-200 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    @elseif ($service['icon'] === 'clock')
                        <svg class="w-8 h-8 bg-gray-200 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    @endif
                </div>
                <h3 class="text-xl font-bold mb-5">{{ $service['title'] }}</h3>
                <p class="text-gray-700 mb-4 leading-relaxed flex-grow">{{ $service['description'] }}</p>
                <div class="mt-auto">
                    <a href="#" class="inline-block px-4 py-2 text-sm font-medium text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors">
                        {{ $service['ctaText'] }}
                    </a>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
