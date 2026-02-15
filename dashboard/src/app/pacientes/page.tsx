'use client'

import { useEffect, useState } from 'react'
import { supabase, Paciente } from '@/lib/supabase'
import { format } from 'date-fns'

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPacientes()
  }, [])

  async function loadPacientes() {
    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('status', 'ativo')
      .order('nome')
    
    setPacientes(data || [])
    setLoading(false)
  }

  const filtrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.telefone?.includes(busca) ||
    p.cpf?.includes(busca)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📋 Pacientes</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          + Novo Paciente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="pb-3">Nome</th>
                <th className="pb-3">Telefone</th>
                <th className="pb-3">Queixa Principal</th>
                <th className="pb-3">Cadastro</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">{p.nome}</td>
                  <td className="py-4 text-gray-600">{p.telefone || '-'}</td>
                  <td className="py-4 text-gray-600">{p.queixa_principal || '-'}</td>
                  <td className="py-4 text-gray-500 text-sm">
                    {format(new Date(p.created_at), 'dd/MM/yyyy')}
                  </td>
                  <td className="py-4">
                    <button className="text-blue-500 hover:text-blue-700">Ver ficha</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtrados.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum paciente encontrado.</p>
        )}
      </div>
    </div>
  )
}
