<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\Client;

class MessageController extends Controller
{
    public function getAll(Request $request)
    {
        $messageList = [];
        foreach (Message::orderBy('updated_at', 'DESC')->get() as $messageItem) {

            /* Convert '1' to 1, vice versa */
            $messageItem->east = $messageItem->east === '1' ? 1 : 0;
            $messageItem->lundby = $messageItem->lundby === '1' ? 1 : 0;
            $messageItem->angered = $messageItem->angered === '1' ? 1 : 0;
            $messageItem->vh = $messageItem->vh === '1' ? 1 : 0;
            $messageItem->backa = $messageItem->backa === '1' ? 1 : 0;
            $messageItem->readBy;
            $messageItem->client;
            $messageItem->user;

            array_push($messageList, $messageItem);
        }
        return $messageList;
    }

    public function create(Request $request)
    {
        foreach ($request->data_map as $item) {
            if ($item['user'] != null) {
                $newMessage = Message::create([
                    'user_id' => Auth::user()->id,
                    'client_id' => $item['user'],
                    'content' => $item['clean'] ? 'Ok!' : $item['content'],
                    'handled' => false,
                ])->id;

                MessageRead::create([
                    'user_id' => Auth::user()->id,
                    'message_id' => $newMessage,
                ]);
            }
        }


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

    public function handled(Request $request)
    {
        $userId = Auth::user()->id;
        if (Auth::user()->admin == true) {
            $id = $request->id;
            if (Message::where('id', $id)->exists()) {

                Message::where('id', $id)->update([
                    'handled' => true
                ]);

                return ['status' => 'success'];
            } else {
                return ['status' => 'error', 'text' => 'Meddelandet finns ej'];
            }
        } else {
            return ['status' => 'error', 'text' => 'Du har ej behörighet för att utföra detta'];
        }
    }

    public function delete(Request $request)
    {
        $userId = Auth::user()->id;
        if (Auth::user()->admin == true) {
            $id = $request->id;
            if (Message::where('id', $id)->exists()) {

                Message::where('id', $id)->delete();

                return ['status' => 'success'];
            } else {
                return ['status' => 'error', 'text' => 'Meddelandet finns ej'];
            }
        } else {
            return ['status' => 'error', 'text' => 'Du har ej behörighet för att utföra detta'];
        }
    }
}
