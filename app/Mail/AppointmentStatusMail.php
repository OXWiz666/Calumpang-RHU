<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $patientName;
    public $appointmentData;
    public $status;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct($patientName, $appointmentData, $status, $reason = null)
    {
        $this->patientName = $patientName;
        $this->appointmentData = $appointmentData;
        $this->status = $status;
        $this->reason = $reason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->status === 'confirmed' 
            ? 'Appointment Confirmed - Calumpang Rural Health Unit'
            : 'Appointment Declined - Calumpang Rural Health Unit';
            
        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $html = \App\Services\ReactEmailService::renderReactToHtml('AppointmentStatusEmail', [
            'patientName' => $this->patientName,
            'appointmentData' => $this->appointmentData,
            'status' => $this->status,
            'reason' => $this->reason
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
