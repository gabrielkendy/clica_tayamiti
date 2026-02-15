import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AcuClinic Pro - Clínica Tayamiti",
  description: "Sistema de gestão para clínica de acupuntura",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm">
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-800">🏥 AcuClinic</h1>
              <p className="text-sm text-gray-500">Clínica Tayamiti</p>
            </div>
            <nav className="px-4 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                📊 Dashboard
              </Link>
              <Link href="/pacientes" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                📋 Pacientes
              </Link>
              <Link href="/agenda" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                📅 Agenda
              </Link>
              <Link href="/gravacoes" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                🎙️ Gravações
              </Link>
              <Link href="/pagamentos" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                💰 Pagamentos
              </Link>
              <Link href="/gravar" className="flex items-center gap-3 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4">
                🔴 Nova Gravação
              </Link>
            </nav>
          </aside>
          
          {/* Main content */}
          <main className="ml-64 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
