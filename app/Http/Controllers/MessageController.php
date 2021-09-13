<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\Client;

class MessageController extends Controller
{
    public function create(Request $request)
    {
        $newMessage = Message::create([
            'user_id' => Auth::user()->id,
            'client_id' => $request->client_id,
            'content' => $request->content,
        ])->id;

        MessageRead::create([
            'user_id' => Auth::user()->id,
            'message_id' => $newMessage,
        ]);

        /*
        $client = Client::where('id', $request->client_id)->first();
        $client->messages;*/
        return ['status' => 'success'];
    }

    public function read(Request $request)
    {
        $userId = Auth::user()->id;
        $id = $request->id;
        if (Message::where('id', $id)->exists()) {
            $wasRead = MessageRead::where('user_id', $userId)->where('message_id', $id)->exists();
            if (!$wasRead) {
                MessageRead::create([
                    'user_id' => $userId,
                    'message_id' => $id,
                ]);
            }
            return ['status' => 'success'];
        } else {
            return ['status' => 'error', 'text' => 'Meddelandet finns ej'];
        }
    }
}
