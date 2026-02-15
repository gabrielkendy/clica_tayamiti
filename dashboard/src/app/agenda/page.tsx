'use client'

import { useEffect, useState } from 'react'
import { supabase, Agendamento } from '@/lib/supabase'
import { format, addDays, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [semanaAtual, setSemanaAtual] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAgendamentos()
  }, [semanaAtual])

  async function loadAgendamentos() {
    const inicio = semanaAtual.toISOString()
    const fim = addDays(semanaAtual, 7).toISOString()

    const { data } = await supabase
      .from('agendamentos')
      .select('*, paciente:pacientes(nome)')
      .gte('data_hora', inicio)
      .lt('data_hora', fim)
      .order('data_hora')

    setAgendamentos(data || [])
    setLoading(false)
  }

  const dias = Array.from({ length: 6 }, (_, i) => addDays(semanaAtual, i))

  function getAgendamentosDia(dia: Date) {
    const diaStr = format(dia, 'yyyy-MM-dd')
    return agendamentos.filter(a => a.data_hora.startsWith(diaStr))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📅 Agenda</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSemanaAtual(addDays(semanaAtual, -7))}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setSemanaAtual(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Hoje
          </button>
          <button
            onClick={() => setSemanaAtual(addDays(semanaAtual, 7))}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Próxima →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {dias.map((dia) => (
              <div key={dia.toISOString()} className="border rounded-lg p-3">
                <div className="text-center mb-3 pb-2 border-b">
                  <p className="text-sm text-gray-500">{format(dia, 'EEE', { locale: ptBR })}</p>
                  <p className="text-lg font-bold">{format(dia, 'd')}</p>
                </div>
                <div className="space-y-2">
                  {getAgendamentosDia(dia).map((a) => (
                    <div
                      key={a.id}
                      className={`p-2 rounded text-sm ${
                        a.status === 'confirmado' ? 'bg-green-100' :
                        a.status === 'cancelado' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}
                    >
                      <p className="font-medium">{format(new Date(a.data_hora), 'HH:mm')}</p>
                      <p className="text-xs truncate">{(a.paciente as any)?.nome || a.nome_paciente}</p>
                    </div>
                  ))}
                  {getAgendamentosDia(dia).length === 0 && (
                    <p className="text-xs text-gray-400 text-center">-</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
