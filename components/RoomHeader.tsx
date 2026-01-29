'use client';

import { Copy, Check, Users, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface RoomHeaderProps {
  roomId: string;
  roomName: string;
  participantCount: number;
  currentRound: number;
}

export default function RoomHeader({
  roomId,
  roomName,
  participantCount,
  currentRound,
}: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomLink = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Room Info */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Planning Poker
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {participantCount} participante{participantCount !== 1 ? 's' : ''}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Ronda #{currentRound}</span>
          </div>
        </div>

        {/* Room Code & Share */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
            <span className="text-white/60 text-sm">Sala:</span>
            <code className="text-purple-400 font-mono font-bold">
              {roomId}
            </code>
            <button
              onClick={copyRoomId}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>

          <button
            onClick={copyRoomLink}
            className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 
              text-purple-300 px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <LinkIcon className="w-4 h-4" />
            Compartir link
          </button>
        </div>
      </div>
    </div>
  );
}
