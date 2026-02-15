'use client'

import { useEffect, useState } from 'react'
import { supabase, Gravacao } from '@/lib/supabase'
import { format } from 'date-fns'
import Link from 'next/link'

export default function Gravacoes() {
  const [gravacoes, setGravacoes] = useState<Gravacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGravacoes()
  }, [])

  async function loadGravacoes() {
    const { data } = await supabase
      .from('gravacoes')
      .select('*, paciente:pacientes(nome)')
      .order('created_at', { ascending: false })
      .limit(50)
    
    setGravacoes(data || [])
    setLoading(false)
  }

  function formatDuracao(segundos: number) {
    const min = Math.floor(segundos / 60)
    const sec = segundos % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎙️ Gravações</h1>
        <Link href="/gravar" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          🔴 Nova Gravação
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-4">
            {gravacoes.map((g) => (
              <div key={g.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{(g.paciente as any)?.nome || 'Paciente'}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(g.created_at), 'dd/MM/yyyy HH:mm')} • 
                      {g.audio_duracao_segundos ? ` ${formatDuracao(g.audio_duracao_segundos)}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      g.transcricao_status === 'concluida' ? 'bg-green-100 text-green-700' :
                      g.transcricao_status === 'processando' ? 'bg-yellow-100 text-yellow-700' :
                      g.transcricao_status === 'erro' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Transcrição: {g.transcricao_status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      g.relatorio_status === 'concluido' ? 'bg-green-100 text-green-700' :
                      g.relatorio_status === 'processando' ? 'bg-yellow-100 text-yellow-700' :
                      g.relatorio_status === 'erro' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Relatório: {g.relatorio_status}
                    </span>
                  </div>
                </div>
                {g.relatorio_resumo && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{g.relatorio_resumo}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && gravacoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma gravação ainda.</p>
            <Link href="/gravar" className="text-blue-500 hover:text-blue-700">
              Fazer primeira gravação →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
