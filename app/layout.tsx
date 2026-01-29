import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Planning Poker | Estimación Ágil en Equipo',
  description:
    'Herramienta de Planning Poker para equipos remotos. Estima historias de usuario de forma colaborativa.',
  keywords: ['planning poker', 'scrum', 'agile', 'estimación', 'equipo'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}
