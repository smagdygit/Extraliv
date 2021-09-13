<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    public function getAll()
    {
        $clientList = array();
        foreach (Client::orderBy('name', 'asc')->get() as $clientItem) {
            $clientMessages = $clientItem->messages;
            foreach ($clientMessages as $message) {
                $message->readBy;
                $message->user;
            }
            array_push($clientList, $clientItem);
        }
        foreach ($clientList as $clientItem) {
            
            foreach ($clientItem->messages as $message) {
                $message->read = false;
                foreach ($message->readBy as $readBy) {
                    $message->read = ($readBy->id === Auth::user()->id);
                }
            }
            
        }
        return $clientList;
    }

    public function create(Request $request)
    {
        if (strlen($request->name) < 3) {
            return ['status' => 'bad-data', 'field' => 'name', 'id' => 'bad-name', 'text' => 'Namnet måste vara minst 3 bokstäver långt'];
        }

        if (strlen($request->care_type) === 0) {
            return ['status' => 'bad-data', 'field' => 'sith', 'id' => 'bad-sith', 'text' => 'Du måste välja en vårdtyp'];
        }

        if ((!isset($request->name)) || (!isset($request->care_type)) || (!isset($request->east)) || (!isset($request->lundby)) || 
            (!isset($request->angered)) || (!isset($request->vh)) || (!isset($request->backa))
        ) {
            return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
        }

        $newPerson = Client::create([
            'name' => $request->name,
            'care_type' => $request->care_type,
            'east' => $request->east,
            'lundby' => $request->lundby,
            'angered' => $request->angered,
            'vh' => $request->vh,
            'backa' => $request->backa,
            'comment' => $request->comment ?: '',
        ]);

        return ['status' => 'success', 'clients' => $this->getAll()];
    }

    public function update(Request $request)
    {
        if (strlen($request->name) < 3) {
            return ['status' => 'bad-data', 'field' => 'name', 'id' => 'bad-name', 'text' => 'Namnet måste vara minst 3 bokstäver långt'];
        }

        if (strlen($request->care_type) === 0) {
            return ['status' => 'bad-data', 'field' => 'sith', 'id' => 'bad-sith', 'text' => 'Du måste välja en vårdtyp'];
        }

        if ((!isset($request->name)) || (!isset($request->care_type)) || (!isset($request->east)) || (!isset($request->lundby)) || 
            (!isset($request->angered)) || (!isset($request->vh)) || (!isset($request->backa))
        ) {
            return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
        }

        $personId = $request->id;
        if (Client::where('id', $personId)->exists()) {
            $oldPerson = Client::where('id', $personId)->first();
            $oldPerson->update([
                'name' => $request->name,
                'east' => $request->east,
                'lundby' => $request->lundby,
                'angered' => $request->angered,
                'vh' => $request->vh,
                'backa' => $request->backa,
                'comment' => $request->comment ?: '',
            ]);

            return ['status' => 'success', 'clients' => $this->getAll()];
        } else {
            //Person does not exist, error
            return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen brukare med Intraliv ID "' . $personId . '", prova att ladda om sidan'];
        }
    }

    public function delete(Request $request)
    {
        $personId = $request->id;
        if (Client::where('id', $personId)->exists()) {
            $personToDelete = Client::where('id', $personId)->first();
            $personToDelete->delete();
            return ['status' => 'success', 'clients' => $this->getAll()];
        } else {
            return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen brukare registrerad med detta id'];
        }
    }
}
