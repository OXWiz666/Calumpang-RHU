<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Email Template</title>
    @vite('resources/css/app.css')
</head>

<body class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 bg-background">
    <div class="w-full max-w-xl">
        <div class="w-full max-w-[2200px] mx-auto p-4 bg-white">
            {{-- Email Header with Logo --}}
            <div class="text-center mb-6">
                <img src="{{ $companyLogo ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=company' }}"
                    alt="{{ $companyName ?? 'YourCompany' }} Logo" class="h-16 mx-auto mb-4" />
                <h1 class="text-2xl font-bold text-gray-800">Calumpang RHU</h1>
            </div>

            <div class="border-gray-200 shadow-sm rounded-lg">
                <div class="p-6">
                    {{-- Email Content --}}
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">
                        Password Reset Request
                    </h2>

                    <p class="text-gray-600 mb-6">
                        We received a request to reset your password. If you didn't make
                        this request, you can safely ignore this email.
                    </p>

                    <p class="text-gray-600 mb-6">
                        To reset your password, please click the button below:
                    </p>

                    {{-- Primary CTA Button --}}
                    <div class="text-center mb-6">
                        <a href="{{ $resetLink ?? 'https://example.com/reset-password' }}"
                            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md w-full sm:w-auto text-center">
                            Reset Your Password
                        </a>
                    </div>

                    {{-- Fallback Text Link --}}
                    <p class="text-gray-600 text-sm mb-6 text-center">
                        If the button doesn't work, copy and paste this link into your
                        browser:
                        <br />
                        <a href="{{ $resetLink ?? 'https://example.com/reset-password' }}"
                            class="text-blue-600 hover:underline break-all">
                            {{ $resetLink ?? 'https://example.com/reset-password' }}
                        </a>
                    </p>

                    <p class="text-gray-600 mb-4">
                        This password reset link will expire in 24 hours. If you need
                        assistance, please contact our support team.
                    </p>
                </div>
            </div>

            {{-- Footer --}}
            <div class="mt-6 text-center text-gray-500 text-sm">
                <hr class="mb-4" />
                <p class="mb-2">
                    Need help? Contact our support team at
                    <a href="mailto:{{ $supportEmail ?? 'support@yourcompany.com' }}"
                        class="text-blue-600 hover:underline">
                        {{ $supportEmail ?? 'support@yourcompany.com' }}
                    </a>
                    <span> or call +1 (555) 123-4567</span>
                </p>
                <p class="mb-4">
                    For security reasons, this email was sent to the email address
                    associated with your account.
                </p>
                <p>
                    &copy; {{ date('Y') }} YourCompany. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>

</html>
