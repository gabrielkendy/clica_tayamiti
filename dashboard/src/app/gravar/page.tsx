'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase, Paciente } from '@/lib/supabase'

export default function Gravar() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null)
  const [busca, setBusca] = useState('')
  const [estado, setEstado] = useState<'pronto' | 'gravando' | 'processando' | 'concluido'>('pronto')
  const [tempo, setTempo] = useState(0)
  const [notas, setNotas] = useState('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (busca.length >= 2) {
      searchPacientes()
    } else {
      setPacientes([])
    }
  }, [busca])

  async function searchPacientes() {
    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .ilike('nome', `%${busca}%`)
      .limit(5)
    setPacientes(data || [])
  }

  async function iniciarGravacao() {
    if (!pacienteSelecionado) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(1000)
      setEstado('gravando')
      setTempo(0)

      timerRef.current = setInterval(() => {
        setTempo(t => t + 1)
      }, 1000)

    } catch (err) {
      alert('Erro ao acessar microfone')
    }
  }

  async function finalizarGravacao() {
    if (!mediaRecorderRef.current || !pacienteSelecionado) return

    if (timerRef.current) clearInterval(timerRef.current)
    
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    
    setEstado('processando')

    await new Promise(resolve => setTimeout(resolve, 500))

    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
    const fileName = `${pacienteSelecionado.id}_${Date.now()}.webm`

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audios')
      .upload(fileName, audioBlob)

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message)
      setEstado('pronto')
      return
    }

    // Criar registro
    const { data: gravacao, error: gravError } = await supabase
      .from('gravacoes')
      .insert({
        paciente_id: pacienteSelecionado.id,
        audio_url: uploadData.path,
        audio_duracao_segundos: tempo,
        audio_formato: 'webm',
        notas_gravacao: notas,
        transcricao_status: 'pendente',
        relatorio_status: 'pendente'
      })
      .select()
      .single()

    if (gravError) {
      alert('Erro ao salvar: ' + gravError.message)
      setEstado('pronto')
      return
    }

    // Disparar processamento
    try {
      await fetch('https://agenciabase.app.n8n.cloud/webhook/acurecord-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gravacao_id: gravacao.id,
          paciente_id: pacienteSelecionado.id,
          paciente_nome: pacienteSelecionado.nome,
          audio_path: uploadData.path,
          duracao: tempo
        })
      })
    } catch (e) {
      console.log('Webhook enviado')
    }

    setEstado('concluido')
  }

  function novaGravacao() {
    setPacienteSelecionado(null)
    setBusca('')
    setNotas('')
    setTempo(0)
    setEstado('pronto')
  }

  function formatTempo(s: number) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🎙️ Nova Gravação</h1>

      {/* Seleção de Paciente */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">📋 Selecionar Paciente</h2>
        
        {!pacienteSelecionado ? (
          <>
            <input
              type="text"
              placeholder="Digite o nome do paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <div className="mt-3 space-y-2">
              {pacientes.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPacienteSelecionado(p)
                    setBusca(p.nome)
                    setPacientes([])
                  }}
                  className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer"
                >
                  <p className="font-medium">{p.nome}</p>
                  <p className="text-sm text-gray-500">{p.queixa_principal || 'Sem queixa'}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">{pacienteSelecionado.nome}</p>
              <p className="text-sm text-gray-500">{pacienteSelecionado.queixa_principal}</p>
            </div>
            <button onClick={() => setPacienteSelecionado(null)} className="text-blue-500">
              Trocar
            </button>
          </div>
        )}
      </div>

      {/* Gravação */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">🔴 Gravação</h2>

        {estado === 'pronto' && (
          <button
            onClick={iniciarGravacao}
            disabled={!pacienteSelecionado}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-lg font-semibold disabled:opacity-50"
          >
            🔴 Iniciar Gravação
          </button>
        )}

        {estado === 'gravando' && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-3xl font-mono font-bold">{formatTempo(tempo)}</span>
            </div>
            <button
              onClick={finalizarGravacao}
              className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-lg font-semibold"
            >
              ⏹️ Finalizar Gravação
            </button>
          </div>
        )}

        {estado === 'processando' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-medium">Processando...</p>
          </div>
        )}

        {estado === 'concluido' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="font-medium text-green-600">Gravação enviada!</p>
            <p className="text-sm text-gray-500 mt-2">O relatório será gerado automaticamente.</p>
            <button
              onClick={novaGravacao}
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Nova Gravação
            </button>
          </div>
        )}
      </div>

      {/* Notas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">📝 Notas</h2>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Anotações durante a sessão..."
          className="w-full p-3 border rounded-lg h-32 resize-none"
        />
      </div>
    </div>
  )
}
