<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationCode;
    public $patientName;
    public $appointmentData;

    /**
     * Create a new message instance.
     */
    public function __construct($verificationCode, $patientName = '', $appointmentData = [])
    {
        $this->verificationCode = $verificationCode;
        $this->patientName = $patientName;
        $this->appointmentData = $appointmentData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Appointment Verification Code - Calumpang Rural Health Unit',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $html = \App\Services\ReactEmailService::renderReactToHtml('VerificationCodeEmail', [
            'verificationCode' => $this->verificationCode,
            'patientName' => $this->patientName,
            'appointmentData' => $this->appointmentData
        ]);

        return new Content(
            htmlString: $html,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
