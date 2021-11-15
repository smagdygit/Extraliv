<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Log;

class LogController extends Controller
{
    public function getAll() {
        $logs = Log::get();
        return ['status' => 'success', 'logs' => $logs];
    }
}
