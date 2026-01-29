// Tipos para Planning Poker

export interface Participant {
  id: string;
  name: string;
  vote: string | null;
  isHost: boolean;
  joinedAt: number;
}

export interface Room {
  id: string;
  name: string;
  participants: Record<string, Participant>;
  revealed: boolean;
  currentRound: number;
  createdAt: number;
}

export interface VoteEvent {
  oderId: string;
  odeName: string;
  vote: string;
}

export interface RevealEvent {
  oderId: string;
  revealed: boolean;
}

export interface ResetEvent {
  oderId: string;
  round: number;
}

export interface JoinEvent {
  participant: Participant;
}

export interface LeaveEvent {
  participantId: string;
}

export interface SyncEvent {
  participants: Record<string, Participant>;
  revealed: boolean;
}

// Valores de las cartas de Fibonacci
export const CARD_VALUES = [
  '0',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '89',
  '?',
  '☕',
];

// Colores para los participantes
export const PARTICIPANT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
];

export const getParticipantColor = (index: number): string => {
  return PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length];
};
