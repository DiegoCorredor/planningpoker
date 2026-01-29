import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher-server';

// Evento: Usuario vota
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, oderId, participantName, vote, eventType } = body;

    if (!roomId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const channel = `presence-room-${roomId}`;

    switch (eventType) {
      case 'vote':
        await pusherServer.trigger(channel, 'vote', {
          oderId,
          participantName,
          vote,
        });
        break;

      case 'reveal':
        await pusherServer.trigger(channel, 'reveal', {
          oderId,
          revealed: true,
        });
        break;

      case 'reset':
        await pusherServer.trigger(channel, 'reset', {
          oderId,
          round: body.round || 1,
        });
        break;

      case 'sync':
        await pusherServer.trigger(channel, 'sync', {
          participants: body.participants,
          revealed: body.revealed,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 },
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Room event error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger event' },
      { status: 500 },
    );
  }
}
