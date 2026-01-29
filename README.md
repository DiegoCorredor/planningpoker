# 🃏 Planning Poker

Aplicación de Planning Poker para equipos remotos, construida con Next.js y Pusher para comunicación en tiempo real.

![Planning Poker](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Pusher](https://img.shields.io/badge/Pusher-Realtime-purple?logo=pusher)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## ✨ Características

- 🎯 **Votación en tiempo real** - Los votos se sincronizan instantáneamente
- 👁️ **Votos ocultos** - Las estimaciones permanecen ocultas hasta que el moderador las revela
- 👑 **Control del moderador** - El host puede revelar votos e iniciar nuevas rondas
- 📊 **Estadísticas** - Promedio, mínimo, máximo y detección de consenso
- 🔗 **Compartir fácil** - Copia el link o código de sala para invitar al equipo
- 💾 **Memoria local** - Tu nombre se guarda en localStorage
- 📱 **Responsive** - Funciona en desktop, tablet y móvil

## 🚀 Inicio Rápido

### 1. Configurar Pusher

1. Ve a [pusher.com](https://pusher.com) y crea una cuenta gratuita
2. Crea una nueva app de tipo **Channels**
3. Ve a "App Keys" y copia las credenciales

### 2. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Pusher
```

```env
PUSHER_APP_ID=tu_app_id
PUSHER_SECRET=tu_secret
NEXT_PUBLIC_PUSHER_KEY=tu_key
NEXT_PUBLIC_PUSHER_CLUSTER=tu_cluster
```

### 3. Instalar y ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Deploy en Vercel

### Opción 1: Deploy automático

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/planning-poker)

### Opción 2: Deploy manual

1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Configura las variables de entorno en el dashboard de Vercel:
   - `PUSHER_APP_ID`
   - `PUSHER_SECRET`
   - `NEXT_PUBLIC_PUSHER_KEY`
   - `NEXT_PUBLIC_PUSHER_CLUSTER`

## 🎮 Cómo usar

### Crear una sala

1. Ingresa tu nombre
2. Click en "Crear nueva sala"
3. Comparte el código o link con tu equipo

### Unirse a una sala

1. Ingresa tu nombre
2. Click en "Unirse a una sala"
3. Ingresa el código de la sala
4. ¡Listo para votar!

### Flujo de votación

1. **Todos votan** - Cada participante selecciona una carta (Fibonacci: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89)
2. **Revelar** - El moderador revela los votos de todos
3. **Discutir** - Si hay diferencias significativas, discutan las estimaciones
4. **Nueva ronda** - El moderador inicia una nueva ronda para volver a votar

### Cartas especiales

- **?** - No estoy seguro / Necesito más información
- **☕** - Necesito un descanso

## 🛠️ Tecnologías

- **[Next.js 14](https://nextjs.org/)** - Framework de React con App Router
- **[Pusher Channels](https://pusher.com/channels)** - WebSockets para tiempo real
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos utility-first
- **[Lucide React](https://lucide.dev/)** - Íconos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático

## 📁 Estructura del proyecto

```
planningpoker/
├── app/
│   ├── api/
│   │   ├── pusher/auth/route.ts    # Autenticación de Pusher
│   │   └── room/events/route.ts    # Eventos de la sala
│   ├── room/[id]/page.tsx          # Página de la sala
│   ├── layout.tsx                   # Layout principal
│   ├── page.tsx                     # Página de inicio
│   └── globals.css                  # Estilos globales
├── components/
│   ├── HostControls.tsx            # Controles del moderador
│   ├── ParticipantCard.tsx         # Tarjeta de participante
│   ├── RoomHeader.tsx              # Header de la sala
│   ├── VotingCards.tsx             # Cartas de votación
│   └── VotingStats.tsx             # Estadísticas
├── lib/
│   ├── pusher-client.ts            # Cliente Pusher
│   ├── pusher-server.ts            # Servidor Pusher
│   ├── types.ts                     # Tipos TypeScript
│   └── utils.ts                     # Utilidades
└── ...
```

## 🔒 Seguridad

- Los canales de Pusher usan autenticación
- No se persisten datos en servidor (solo en memoria durante la sesión)
- Los nombres se guardan solo en localStorage del navegador

## 📝 Licencia

MIT - Usa este proyecto como quieras.

---

Hecho con ❤️ para equipos ágiles
