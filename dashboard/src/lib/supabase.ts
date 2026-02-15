import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gclgdhvldykcgcyjwuga.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbGdkaHZsZHlrY2djeWp3dWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzA0MzQsImV4cCI6MjA4Njc0NjQzNH0.Wssnx_FJz5FnaogOfpoLg8dK4rZv6zbRRpFkcBcf8rg'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface Paciente {
  id: string
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  data_nascimento?: string
  queixa_principal?: string
  status: string
  created_at: string
}

export interface Agendamento {
  id: string
  paciente_id?: string
  nome_paciente?: string
  data_hora: string
  duracao_minutos: number
  status: string
  tipo: string
  paciente?: Paciente
}

export interface Sessao {
  id: string
  paciente_id: string
  numero_sessao: number
  data_hora: string
  pontos_utilizados?: string[]
  dor_pre?: number
  dor_pos?: number
  paciente?: Paciente
}

export interface Gravacao {
  id: string
  paciente_id: string
  audio_url?: string
  audio_duracao_segundos?: number
  transcricao_status: string
  relatorio_status: string
  relatorio_resumo?: string
  created_at: string
  paciente?: Paciente
}

export interface Pagamento {
  id: string
  paciente_id: string
  valor: number
  forma_pagamento: string
  status: string
  data_pagamento: string
  paciente?: Paciente
}
