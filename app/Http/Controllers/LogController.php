<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Log;

class LogController extends Controller
{
    public function getAll() {
        $logs = Log::orderBy('created_at', 'desc')->get();
        foreach ($logs as $log) {
            $log->user;
        }
        return ['status' => 'success', 'logs' => $logs];
    }
}
