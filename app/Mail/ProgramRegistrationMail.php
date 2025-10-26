<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProgramRegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $participant;
    public $program;
    public $registrationId;

    /**
     * Create a new message instance.
     */
    public function __construct($participant, $program, $registrationId)
    {
        $this->participant = $participant;
        $this->program = $program;
        $this->registrationId = $registrationId;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Program Registration Confirmation - ' . $this->program['name'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: $this->renderReactToHtml()
        );
    }

    /**
     * Render React component to HTML
     */
    private function renderReactToHtml(): string
    {
        $reactEmailService = app(\App\Services\ReactEmailService::class);
        
        return $reactEmailService->renderReactToHtml('ProgramRegistrationEmail', [
            'participant' => $this->participant,
            'program' => $this->program,
            'registrationId' => $this->registrationId,
        ]);
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
