'use client'

import { useEffect, useState } from 'react'
import { supabase, Pagamento } from '@/lib/supabase'
import { format } from 'date-fns'

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [totalMes, setTotalMes] = useState(0)

  useEffect(() => {
    loadPagamentos()
  }, [])

  async function loadPagamentos() {
    const { data } = await supabase
      .from('pagamentos')
      .select('*, paciente:pacientes(nome)')
      .order('data_pagamento', { ascending: false })
      .limit(50)

    setPagamentos(data || [])
    
    const total = (data || [])
      .filter(p => p.status === 'pago')
      .reduce((sum, p) => sum + Number(p.valor), 0)
    setTotalMes(total)
    
    setLoading(false)
  }

  const formaLabel: Record<string, string> = {
    pix: '💠 PIX',
    dinheiro: '💵 Dinheiro',
    cartao_credito: '💳 Crédito',
    cartao_debito: '💳 Débito',
    transferencia: '🏦 Transferência'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">💰 Pagamentos</h1>
        <div className="bg-emerald-100 px-6 py-3 rounded-lg">
          <p className="text-sm text-emerald-600">Total Recebido</p>
          <p className="text-2xl font-bold text-emerald-700">
            R$ {totalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="pb-3">Data</th>
                <th className="pb-3">Paciente</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Forma</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 text-gray-600">
                    {format(new Date(p.data_pagamento), 'dd/MM/yyyy')}
                  </td>
                  <td className="py-4 font-medium">
                    {(p.paciente as any)?.nome || '-'}
                  </td>
                  <td className="py-4 font-medium text-emerald-600">
                    R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4">
                    {formaLabel[p.forma_pagamento] || p.forma_pagamento}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.status === 'pago' ? 'bg-green-100 text-green-700' :
                      p.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && pagamentos.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum pagamento registrado.</p>
        )}
      </div>
    </div>
  )
}
