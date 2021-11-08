<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Log;

class PassportAuthController extends Controller
{
    /**
     * Registration
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|min:4',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
 
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
       
        $token = $user->createToken('LaravelAuthApp')->accessToken;
 
        return response()->json(['token' => $token], 200);
    }
 
    /**
     * Login
     */
    public function login(Request $request)
    {
        $data = [
            'email' => $request->email,
            'password' => $request->password
        ];
 
        if (auth()->attempt($data)) {
            $token = auth()->user()->createToken('LaravelAuthApp')->accessToken;

            Log::create([
                'user_id' => -1,
                'target' => 'auth',
                'action' => 'login_success',
                'content' => $request->email,
                'payload' => $request->email,
                'mini' => 'User logged in',
                'short' => 'User \''.$request->email.'\' has logged in',
                'long' => 'User \''.$request->email.'\' has logged in',
            ]);

            return response()->json(['status' => 'success', 'token' => 'Bearer ' . $token, 'user' => auth()->user()], 200);
        } else {

            Log::create([
                'user_id' => -1,
                'target' => 'auth',
                'action' => 'login_fail',
                'content' => $request->email,
                'payload' => $request->email,
                'mini' => 'User logged in',
                'short' => 'User \''.$request->email.'\' has failed to log in',
                'long' => 'User \''.$request->email.'\' has failed to log in',
            ]);

            return response()->json(['status' => 'bad-data', 'id' => 'login-incorrect', 'text' => 'The password is wrong or the account does not exist.'], 200);
        }
    }   
}