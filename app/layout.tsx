import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bot Reports',
  description: 'Trading bot performance dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#001D35] min-h-screen text-white antialiased">
        <header className="border-b border-[#26CFD8]/20 px-6 py-4 flex items-center gap-3">
          <Image src="/DVShark.svg" alt="DVShark" width={42} height={42} className="rounded-lg" />
          <div>
            <h1 className="text-white text-lg font-bold tracking-tight leading-none">Bot Reports</h1>
            <p className="text-[#26CFD8] text-xs mt-0.5">Trading performance dashboard</p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
