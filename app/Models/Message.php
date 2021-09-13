<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Client;
use App\Models\MessageRead;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function readBy()
    {
        return $this->belongsToMany(User::class, 'message_reads');
    }

    public function author()
    {
        return $this->belongsTo(User::class);
    }
}
