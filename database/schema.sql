-- =====================================================
-- ACUCLINIC PRO v1.0 - SCHEMA COMPLETO
-- Clínica Tayamiti - Elena
-- Gerado: 2026-02-15
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PACIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados Pessoais
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  data_nascimento DATE,
  sexo VARCHAR(20), -- masculino, feminino, outro
  telefone VARCHAR(20),
  email VARCHAR(255),
  
  -- Endereço
  endereco_rua VARCHAR(255),
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(100),
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  endereco_cep VARCHAR(10),
  
  -- Informações Clínicas Básicas
  queixa_principal TEXT,
  observacoes TEXT,
  alergias TEXT,
  medicamentos_uso TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'ativo', -- ativo, inativo, arquivado
  consentimento_lgpd BOOLEAN DEFAULT false,
  consentimento_lgpd_data TIMESTAMPTZ,
  consentimento_gravacao BOOLEAN DEFAULT false,
  consentimento_gravacao_data TIMESTAMPTZ,
  
  -- Foto
  foto_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. ANAMNESES (Ficha MTC)
-- =====================================================
CREATE TABLE IF NOT EXISTS anamneses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  versao INTEGER DEFAULT 1,
  
  -- Queixa Principal
  queixa_principal TEXT,
  queixa_inicio TEXT,
  queixa_fatores_melhora TEXT,
  queixa_fatores_piora TEXT,
  queixa_caracteristicas TEXT,
  
  -- História Pregressa
  doencas_previas TEXT,
  cirurgias TEXT,
  acidentes_traumas TEXT,
  historico_familiar TEXT,
  
  -- Hábitos de Vida
  sono_qualidade VARCHAR(50),
  sono_horario TEXT,
  sono_observacoes TEXT,
  alimentacao TEXT,
  hidratacao TEXT,
  exercicios TEXT,
  tabagismo BOOLEAN DEFAULT false,
  etilismo BOOLEAN DEFAULT false,
  outras_substancias TEXT,
  
  -- Emoções (MTC)
  emocoes_predominantes TEXT, -- raiva, alegria, preocupação, tristeza, medo
  estado_emocional_atual TEXT,
  
  -- Diagnóstico MTC
  pulso_esquerdo TEXT,
  pulso_direito TEXT,
  lingua_cor TEXT,
  lingua_saburra TEXT,
  lingua_forma TEXT,
  lingua_observacoes TEXT,
  padrao_mtc TEXT, -- Ex: Estagnação de Qi do Fígado
  
  -- Cinco Elementos
  elemento_predominante VARCHAR(20), -- madeira, fogo, terra, metal, agua
  
  -- Sistemas
  sistema_digestivo TEXT,
  sistema_respiratorio TEXT,
  sistema_cardiovascular TEXT,
  sistema_urinario TEXT,
  sistema_reprodutor TEXT,
  sistema_musculoesqueletico TEXT,
  sistema_neurologico TEXT,
  
  -- Mulheres
  menstruacao_regularidade TEXT,
  menstruacao_ciclo TEXT,
  menstruacao_fluxo TEXT,
  menstruacao_dor TEXT,
  gestacoes INTEGER,
  partos INTEGER,
  
  -- Observações Gerais
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. AGENDAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
  
  -- Se for paciente novo (sem cadastro ainda)
  nome_paciente VARCHAR(255),
  telefone_paciente VARCHAR(20),
  
  -- Horário
  data_hora TIMESTAMPTZ NOT NULL,
  duracao_minutos INTEGER DEFAULT 60,
  
  -- Status
  status VARCHAR(20) DEFAULT 'agendado', -- agendado, confirmado, realizado, cancelado, faltou
  
  -- Tipo
  tipo VARCHAR(50) DEFAULT 'sessao', -- sessao, retorno, avaliacao, primeira_consulta
  
  -- Observações
  observacoes TEXT,
  
  -- Lembretes
  lembrete_enviado BOOLEAN DEFAULT false,
  lembrete_enviado_em TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. SESSOES (Atendimentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  agendamento_id UUID REFERENCES agendamentos(id) ON DELETE SET NULL,
  
  -- Numeração
  numero_sessao INTEGER NOT NULL,
  
  -- Horário
  data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duracao_minutos INTEGER,
  
  -- Avaliação Pré-Sessão
  queixa_do_dia TEXT,
  dor_pre INTEGER CHECK (dor_pre >= 0 AND dor_pre <= 10),
  observacoes_pre TEXT,
  
  -- Diagnóstico MTC da Sessão
  pulso TEXT,
  lingua TEXT,
  padrao_mtc TEXT,
  
  -- Tratamento
  principio_tratamento TEXT,
  pontos_utilizados TEXT[], -- Array de pontos: ["IG4", "F3", "E36"]
  tecnicas TEXT[], -- Array: ["agulhamento", "moxa", "ventosa"]
  tempo_retencao INTEGER, -- minutos
  observacoes_tratamento TEXT,
  
  -- Avaliação Pós-Sessão
  dor_pos INTEGER CHECK (dor_pos >= 0 AND dor_pos <= 10),
  resposta_paciente TEXT,
  intercorrencias TEXT,
  
  -- Orientações
  orientacoes TEXT,
  proximos_passos TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'realizada', -- realizada, cancelada, parcial
  
  -- Vinculo com gravação (se houver)
  gravacao_id UUID,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. GRAVACOES (AcuRecord)
-- =====================================================
CREATE TABLE IF NOT EXISTS gravacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  sessao_id UUID REFERENCES sessoes(id) ON DELETE SET NULL,
  
  -- Áudio
  audio_url TEXT,
  audio_duracao_segundos INTEGER,
  audio_tamanho_bytes BIGINT,
  audio_formato VARCHAR(20) DEFAULT 'webm',
  
  -- Transcrição
  transcricao_status VARCHAR(20) DEFAULT 'pendente', -- pendente, processando, concluida, erro
  transcricao_completa TEXT,
  transcricao_segmentos JSONB, -- [{start, end, text}]
  
  -- Relatório IA
  relatorio_status VARCHAR(20) DEFAULT 'pendente', -- pendente, processando, concluido, erro
  relatorio_resumo TEXT,
  relatorio_queixas JSONB, -- {principal, secundarias[], detalhes}
  relatorio_diagnostico JSONB, -- {padrao_mtc, pulso, lingua, observacoes}
  relatorio_tratamento JSONB, -- {principio, pontos[], tecnicas[], tempo, observacoes}
  relatorio_evolucao JSONB, -- {comparacao, melhoras, pioras, observacoes}
  relatorio_orientacoes TEXT,
  relatorio_proximos_passos TEXT,
  relatorio_dor_pre INTEGER,
  relatorio_dor_pos INTEGER,
  relatorio_alertas TEXT,
  relatorio_pdf_url TEXT,
  
  -- Revisão
  revisado BOOLEAN DEFAULT false,
  revisado_em TIMESTAMPTZ,
  
  -- Marcadores durante gravação
  marcadores JSONB, -- [{timestamp, nota}]
  notas_gravacao TEXT,
  
  -- Erros
  erro_detalhe TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vincular sessão à gravação
ALTER TABLE sessoes 
ADD CONSTRAINT fk_sessao_gravacao 
FOREIGN KEY (gravacao_id) REFERENCES gravacoes(id) ON DELETE SET NULL;

-- =====================================================
-- 6. PAGAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  sessao_id UUID REFERENCES sessoes(id) ON DELETE SET NULL,
  
  -- Valor
  valor DECIMAL(10,2) NOT NULL,
  
  -- Forma de Pagamento
  forma_pagamento VARCHAR(50) NOT NULL, -- pix, dinheiro, cartao_credito, cartao_debito, transferencia
  
  -- Status
  status VARCHAR(20) DEFAULT 'pago', -- pago, pendente, cancelado
  
  -- Data
  data_pagamento DATE DEFAULT CURRENT_DATE,
  
  -- Observações
  descricao TEXT,
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. RECEITUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS receituarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  sessao_id UUID REFERENCES sessoes(id) ON DELETE SET NULL,
  
  -- Numeração
  numero INTEGER NOT NULL,
  
  -- Conteúdo
  formulas JSONB NOT NULL, -- [{nome, composicao, posologia}]
  orientacoes TEXT,
  validade_dias INTEGER DEFAULT 30,
  
  -- PDF
  pdf_url TEXT,
  
  -- Status
  enviado_email BOOLEAN DEFAULT false,
  enviado_email_em TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. CHAT_HISTORICO (Contexto do AcuBot)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_historico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identificação
  chat_id VARCHAR(100) NOT NULL, -- ID do Telegram ou sessão web
  
  -- Mensagem
  role VARCHAR(20) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  
  -- Metadados
  metadata JSONB, -- {tool_calls, tokens_used, etc}
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. CONFIGURACOES
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descricao TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
('clinica_nome', '"Clínica Tayamiti"', 'Nome da clínica'),
('clinica_endereco', '""', 'Endereço completo'),
('clinica_telefone', '""', 'Telefone'),
('clinica_email', '"mamaemetodica@gmail.com"', 'Email'),
('profissional_nome', '"Elena"', 'Nome da profissional'),
('profissional_registro', '""', 'Registro profissional'),
('acurecord_qualidade', '"media"', 'Qualidade do áudio: baixa, media, alta'),
('acurecord_auto_sessao', 'true', 'Criar sessão automaticamente após relatório'),
('horario_funcionamento', '{"seg": "08:00-18:00", "ter": "08:00-18:00", "qua": "08:00-18:00", "qui": "08:00-18:00", "sex": "08:00-18:00"}', 'Horários de funcionamento'),
('duracao_sessao_padrao', '60', 'Duração padrão de sessão em minutos'),
('valor_sessao_padrao', '200', 'Valor padrão da sessão')
ON CONFLICT (chave) DO NOTHING;

-- =====================================================
-- 10. FORMULAS_MTC (Banco de fórmulas clássicas)
-- =====================================================
CREATE TABLE IF NOT EXISTS formulas_mtc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  nome VARCHAR(255) NOT NULL,
  nome_pinyin VARCHAR(255),
  nome_chines VARCHAR(255),
  
  composicao TEXT, -- Ervas e quantidades
  acoes TEXT, -- Ações da fórmula
  indicacoes TEXT, -- Indicações clínicas
  padrao_mtc TEXT, -- Padrões que trata
  
  contraindicacoes TEXT,
  modificacoes TEXT,
  
  categoria VARCHAR(100), -- tonificante, dispersante, etc
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir algumas fórmulas básicas
INSERT INTO formulas_mtc (nome, nome_pinyin, acoes, indicacoes, padrao_mtc, categoria) VALUES
('Seis Sabores com Rehmania', 'Liu Wei Di Huang Wan', 'Nutre o Yin do Rim', 'Deficiência de Yin do Rim, calor nos 5 centros, sudorese noturna', 'Deficiência de Yin do Rim', 'tonificante'),
('Decocção das Quatro Substâncias', 'Si Wu Tang', 'Nutre e ativa o Sangue', 'Deficiência de Sangue, menstruação irregular, pele seca', 'Deficiência de Sangue', 'tonificante'),
('Pílula para Relaxar o Fígado', 'Xiao Yao San', 'Move o Qi do Fígado, nutre Sangue', 'Estagnação de Qi do Fígado, irritabilidade, TPM', 'Estagnação de Qi do Fígado', 'dispersante'),
('Decocção dos Quatro Cavalheiros', 'Si Jun Zi Tang', 'Tonifica o Qi do Baço', 'Deficiência de Qi do Baço, fadiga, digestão fraca', 'Deficiência de Qi do Baço', 'tonificante'),
('Decocção para Tonificar o Centro', 'Bu Zhong Yi Qi Tang', 'Eleva o Qi, tonifica Baço e Estômago', 'Prolapsos, fadiga extrema, deficiência de Qi', 'Deficiência de Qi com afundamento', 'tonificante')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER trigger_pacientes_updated_at
  BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_anamneses_updated_at
  BEFORE UPDATE ON anamneses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_agendamentos_updated_at
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_sessoes_updated_at
  BEFORE UPDATE ON sessoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_gravacoes_updated_at
  BEFORE UPDATE ON gravacoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_pagamentos_updated_at
  BEFORE UPDATE ON pagamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_receituarios_updated_at
  BEFORE UPDATE ON receituarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_configuracoes_updated_at
  BEFORE UPDATE ON configuracoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Função para auto-numerar sessões por paciente
CREATE OR REPLACE FUNCTION auto_numero_sessao()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(numero_sessao), 0) + 1
  INTO NEW.numero_sessao
  FROM sessoes
  WHERE paciente_id = NEW.paciente_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_numero_sessao
  BEFORE INSERT ON sessoes
  FOR EACH ROW
  WHEN (NEW.numero_sessao IS NULL)
  EXECUTE FUNCTION auto_numero_sessao();

-- Função para auto-numerar receituários
CREATE OR REPLACE FUNCTION auto_numero_receituario()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(numero), 0) + 1
  INTO NEW.numero
  FROM receituarios;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_numero_receituario
  BEFORE INSERT ON receituarios
  FOR EACH ROW
  WHEN (NEW.numero IS NULL)
  EXECUTE FUNCTION auto_numero_receituario();

-- Função para atualizar status do agendamento quando sessão é criada
CREATE OR REPLACE FUNCTION atualizar_status_agendamento()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.agendamento_id IS NOT NULL THEN
    UPDATE agendamentos
    SET status = 'realizado', updated_at = NOW()
    WHERE id = NEW.agendamento_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_status_agendamento
  AFTER INSERT ON sessoes
  FOR EACH ROW EXECUTE FUNCTION atualizar_status_agendamento();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: Pacientes com resumo
CREATE OR REPLACE VIEW vw_pacientes_resumo AS
SELECT 
  p.*,
  (SELECT COUNT(*) FROM sessoes s WHERE s.paciente_id = p.id) as total_sessoes,
  (SELECT MAX(data_hora) FROM sessoes s WHERE s.paciente_id = p.id) as ultima_sessao,
  (SELECT SUM(valor) FROM pagamentos pg WHERE pg.paciente_id = p.id AND pg.status = 'pago') as total_pago
FROM pacientes p
WHERE p.status = 'ativo';

-- View: Agenda de hoje
CREATE OR REPLACE VIEW vw_agenda_hoje AS
SELECT 
  a.*,
  p.nome as paciente_nome,
  p.telefone as paciente_telefone
FROM agendamentos a
LEFT JOIN pacientes p ON a.paciente_id = p.id
WHERE DATE(a.data_hora) = CURRENT_DATE
ORDER BY a.data_hora;

-- View: Gravações pendentes de processamento
CREATE OR REPLACE VIEW vw_gravacoes_pendentes AS
SELECT g.*, p.nome as paciente_nome
FROM gravacoes g
JOIN pacientes p ON g.paciente_id = p.id
WHERE g.transcricao_status IN ('pendente', 'processando', 'erro')
   OR g.relatorio_status IN ('pendente', 'processando', 'erro');

-- =====================================================
-- STORAGE BUCKETS (executar via Dashboard ou API)
-- =====================================================
-- Nota: Criar manualmente no Dashboard do Supabase:
-- 1. audios - Para gravações das sessões
-- 2. documentos - Para PDFs (receituários, relatórios)
-- 3. fotos - Para fotos de pacientes (opcional)

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Para uso pessoal, RLS simples (ou desabilitado)
-- Se quiser multi-usuário no futuro, expandir aqui

ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gravacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE receituarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas_mtc ENABLE ROW LEVEL SECURITY;

-- Policies permissivas (uso pessoal - acesso total)
CREATE POLICY "Acesso total pacientes" ON pacientes FOR ALL USING (true);
CREATE POLICY "Acesso total anamneses" ON anamneses FOR ALL USING (true);
CREATE POLICY "Acesso total agendamentos" ON agendamentos FOR ALL USING (true);
CREATE POLICY "Acesso total sessoes" ON sessoes FOR ALL USING (true);
CREATE POLICY "Acesso total gravacoes" ON gravacoes FOR ALL USING (true);
CREATE POLICY "Acesso total pagamentos" ON pagamentos FOR ALL USING (true);
CREATE POLICY "Acesso total receituarios" ON receituarios FOR ALL USING (true);
CREATE POLICY "Acesso total chat_historico" ON chat_historico FOR ALL USING (true);
CREATE POLICY "Acesso total configuracoes" ON configuracoes FOR ALL USING (true);
CREATE POLICY "Acesso total formulas_mtc" ON formulas_mtc FOR ALL USING (true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_pacientes_nome ON pacientes(nome);
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes(status);

CREATE INDEX IF NOT EXISTS idx_anamneses_paciente ON anamneses(paciente_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_hora);
CREATE INDEX IF NOT EXISTS idx_agendamentos_paciente ON agendamentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);

CREATE INDEX IF NOT EXISTS idx_sessoes_paciente ON sessoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_data ON sessoes(data_hora);

CREATE INDEX IF NOT EXISTS idx_gravacoes_paciente ON gravacoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_gravacoes_status_transcricao ON gravacoes(transcricao_status);
CREATE INDEX IF NOT EXISTS idx_gravacoes_status_relatorio ON gravacoes(relatorio_status);

CREATE INDEX IF NOT EXISTS idx_pagamentos_paciente ON pagamentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON pagamentos(data_pagamento);

CREATE INDEX IF NOT EXISTS idx_chat_historico_chat ON chat_historico(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_historico_created ON chat_historico(created_at);

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
