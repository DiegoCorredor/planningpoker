'use client';

import { Participant, getParticipantColor } from '@/lib/types';
import { Crown, Check, HelpCircle, Coffee } from 'lucide-react';

interface ParticipantCardProps {
  participant: Participant;
  index: number;
  revealed: boolean;
  isCurrentUser: boolean;
}

export default function ParticipantCard({
  participant,
  index,
  revealed,
  isCurrentUser,
}: ParticipantCardProps) {
  const hasVoted = participant.vote !== null;
  const color = getParticipantColor(index);

  const getVoteDisplay = () => {
    if (!hasVoted) {
      return (
        <div className="flex items-center justify-center text-white/40">
          <HelpCircle className="w-6 h-6" />
        </div>
      );
    }

    if (!revealed) {
      return (
        <div className="flex items-center justify-center">
          <Check className="w-6 h-6 text-green-400" />
        </div>
      );
    }

    // Revealed - show vote
    if (participant.vote === '☕') {
      return <Coffee className="w-6 h-6 text-amber-400" />;
    }

    return (
      <span className="text-2xl font-bold text-white">{participant.vote}</span>
    );
  };

  return (
    <div
      className={`
        relative flex flex-col items-center gap-2 p-4 rounded-xl
        transition-all duration-300
        ${isCurrentUser ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent' : ''}
        ${revealed && hasVoted ? 'animate-bounce-in' : ''}
      `}
    >
      {/* Vote Card */}
      <div className="card-container w-16 h-24">
        <div className={`card-inner ${revealed ? 'flipped' : ''}`}>
          {/* Card Front (hidden vote) */}
          <div
            className={`card-front ${
              hasVoted
                ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                : 'bg-white/10 border-2 border-dashed border-white/20'
            }`}
          >
            {getVoteDisplay()}
          </div>
          {/* Card Back (revealed vote) */}
          <div className="card-back bg-gradient-to-br from-green-500 to-emerald-600">
            {hasVoted ? (
              participant.vote === '☕' ? (
                <Coffee className="w-8 h-8 text-white" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {participant.vote}
                </span>
              )
            ) : (
              <span className="text-2xl text-white/60">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="flex items-center gap-1">
        {participant.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
        <span
          className={`text-sm font-medium truncate max-w-[80px] ${
            isCurrentUser ? 'text-purple-300' : 'text-white/80'
          }`}
          title={participant.name}
        >
          {participant.name}
          {isCurrentUser && ' (tú)'}
        </span>
      </div>

      {/* Status indicator */}
      <div
        className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full
          ${hasVoted ? 'bg-green-400' : 'bg-white/30 animate-soft-pulse'}
        `}
      />
    </div>
  );
}
