# TOOLS.md - Credenciais e Configurações

## Telegram Bot
- **Bot:** @clinicatayamiti_bot
- **Token:** 8473085181:AAENJggJEDaZ1zBtVZADEi_esAX5Hib4qSc
- **Usuária:** Elena (mamaemetodica@gmail.com)

## Supabase
- **Conta:** mamaemetodica@gmail.com
- **Project ID:** gclgdhvldykcgcyjwuga
- **Project URL:** https://gclgdhvldykcgcyjwuga.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/gclgdhvldykcgcyjwuga
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbGdkaHZsZHlrY2djeWp3dWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzA0MzQsImV4cCI6MjA4Njc0NjQzNH0.Wssnx_FJz5FnaogOfpoLg8dK4rZv6zbRRpFkcBcf8rg
- **Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbGdkaHZsZHlrY2djeWp3dWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzA0MzQsImV4cCI6MjA4Njc0NjQzNH0.Wssnx_FJz5FnaogOfpoLg8dK4rZv6zbRRpFkcBcf8rg

## APIs Necessárias
- **OpenAI Whisper:** Para transcrição de áudio (usar key do Kendy)
- **Claude API:** Via Clawdbot (compartilhado)

## Storage Buckets (a criar)
- `audios` - Gravações das sessões
- `documentos` - PDFs de receituários e relatórios
- `fotos` - Fotos de pacientes (opcional)

## n8n Workflows

### Ativos
- **AcuBot Clinica Tayamiti** - ID: OWvKWljjPDsc69T4 ✅
  - Telegram → Salvar → Histórico → Claude → Responder → Salvar
  - Webhook: https://agenciabase.app.n8n.cloud/webhook/acubot-full/webhook

- **AcuBot Actions** - ID: L8j83XuWCdxLtDtm ✅
  - Webhook para ações: cadastrar, buscar, agendar, sessão, pagamento
  - URL: https://agenciabase.app.n8n.cloud/webhook/acubot-action

### Credenciais n8n
- **AcuBot Telegram** - ID: 7kCDy7tdETcUqXmf
- **Supabase AcuBot** - ID: OKPiO5p00C3PUDNT

### Workflows Inativos
- rTGfrlnxW6MVL871 (MVP antigo)
- FI71DE6KRuDl36iz (minimal)

## Workflows Pendentes
- Processamento AcuRecord (áudio → transcrição → relatório)
- Geração de PDFs
- Lembretes de agenda
