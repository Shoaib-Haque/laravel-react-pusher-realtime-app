<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Auth
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\UserAuthController;
// Users
use App\Http\Controllers\User\UserController;
// Messages
use App\Http\Controllers\User\MessageController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'admin'],
    Route::group(['prefix' => 'admin'],
        function ($router) {
            Route::post('/login', [AdminAuthController::class, 'login']);
            Route::post('/logout', [AdminAuthController::class, 'logout']);
        }
    ),
);

Route::group(['middleware' => 'user'],
    Route::group(['prefix' => 'user'],
        function ($router) {
            Route::post('/login', [UserAuthController::class, 'login']);
            Route::post('/logout', [UserAuthController::class, 'logout']);
        }
    ),
    Route::group(['prefix' => 'users'],
        function ($router) {
            Route::get('/', [UserController::class, 'index']);
        }
    ),
    Route::group(['prefix' => 'messages'],
        function ($router) {
            Route::get('/{receiver_id}', [MessageController::class, 'index']);
            Route::post('/', [MessageController::class, 'send']);
        },
    ),
);
