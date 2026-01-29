'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, LogIn, Sparkles } from 'lucide-react';
import { generateRoomId, getSavedName, saveName } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedName = getSavedName();
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    setIsLoading(true);
    saveName(name.trim());
    const newRoomId = generateRoomId();
    router.push(
      `/room/${newRoomId}?name=${encodeURIComponent(name.trim())}&host=true`,
    );
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) return;
    setIsLoading(true);
    saveName(name.trim());
    router.push(
      `/room/${roomId.trim()}?name=${encodeURIComponent(name.trim())}`,
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-12 animate-slide-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Planning Poker
        </h1>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          Estima historias de usuario de forma colaborativa con tu equipo remoto
        </p>
      </div>

      {/* Main Card */}
      <div
        className="glass p-8 w-full max-w-md animate-slide-in"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Name Input - Always visible */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm font-medium mb-2">
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-purple-500 transition-colors"
            maxLength={20}
          />
        </div>

        {/* Mode Selection */}
        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full btn-primary flex items-center justify-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Crear nueva sala
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full btn-secondary flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Unirse a una sala
            </button>
          </div>
        )}

        {/* Create Room Mode */}
        {mode === 'create' && (
          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              disabled={!name.trim() || isLoading}
              className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Crear sala ahora
                </>
              )}
            </button>
            <button
              onClick={() => setMode(null)}
              className="w-full text-white/60 hover:text-white transition-colors py-2"
            >
              ← Volver
            </button>
          </div>
        )}

        {/* Join Room Mode */}
        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Código de sala
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Ej: AbC123xY"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-purple-500 transition-colors"
                maxLength={10}
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={!name.trim() || !roomId.trim() || isLoading}
              className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Unirse a la sala
                </>
              )}
            </button>
            <button
              onClick={() => setMode(null)}
              className="w-full text-white/60 hover:text-white transition-colors py-2"
            >
              ← Volver
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="mt-12 text-white/40 text-sm animate-slide-in"
        style={{ animationDelay: '0.2s' }}
      >
        <p>Hecho con ❤️ para equipos ágiles</p>
      </footer>
    </main>
  );
}
