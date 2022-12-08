<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Messages;

class MessageEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    private $id, $sender_id, $receiver_id, $message, $created_at, $update_at;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($id, $sender_id, $receiver_id, $message, $created_at, $update_at)
    {
        $this->id = $id;
        $this->sender_id = $sender_id;
        $this->receiver_id = $receiver_id;
        $this->message = $message;
        $this->created_at = $created_at;
        $this->update_at = $update_at;
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'message' => $this->message,
            'created_at' => $this->created_at,
            'update_at' => $this->update_at,
        ];
    }

    public function broadcastAs()
    {
        return 'new-message';
    }

    // Public
    public function broadcastOn()
    {
        return new Channel('chat-channel.' . $this->receiver_id);
    }
}
