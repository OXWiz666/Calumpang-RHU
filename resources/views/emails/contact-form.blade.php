@component('mail::message')
# New Contact Form Submission

**Name:** {{ $contactData['name'] }}  
**Email:** {{ $contactData['email'] }}  
**Subject:** {{ $contactData['subject'] }}

**Message:**  
{{ $contactData['message'] }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent 