import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher-server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.text();
    const params = new URLSearchParams(data);

    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 },
      );
    }

    // Para canales de presencia, necesitamos datos del usuario
    if (channel.startsWith('presence-')) {
      const userId = params.get('user_id') || `user-${Date.now()}`;
      const userName = params.get('user_name') || 'Anonymous';
      const isHost = params.get('is_host') === 'true';

      const presenceData = {
        user_id: userId,
        user_info: {
          name: userName,
          isHost: isHost,
        },
      };

      const auth = pusherServer.authorizeChannel(
        socketId,
        channel,
        presenceData,
      );
      return NextResponse.json(auth);
    }

    // Para canales privados
    const auth = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    );
  }
}
