<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\Client;
use App\Models\Log;

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
            if (!empty($item['user'])) {
                $newMessage = Message::create([
                    'user_id' => Auth::user()->id,
                    'client_id' => $item['user'],
                    'content' => $item['clean'] ? '' : $item['content'],
                    'handled' => $item['clean'] ? true : false,
                    'empty' => $item['clean'] ? true : false,
                ])->id;

                MessageRead::create([
                    'user_id' => Auth::user()->id,
                    'message_id' => $newMessage,
                ]);

                Log::create([
                    'user_id' => Auth::user()->id,
                    'target' => 'message',
                    'action' => 'create',
                    'content' => $item['content'] || '',
                    'payload' => json_encode($item),
                    'mini' => 'User created a new message',
                    'short' => 'User \''.Auth::user()->name.'\' ('.Auth::user()->id.') created a new '.($item['clean'] ? 'empty ' : '').'message for client_id ('.$item['user'].')',
                    'long' => 'User \''.Auth::user()->name.'\' ('.Auth::user()->id.') created a new '.($item['clean'] ? 'empty message for client_id ('.$item['user'].')' : 'message for client_id ('.$item['user'].')'.(!$item['clean'] ? 'saying \''.$item['content'].'\'' : '')),
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

                Log::create([
                    'user_id' => Auth::user()->id,
                    'target' => 'message',
                    'action' => 'read',
                    'content' => $id,
                    'payload' => $id,
                    'mini' => 'User read message',
                    'short' => 'User \''.Auth::user()->name.'\' ('.Auth::user()->id.') read message_id '.$id,
                    'long' => 'User \''.Auth::user()->name.'\' ('.Auth::user()->id.') read message_id '.$id,
                ]);
            }
            return ['status' => 'success', 'was_read' => $wasRead, 'user' => $userId, 'message' => $id];
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

                Log::create([
                    'user_id' => Auth::user()->id,
                    'target' => 'message',
                    'action' => 'handle',
                    'content' => $id,
                    'payload' => $id,
                    'mini' => 'Admin marked message as handled',
                    'short' => 'Admin \''.Auth::user()->name.'\' ('.Auth::user()->id.') marked message_id '.$id.' as handled',
                    'long' => 'Admin \''.Auth::user()->name.'\' ('.Auth::user()->id.') marked message_id '.$id.' as handled',
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

                Log::create([
                    'user_id' => Auth::user()->id,
                    'target' => 'message',
                    'action' => 'delete',
                    'content' => $id,
                    'payload' => $id,
                    'mini' => 'Admin deleted message',
                    'short' => 'Admin \''.Auth::user()->name.'\' ('.Auth::user()->id.') deleted message_id '.$id,
                    'long' => 'Admin \''.Auth::user()->name.'\' ('.Auth::user()->id.') deleted message_id '.$id,
                ]);

                return ['status' => 'success'];
            } else {
                return ['status' => 'error', 'text' => 'Meddelandet finns ej'];
            }
        } else {
            return ['status' => 'error', 'text' => 'Du har ej behörighet för att utföra detta'];
        }
    }
}
