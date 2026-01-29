'use client';

import { Eye, EyeOff, RotateCcw } from 'lucide-react';

interface HostControlsProps {
  revealed: boolean;
  onReveal: () => void;
  onReset: () => void;
  votesCount: number;
  totalParticipants: number;
}

export default function HostControls({
  revealed,
  onReveal,
  onReset,
  votesCount,
  totalParticipants,
}: HostControlsProps) {
  const allVoted = votesCount === totalParticipants && totalParticipants > 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {!revealed ? (
        <button
          onClick={onReveal}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            transition-all duration-300 transform hover:scale-105
            ${
              allVoted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
            }
          `}
        >
          <Eye className="w-5 h-5" />
          Revelar votos ({votesCount}/{totalParticipants})
        </button>
      ) : (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-orange-500 to-red-500 text-white
            transition-all duration-300 transform hover:scale-105
            shadow-lg shadow-orange-500/30"
        >
          <RotateCcw className="w-5 h-5" />
          Nueva ronda
        </button>
      )}

      {!revealed && (
        <div className="text-white/60 text-sm">
          {allVoted ? (
            <span className="text-green-400">✓ Todos han votado</span>
          ) : (
            <span>Esperando votos...</span>
          )}
        </div>
      )}
    </div>
  );
}
