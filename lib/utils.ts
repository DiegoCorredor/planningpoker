import { nanoid } from 'nanoid';

// Generar ID único para salas
export const generateRoomId = (): string => {
  return nanoid(8);
};

// Generar ID único para participantes
export const generateParticipantId = (): string => {
  return nanoid(12);
};

// Calcular estadísticas de votación
export const calculateStats = (votes: (string | null)[]) => {
  const validVotes = votes
    .filter((v): v is string => v !== null && v !== '?' && v !== '☕')
    .map(Number)
    .filter((n) => !isNaN(n));

  if (validVotes.length === 0) {
    return { average: 0, min: 0, max: 0, consensus: false };
  }

  const sum = validVotes.reduce((a, b) => a + b, 0);
  const average = sum / validVotes.length;
  const min = Math.min(...validVotes);
  const max = Math.max(...validVotes);
  const consensus = min === max;

  return {
    average: Math.round(average * 10) / 10,
    min,
    max,
    consensus,
  };
};

// Guardar nombre en localStorage
export const saveName = (name: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('planning-poker-name', name);
  }
};

// Obtener nombre de localStorage
export const getSavedName = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('planning-poker-name');
  }
  return null;
};

// Guardar ID de participante en localStorage
export const saveParticipantId = (id: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('planning-poker-participant-id', id);
  }
};

// Obtener ID de participante de localStorage
export const getSavedParticipantId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('planning-poker-participant-id');
  }
  return null;
};
