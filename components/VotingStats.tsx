'use client';

import { Participant } from '@/lib/types';
import { calculateStats } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface VotingStatsProps {
  participants: Participant[];
  revealed: boolean;
}

export default function VotingStats({
  participants,
  revealed,
}: VotingStatsProps) {
  if (!revealed) return null;

  const votes = participants.map((p) => p.vote);
  const stats = calculateStats(votes);

  const validVotes = votes.filter(
    (v): v is string => v !== null && v !== '?' && v !== '☕',
  );

  if (validVotes.length === 0) {
    return (
      <div className="glass p-6 text-center">
        <p className="text-white/60">
          No hay votos numéricos para mostrar estadísticas
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-6 animate-slide-in">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-400" />
        Resultados de la votación
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Average */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">
            {stats.average}
          </div>
          <div className="text-white/60 text-sm mt-1">Promedio</div>
        </div>

        {/* Min */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400 flex items-center justify-center gap-1">
            <TrendingDown className="w-5 h-5" />
            {stats.min}
          </div>
          <div className="text-white/60 text-sm mt-1">Mínimo</div>
        </div>

        {/* Max */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-400 flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5" />
            {stats.max}
          </div>
          <div className="text-white/60 text-sm mt-1">Máximo</div>
        </div>

        {/* Consensus */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div
            className={`text-3xl font-bold ${
              stats.consensus ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {stats.consensus ? (
              <Award className="w-8 h-8 mx-auto" />
            ) : (
              <span>{stats.max - stats.min}</span>
            )}
          </div>
          <div className="text-white/60 text-sm mt-1">
            {stats.consensus ? '¡Consenso!' : 'Diferencia'}
          </div>
        </div>
      </div>

      {stats.consensus && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-center">
          <span className="text-green-400 font-medium">
            🎉 ¡El equipo llegó a un consenso con {stats.average} puntos!
          </span>
        </div>
      )}

      {!stats.consensus && stats.max - stats.min > 5 && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-center">
          <span className="text-yellow-400 font-medium">
            ⚠️ Hay una diferencia significativa. Considera discutir las
            estimaciones.
          </span>
        </div>
      )}
    </div>
  );
}
