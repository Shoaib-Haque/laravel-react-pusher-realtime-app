<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users;
use Exception;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Create a new AccountController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:user');
        config(['auth.defaults.guard' => 'user']);
    }

    /**
     * Get Account List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = Users::select('*')
            ->where('id', '!=', auth()->user()->id)
            ->get();
        return ['users' => $users, 'user_id' => auth()->user()->id];
    }
}
