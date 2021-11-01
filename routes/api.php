<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PassportAuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ClientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/


Route::post('register', [PassportAuthController::class, 'register']);
Route::post('login', [PassportAuthController::class, 'login']);








Route::middleware('auth:api')->group(function () {
    Route::get('clients/all', [ClientController::class, 'getAll']);
    Route::post('clients/create', [ClientController::class, 'create']);
    Route::put('clients/update', [ClientController::class, 'update']);
    Route::delete('clients/delete', [ClientController::class, 'delete']);
    Route::get('client/{id}', [ClientController::class, 'get']);

    Route::get('messages/all', [MessageController::class, 'getAll']);
    Route::post('messages/create', [MessageController::class, 'create']);
    Route::put('messages/read', [MessageController::class, 'read']);
    Route::put('messages/handled', [MessageController::class, 'handled']);
    Route::delete('messages/delete', [MessageController::class, 'delete']);

    Route::get('users/all', [UserController::class, 'getAll']);
    Route::post('users/create', [UserController::class, 'create']);
    Route::put('users/update', [UserController::class, 'update']);
    Route::delete('users/delete', [UserController::class, 'delete']);
    Route::put('user/change-password', [UserController::class, 'changePassword']);
    Route::get('user/{id}', [UserController::class, 'get']);
});


Route::middleware('auth:api')->group(function () {
    Route::resource('posts', PostController::class);
});
