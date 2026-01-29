'use client';

import PusherClient from 'pusher-js';

// Cliente Pusher - se crea nuevo por cada sesión para evitar problemas de auth
let pusherClient: PusherClient | null = null;
let currentAuthParams: string = '';

export const getPusherClient = (authParams?: Record<string, string>) => {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    throw new Error(
      'Faltan las variables de entorno de Pusher. Asegúrate de tener NEXT_PUBLIC_PUSHER_KEY y NEXT_PUBLIC_PUSHER_CLUSTER en .env.local',
    );
  }

  // Habilitar logs en desarrollo para debugging
  if (process.env.NODE_ENV === 'development') {
    PusherClient.logToConsole = true;
  }

  const authParamsString = authParams ? JSON.stringify(authParams) : '';

  // Si los parámetros de auth cambiaron, desconectar y crear nueva instancia
  if (pusherClient && authParamsString !== currentAuthParams) {
    console.log('Auth params changed, reconnecting...');
    pusherClient.disconnect();
    pusherClient = null;
  }

  if (!pusherClient) {
    currentAuthParams = authParamsString;

    pusherClient = new PusherClient(key, {
      cluster: cluster,
      authEndpoint: '/api/pusher/auth',
      auth: authParams ? { params: authParams } : undefined,
    });
  }

  return pusherClient;
};

// Función para reiniciar el cliente (útil cuando cambia el usuario)
export const resetPusherClient = () => {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
    currentAuthParams = '';
  }
};
