'use client'

import { useEffect, useState } from 'react'
import { supabase, Agendamento, Paciente, Pagamento } from '@/lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const [agendaHoje, setAgendaHoje] = useState<Agendamento[]>([])
  const [totalPacientes, setTotalPacientes] = useState(0)
  const [totalSessoesMes, setTotalSessoesMes] = useState(0)
  const [receitaMes, setReceitaMes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Agenda de hoje
    const { data: agenda } = await supabase
      .from('agendamentos')
      .select('*, paciente:pacientes(nome)')
      .gte('data_hora', hoje)
      .lt('data_hora', hoje + 'T23:59:59')
      .order('data_hora')
    
    // Total pacientes
    const { count: pacientes } = await supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo')
    
    // Sessões do mês
    const inicioMes = new Date()
    inicioMes.setDate(1)
    const { count: sessoes } = await supabase
      .from('sessoes')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', inicioMes.toISOString())
    
    // Receita do mês
    const { data: pagamentos } = await supabase
      .from('pagamentos')
      .select('valor')
      .gte('data_pagamento', inicioMes.toISOString().split('T')[0])
      .eq('status', 'pago')
    
    setAgendaHoje(agenda || [])
    setTotalPacientes(pacientes || 0)
    setTotalSessoesMes(sessoes || 0)
    setReceitaMes(pagamentos?.reduce((sum, p) => sum + Number(p.valor), 0) || 0)
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Dashboard - {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Pacientes Ativos</p>
          <p className="text-3xl font-bold text-gray-800">{totalPacientes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Sessões este Mês</p>
          <p className="text-3xl font-bold text-blue-600">{totalSessoesMes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Agenda Hoje</p>
          <p className="text-3xl font-bold text-green-600">{agendaHoje.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Receita do Mês</p>
          <p className="text-3xl font-bold text-emerald-600">
            R$ {receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Agenda de Hoje */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">📅 Agenda de Hoje</h2>
        {agendaHoje.length === 0 ? (
          <p className="text-gray-500">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="space-y-3">
            {agendaHoje.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-mono font-medium text-gray-600">
                    {format(new Date(a.data_hora), 'HH:mm')}
                  </span>
                  <div>
                    <p className="font-medium">{(a.paciente as any)?.nome || a.nome_paciente || 'Paciente'}</p>
                    <p className="text-sm text-gray-500">{a.tipo} • {a.duracao_minutos}min</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  a.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                  a.status === 'agendado' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
