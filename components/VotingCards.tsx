'use client';

import { CARD_VALUES } from '@/lib/types';

interface VotingCardsProps {
  selectedVote: string | null;
  onVote: (value: string) => void;
  disabled: boolean;
}

export default function VotingCards({
  selectedVote,
  onVote,
  disabled,
}: VotingCardsProps) {
  return (
    <div className="w-full">
      <h3 className="text-white/80 text-sm font-medium mb-4 text-center">
        Selecciona tu estimación
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {CARD_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => onVote(value)}
            disabled={disabled}
            className={`
              w-14 h-20 sm:w-16 sm:h-24 rounded-xl font-bold text-xl sm:text-2xl
              transition-all duration-300 transform
              ${
                selectedVote === value
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white scale-110 shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer card-hover'}
              border-2 ${selectedVote === value ? 'border-purple-400' : 'border-white/10'}
            `}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
