<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\doctor_details;
use App\Models\medical_history;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class PatientsController extends Controller
{
    //

    public function index(){
        $patients = User::where('roleID','5')->with(['emercont','medical_histories'])->get();
        $patients->load('medical_histories.doctor.user');

        // return Inertia::render('Authenticated/Admin/Patients',[
        //     'patients_' => $patients
        // ]);


        return Inertia::render('Authenticated/Admin/Patients/page', [
            'patients_' => Inertia::always(User::where('roleID','5')
                            ->with(['emercont', 'medical_histories', 'medical_histories.doctor.user'])
                            ->get()),
            'doctors' => doctor_details::with(['user'])->get(),
        ]);
    }

    /*
        HTTP Method	URI	Action	Route Name
        GET	        /posts	            index	posts.index
        GET	        /posts/create	    create	posts.create
        POST	    /posts	            store   posts.store
        GET	        /posts/{post}	    show	posts.show
        GET	        /posts/{post}/edit	edit	posts.edit
        PUT/PATCH	/posts/{post}	    update	posts.update
        DELETE	    /posts/{post}	    destroy	posts.destroy

    */

    public function add_medical_rec(Request $request, User $patientid){
        //dd($request);

        $request->validate([
            'date' => 'required|date',
            'diagnosis' => 'required|min:3',
            // 'treatment' => 'required|min:3',
            'doctor' => 'required',
            // 'notes' => 'required|min:3',
            // 'followUp' => 'required|min:3',
        ]);

        medical_history::insert([
            'user_id' => $patientid->id,
            'doctor_id' => $request->doctor,
            'diagnosis' => $request->diagnosis,
            'treatment' => $request->treatment,
            'clinic_notes' => $request->notes,
            'followup_inst' => $request->followUp,
            //'created_at' => $request->date,
        ]);
        //$patient = new User();

        return back()->with([
            'flash' => [
                'icon' => 'success',
                'message' => 'Added Successfully!',
                'title' => "Success!"
            ]
        ]);
    }
}
