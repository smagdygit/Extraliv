<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MessageRead;
use App\Models\Message;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function get($id) {
        //If user exists
        if (User::where('id', $id)->exists()) {
            $user = User::where('id', $id)->first();
            //Get all extra data for user
            $user->messages;
            foreach ($user->messages as $message) {
                $message->client;
            }
            $user->messagesReadIds;
            $user->messagesReadArray;
            $array = [];
            foreach (MessageRead::all() as $item) {
                array_push($array, $item->id);
            }
            $user->test = Message::whereIn('id', $array)->get();
            
            return ['status' => 'success', 'user' => $user];
        } else {
            //If user does not exist
            return ['status' => 'error', 'error' => 'User does not exist'];
        }
    }

    public function getAll()
    {
        $userList = array();
        foreach (User::orderBy('name', 'asc')->get() as $userItem) {
            $userItem->messages;
            foreach ($userItem->messages as $message) {
                $message->client;
            }
            $userItem->messagesReadIds;
            $userItem->messagesReadArray;
            $array = [];
            foreach (MessageRead::all() as $item) {
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
            if ((!isset($request->name)) || (!isset($request->admin)) || (!isset($request->email)) || (!isset($request->password))
            ) {
                return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
            }

            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'admin' => $request->admin,
                'east' => 0,//$request->east,
                'lundby' => 0,//request->lundby,
                'angered' => 0,//$request->angered,
                'vh' => 0,//$request->vh,
                'backa' => 0,//$request->backa,
                'comment' => ($request->comment == '') ? '' : $request->comment,
                'force_change' => true,
            ]);

            return ['status' => 'success', 'users' => $this->getAll()];
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }

    public function update(Request $request)
    {
        if (/*Auth::user()->admin == true*/true) {
            if ((!isset($request->name)) || (!isset($request->admin)) || (!isset($request->email))
            ) {
                return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
            }

            $userId = $request->id;
            if (User::where('id', $userId)->exists()) {
                $oldUser = User::where('id', $userId)->first();
                User::where('id', $userId)->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => ($request->password == '') ? $oldUser->password : bcrypt($request->password),
                    'admin' => $request->admin,
                    'east' => 0,//$request->east,
                    'lundby' => 0,//request->lundby,
                    'angered' => 0,//$request->angered,
                    'vh' => 0,//$request->vh,
                    'backa' => 0,//$request->backa,
                    'comment' => ($request->comment == '') ? '' : $request->comment,
                    'force_change' => ($request->password == '') ? false : true,
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

    public function changePassword(Request $request)
    {
        $oldUser = User::where('id', Auth::user()->id)->first();
        $oldUser->update([
            'password' => bcrypt($request->password),
            'force_change' => false,
        ]);
        return ['success' => true];
    }
}
