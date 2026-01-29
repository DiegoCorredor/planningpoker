'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getPusherClient, resetPusherClient } from '@/lib/pusher-client';
import { Participant } from '@/lib/types';
import {
  generateParticipantId,
  getSavedParticipantId,
  saveParticipantId,
  getSavedName,
} from '@/lib/utils';

import RoomHeader from '@/components/RoomHeader';
import ParticipantCard from '@/components/ParticipantCard';
import VotingCards from '@/components/VotingCards';
import HostControls from '@/components/HostControls';
import VotingStats from '@/components/VotingStats';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { PresenceChannel } from 'pusher-js';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<Record<string, Participant>>(
    {},
  );
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [revealed, setRevealed] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [userName, setUserName] = useState('');
  const [isHost, setIsHost] = useState(false);

  const channelRef = useRef<PresenceChannel | null>(null);

  // Obtener nombre del usuario
  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    const savedName = getSavedName();
    const hostParam = searchParams.get('host') === 'true';

    if (nameFromUrl) {
      setUserName(nameFromUrl);
    } else if (savedName) {
      setUserName(savedName);
    } else {
      // Si no hay nombre, redirigir al inicio
      router.push('/');
      return;
    }

    setIsHost(hostParam);
  }, [searchParams, router]);

  // Enviar evento al servidor
  const sendEvent = useCallback(
    async (eventType: string, data: Record<string, unknown> = {}) => {
      try {
        await fetch('/api/room/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            eventType,
            ...data,
          }),
        });
      } catch (error) {
        console.error('Failed to send event:', error);
      }
    },
    [roomId],
  );

  // Conectar a Pusher
  useEffect(() => {
    if (!userName || !roomId) return;

    let oderId = getSavedParticipantId();

    if (!oderId) {
      oderId = generateParticipantId();
      saveParticipantId(oderId);
    }

    setCurrentUserId(oderId);

    // Crear el channel de presencia con autenticación personalizada
    const channelName = `presence-room-${roomId}`;

    // Obtener pusher con los parámetros de autenticación
    const authParams = {
      user_id: oderId,
      user_name: userName,
      is_host: isHost.toString(),
    };

    const pusher = getPusherClient(authParams);

    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    // Evento: Conexión exitosa
    channel.bind(
      'pusher:subscription_succeeded',
      (members: {
        members: Record<string, { name: string; isHost: boolean }>;
      }) => {
        setIsLoading(false);
        setIsConnected(true);

        // Inicializar participantes
        const initialParticipants: Record<string, Participant> = {};

        Object.entries(members.members).forEach(([oderId, info]) => {
          initialParticipants[oderId] = {
            id: oderId,
            name: info.name,
            vote: null,
            isHost: info.isHost,
            joinedAt: Date.now(),
          };
        });

        setParticipants(initialParticipants);
      },
    );

    // Evento: Nuevo miembro se une
    channel.bind(
      'pusher:member_added',
      (member: { id: string; info: { name: string; isHost: boolean } }) => {
        setParticipants((prev) => ({
          ...prev,
          [member.id]: {
            id: member.id,
            name: member.info.name,
            vote: null,
            isHost: member.info.isHost,
            joinedAt: Date.now(),
          },
        }));
      },
    );

    // Evento: Miembro se va
    channel.bind('pusher:member_removed', (member: { id: string }) => {
      setParticipants((prev) => {
        const updated = { ...prev };
        delete updated[member.id];
        return updated;
      });
    });

    // Evento: Voto recibido
    channel.bind('vote', (data: { oderId: string; vote: string }) => {
      setParticipants((prev) => ({
        ...prev,
        [data.oderId]: {
          ...prev[data.oderId],
          vote: data.vote,
        },
      }));
    });

    // Evento: Revelar votos
    channel.bind('reveal', () => {
      setRevealed(true);
    });

    // Evento: Nueva ronda
    channel.bind('reset', (data: { round: number }) => {
      setRevealed(false);
      setCurrentRound(data.round);
      setParticipants((prev) => {
        const reset: Record<string, Participant> = {};
        Object.entries(prev).forEach(([id, p]) => {
          reset[id] = { ...p, vote: null };
        });
        return reset;
      });
    });

    // Evento: Sincronización
    channel.bind(
      'sync',
      (data: {
        participants: Record<string, Participant>;
        revealed: boolean;
      }) => {
        setParticipants(data.participants);
        setRevealed(data.revealed);
      },
    );

    // Cleanup
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [userName, roomId, isHost]);

  // Handler: Votar
  const handleVote = useCallback(
    (value: string) => {
      if (revealed) return;

      // Actualizar localmente primero
      setParticipants((prev) => ({
        ...prev,
        [currentUserId]: {
          ...prev[currentUserId],
          vote: value,
        },
      }));

      // Enviar al servidor
      sendEvent('vote', {
        oderId: currentUserId,
        participantName: userName,
        vote: value,
      });
    },
    [revealed, currentUserId, userName, sendEvent],
  );

  // Handler: Revelar
  const handleReveal = useCallback(() => {
    setRevealed(true);
    sendEvent('reveal', { oderId: currentUserId });
  }, [currentUserId, sendEvent]);

  // Handler: Nueva ronda
  const handleReset = useCallback(() => {
    const newRound = currentRound + 1;
    setRevealed(false);
    setCurrentRound(newRound);
    setParticipants((prev) => {
      const reset: Record<string, Participant> = {};
      Object.entries(prev).forEach(([id, p]) => {
        reset[id] = { ...p, vote: null };
      });
      return reset;
    });
    sendEvent('reset', { oderId: currentUserId, round: newRound });
  }, [currentRound, currentUserId, sendEvent]);

  // Obtener mi voto actual
  const myVote = participants[currentUserId]?.vote || null;

  // Contar votos
  const participantList = Object.values(participants);
  const votesCount = participantList.filter((p) => p.vote !== null).length;

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Conectando a la sala...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Salir de la sala
        </button>

        {/* Header */}
        <RoomHeader
          roomId={roomId}
          roomName={`Sala ${roomId}`}
          participantCount={participantList.length}
          currentRound={currentRound}
        />

        {/* Connection Status */}
        {!isConnected && (
          <div className="glass p-4 bg-yellow-500/20 border-yellow-500/30">
            <p className="text-yellow-400 text-center">⚠️ Reconectando...</p>
          </div>
        )}

        {/* Participants Grid */}
        <div className="glass p-6">
          <h2 className="text-white font-semibold mb-4">Participantes</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {participantList.map((participant, index) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                index={index}
                revealed={revealed}
                isCurrentUser={participant.id === currentUserId}
              />
            ))}
          </div>

          {participantList.length === 0 && (
            <p className="text-white/40 text-center py-8">
              Esperando participantes...
            </p>
          )}
        </div>

        {/* Host Controls */}
        {isHost && (
          <div className="glass p-6">
            <HostControls
              revealed={revealed}
              onReveal={handleReveal}
              onReset={handleReset}
              votesCount={votesCount}
              totalParticipants={participantList.length}
            />
          </div>
        )}

        {/* Voting Stats (when revealed) */}
        <VotingStats participants={participantList} revealed={revealed} />

        {/* Voting Cards */}
        <div className="glass p-6">
          <VotingCards
            selectedVote={myVote}
            onVote={handleVote}
            disabled={revealed}
          />
        </div>
      </div>
    </main>
  );
}
