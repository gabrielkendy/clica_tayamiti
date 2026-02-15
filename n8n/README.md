# AcuBot - Workflows n8n

## Setup Inicial

### 1. Criar Credenciais no n8n

**Telegram Bot (AcuBot):**
- Nome: `AcuBot Telegram`
- Bot Token: `8473085181:AAENJggJEDaZ1zBtVZADEi_esAX5Hib4qSc`

**Supabase (Header Auth):**
- Nome: `Supabase AcuBot`
- Header Name: `apikey`
- Header Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbGdkaHZsZHlrY2djeWp3dWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzA0MzQsImV4cCI6MjA4Njc0NjQzNH0.Wssnx_FJz5FnaogOfpoLg8dK4rZv6zbRRpFkcBcf8rg`

**Anthropic (usar existente):**
- Já configurado no n8n do Kendy

### 2. Importar Workflow

1. Acesse: https://agenciabase.app.n8n.cloud
2. Clique em "Import from File"
3. Selecione `acubot-workflow.json`
4. Atualize as credenciais nos nodes
5. Ative o workflow

### 3. URLs Importantes

- **Supabase URL:** `https://gclgdhvldykcgcyjwuga.supabase.co`
- **REST API:** `https://gclgdhvldykcgcyjwuga.supabase.co/rest/v1/`

### 4. Endpoints Supabase

| Tabela | Endpoint |
|--------|----------|
| pacientes | `/rest/v1/pacientes` |
| anamneses | `/rest/v1/anamneses` |
| agendamentos | `/rest/v1/agendamentos` |
| sessoes | `/rest/v1/sessoes` |
| gravacoes | `/rest/v1/gravacoes` |
| pagamentos | `/rest/v1/pagamentos` |
| receituarios | `/rest/v1/receituarios` |
| chat_historico | `/rest/v1/chat_historico` |
| configuracoes | `/rest/v1/configuracoes` |
| formulas_mtc | `/rest/v1/formulas_mtc` |

### 5. Fluxo do AcuBot

```
Telegram Msg → Salvar Histórico → Buscar Contexto → Claude → Parse → Executar Ação → Responder
```

## Ações Disponíveis

| Ação | Descrição |
|------|-----------|
| `cadastrar_paciente` | Cadastra novo paciente |
| `buscar_paciente` | Busca por nome ou CPF |
| `atualizar_paciente` | Atualiza dados do paciente |
| `agendar_sessao` | Cria agendamento |
| `ver_agenda` | Lista agendamentos do dia/semana |
| `cancelar_agendamento` | Cancela agendamento |
| `registrar_sessao` | Registra atendimento realizado |
| `registrar_pagamento` | Registra pagamento |
| `historico_paciente` | Busca histórico completo |
| `gerar_receituario` | Gera receituário PDF |
| `resumo_dia` | Resumo do dia (agenda + financeiro) |
