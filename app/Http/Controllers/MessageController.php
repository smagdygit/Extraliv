<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Client;

class MessageController extends Controller
{
    public function create(Request $request)
    {
        $newMessage = Message::create([
            'user_id' => $request->user_id,
            'client_id' => $request->client_id,
            'content' => $request->content,
        ]);

        $client = Client::where('id', $request->client_id)->first();
        $client->messages;
        return ['status' => 'success', 'client' => $client];
    }
}
