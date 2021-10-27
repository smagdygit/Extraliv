<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MessageRead;
use App\Models\Message;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getAll()
    {
        $userList = array();
        foreach (User::orderBy('name', 'asc')->get() as $userItem) {
            $userItem->messages;
            forEach ($userItem->messages as $message) {
                $message->client;
            }
            $userItem->messagesReadIds;
            $userItem->messagesReadArray;
            $array = [];
            forEach (MessageRead::all() as $item) {
                array_push($array, $item->id);
            }
            $userItem->test = Message::whereIn('id', $array)->get();
            array_push($userList, $userItem);
        }
        return $userList;
    }

    public function create(Request $request)
    {
        if (/*Auth::user()->admin == true*/true) {
            if ((!isset($request->name)) || (!isset($request->admin)) || (!isset($request->email)) || (!isset($request->password)) || (!isset($request->east)) ||
            (!isset($request->lundby)) || (!isset($request->angered)) || (!isset($request->vh)) || (!isset($request->backa)) || (!isset($request->backa))
            ) {
                return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
            }

            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'admin' => $request->admin,
                'east' => $request->east,
                'lundby' => $request->lundby,
                'angered' => $request->angered,
                'vh' => $request->vh,
                'backa' => $request->backa,
                'comment' => ($request->comment == '') ? '' : $request->comment,
            ]);

            return ['status' => 'success', 'users' => $this->getAll()];
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }

    public function update(Request $request)
    {
        if (/*Auth::user()->admin == true*/true) {
            if ((!isset($request->name)) || (!isset($request->admin)) || (!isset($request->email)) || (!isset($request->east)) ||
            (!isset($request->lundby)) || (!isset($request->angered)) || (!isset($request->vh)) || (!isset($request->backa)) || (!isset($request->backa))
            ) {
                return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
            }

            $userId = $request->id;
            if (User::where('id', $userId)->exists()) {
                $oldUser = User::where('id', $userId)->first();
                $oldUser->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => ($request->password == '') ? $oldUser->password : bcrypt($request->password),
                    'admin' => $request->admin,
                    'east' => $request->east,
                    'lundby' => $request->lundby,
                    'angered' => $request->angered,
                    'vh' => $request->vh,
                    'backa' => $request->backa,
                    'comment' => ($request->comment == '') ? '' : $request->comment,
                ]);

                return ['status' => 'success', 'employees' => $this->getAll()];
            } else {
                //Phone does not exist, error
                return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen användare med ID "' . $userId . '", prova att ladda om sidan'];
            }
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }

    public function delete(Request $request)
    {
        if (Auth::user()->admin == true) {
            $phoneId = $request->id;
            if (User::where('id', $phoneId)->exists()) {
                $phoneToDelete = User::where('id', $phoneId)->first();
                $phoneToDelete->delete();
                return ['status' => 'success', 'users' => $this->getAll()];
            } else {
                return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen användare registrerad med detta id'];
            }
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }
}
