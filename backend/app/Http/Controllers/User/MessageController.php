<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Messages;
use Exception;
use Illuminate\Validation\Rule;
use App\Events\MessageEvent;

class MessageController extends Controller
{
    /**
     * Create a new StatementController instance.
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
    public function index($receiver_id)
    {
        try {
            return Messages::select('*')
                ->where(function ($query) use ($receiver_id) {
                    $query->where('sender_id', '=', auth()->user()->id);
                    $query->where('receiver_id', '=', $receiver_id);
                })
                ->orWhere(function ($query) use ($receiver_id) {
                    $query->where('sender_id', '=', $receiver_id);
                    $query->where('receiver_id', '=', auth()->user()->id);
                })
                ->orderBy('created_at', 'DESC')
                ->get();
        } catch (Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send Message
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required',
            'receiver_id' => 'required'
        ]);

        try {
            $message = Messages::create([
                'sender_id' => auth()->user()->id,
                'message' => $request->message,
                'receiver_id' => $request->receiver_id,
                'created_at' => date('Y-m-d H:i:s'),
                'update_at' => date('Y-m-d H:i:s')
            ]);
            event(new MessageEvent($message->id, $message->sender_id, $message->receiver_id, $message->message, $message->created_at, $message->update_at));

            return response()->json([
                'message' => $message
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while sending message!!'
            ], 500);
        }
    }
}
