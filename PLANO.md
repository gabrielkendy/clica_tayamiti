# ACUCLINIC PRO v1.0 - COMPLETO

## URLS DE PRODUÇÃO

| Item | URL |
|------|-----|
| **Dashboard** | https://dashboard-swart-nine-86.vercel.app |
| **Bot Telegram** | @clinicatayamiti_bot |
| **Supabase** | https://supabase.com/dashboard/project/gclgdhvldykcgcyjwuga |
| **GitHub** | https://github.com/gabrielkendy/clica_tayamiti |

---

## FASES COMPLETADAS

### ✅ FASE 0: Infraestrutura
- Workspace isolado: `agents/acubot/`
- Arquivos: SOUL.md, USER.md, TOOLS.md, AGENTS.md, MEMORY.md

### ✅ FASE 1: Banco de Dados
- 10 tabelas: pacientes, anamneses, agendamentos, sessoes, gravacoes, pagamentos, receituarios, chat_historico, configuracoes, formulas_mtc
- Triggers automáticos
- Views úteis
- Fórmulas MTC básicas

### ✅ FASE 2: AcuBot
- Workflow Final: kNY7qRHUTiHdmRFR
- Integração Claude Sonnet
- Webhook: acubot-final

### ✅ FASE 3: AcuRecord
- Frontend gravação: frontend/index.html
- Dashboard integrado: /gravar

### ✅ FASE 4: Receituário
- Workflow: 5GOZGiLJYXKBSvp9
- Geração HTML automática
- Webhook: receituario-gen

### ✅ FASE 5: Dashboard Web
- Next.js 14 + Tailwind
- 6 páginas: Dashboard, Pacientes, Agenda, Gravações, Gravar, Pagamentos
- Deploy Vercel

---

## WORKFLOWS N8N

| Nome | ID | Status |
|------|-----|--------|
| AcuBot Final | kNY7qRHUTiHdmRFR | ✅ Ativo |
| AcuBot Actions | L8j83XuWCdxLtDtm | ✅ Ativo |
| Receituario Generate | 5GOZGiLJYXKBSvp9 | ✅ Ativo |

---

## PENDÊNCIAS FINAIS

1. **Executar SQL de buckets** no Supabase:
   - Arquivo: `database/storage-buckets.sql`
   - URL: https://supabase.com/dashboard/project/gclgdhvldykcgcyjwuga/sql/new

2. **Testar bot** - Mandar mensagem pro @clinicatayamiti_bot

3. **Treinar Elena** no uso do sistema
