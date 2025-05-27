<?php

namespace App\Livewire\Doctor;

use Livewire\Component;

class DoctorDashboard extends Component
{
    /**
     * @method $this layout(string $layout)
     */
    public function render()
    {
        return view('livewire.doctor.doctor-dashboard')
        ->layout('layouts.doctorlayout');
    }
}
