<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Message;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'care_type',
        'east',
        'lundby',
        'angered',
        'vh',
        'backa',
        'comment',
        'hidden',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'DESC');
    }
}
