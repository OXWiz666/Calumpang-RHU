<section class="w-full py-16 bg-slate-50">
    <!-- Add Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <style>
        .swiper {
            padding: 20px 50px 60px 50px !important;
            position: relative;
        }
        .swiper-pagination {
            bottom: 0px !important;
        }
        .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #cbd5e1;
            opacity: 1;
            margin: 0 6px !important;
        }
        .swiper-pagination-bullet-active {
            background: #0B1120;
            transform: scale(1.2);
        }
        .custom-button {
            width: 40px !important;
            height: 40px !important;
            background: #0B1120 !important;
            border-radius: 50% !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 10 !important;
        }
        .swiper-button-prev {
            left: 0 !important;
        }
        .swiper-button-next {
            right: 0 !important;
        }
        .custom-button:hover {
            background: #1a2744 !important;
            transform: translateY(-50%) scale(1.1) !important;
        }
        .custom-button::after {
            font-size: 16px !important;
            color: white !important;
        }
    </style>
    
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ $title }}</h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ $subtitle }}</p>
        </div>

        <div class="max-w-5xl mx-auto relative">
            <!-- Swiper -->
            <div class="swiper testimonialSwiper">
                <div class="swiper-wrapper">
                    @foreach ($testimonials as $testimonial)
                        <div class="swiper-slide">
                            <div class="bg-white p-6 rounded-lg shadow-md h-full">
                                <div class="mb-4 text-primary">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                </div>
                                <p class="text-gray-700 mb-6 flex-grow">"{{ $testimonial['quote'] }}"</p>
                                <div class="flex items-center mt-auto">
                                    @if ($testimonial['imageUrl'])
                                        <img src="{{ $testimonial['imageUrl'] }}" alt="{{ $testimonial['name'] }}" class="w-12 h-12 rounded-full mr-4">
                                    @else
                                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                    @endif
                                    <div>
                                        <h4 class="font-medium text-gray-900">{{ $testimonial['name'] }}</h4>
                                        @if ($testimonial['role'])
                                            <p class="text-sm text-gray-500">{{ $testimonial['role'] }}</p>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Pagination dots -->
                <div class="swiper-pagination"></div>
                
                <!-- Navigation buttons -->
                <button class="swiper-button-prev custom-button"></button>
                <button class="swiper-button-next custom-button"></button>
            </div>
        </div>
    </div>

    <!-- Add Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script>
        var swiper = new Swiper(".testimonialSwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    </script>
</section>