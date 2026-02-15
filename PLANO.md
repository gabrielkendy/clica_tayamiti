# PLANO DE EXECUÇÃO - AcuClinic Pro v1.0

## STATUS GERAL
- **Início:** 2026-02-15 15:52
- **Cliente:** Elena (mãe do Kendy)
- **Bot:** @clinicatayamiti_bot

---

## FASE 0: INFRAESTRUTURA ✅ COMPLETO
- [x] 0.1 Criar workspace `agents/acubot/`
- [x] 0.2 Criar SOUL.md (persona AcuBot)
- [x] 0.3 Criar USER.md (info Elena)
- [x] 0.4 Criar TOOLS.md (credenciais)
- [x] 0.5 Criar AGENTS.md
- [x] 0.6 Criar MEMORY.md
- [x] 0.7 Inicializar repositório GitHub
- [x] 0.8 Push inicial

---

## FASE 1: BANCO DE DADOS ✅ COMPLETO
- [x] 1.1 Obter credenciais Supabase
- [x] 1.2 Criar schema SQL completo
- [x] 1.3 Executar schema no Supabase
- [x] 1.4 Verificar tabelas criadas
- [x] 1.5 Verificar configurações inseridas
- [ ] 1.6 Criar Storage Buckets (audios, documentos, fotos)

---

## FASE 2: ACUBOT CORE ⏳ EM ANDAMENTO
- [x] 2.1 Criar credencial Telegram no n8n
- [x] 2.2 Criar credencial Supabase no n8n
- [x] 2.3 Criar workflow básico
- [x] 2.4 Ativar workflow
- [ ] 2.5 Testar bot (enviar mensagem)
- [ ] 2.6 Verificar se salva histórico no banco
- [ ] 2.7 Implementar ação: cadastrar_paciente
- [ ] 2.8 Implementar ação: buscar_paciente
- [ ] 2.9 Implementar ação: agendar
- [ ] 2.10 Implementar ação: ver_agenda
- [ ] 2.11 Implementar ação: registrar_sessao
- [ ] 2.12 Implementar ação: registrar_pagamento
- [ ] 2.13 Implementar ação: historico_paciente
- [ ] 2.14 Implementar ação: resumo_dia
- [ ] 2.15 Testar todas as ações
- [ ] 2.16 Documentar comandos

---

## FASE 3: ACURECORD (GRAVAÇÃO)
- [ ] 3.1 Criar página web de gravação
- [ ] 3.2 Implementar MediaRecorder (captura áudio)
- [ ] 3.3 Implementar upload para Supabase Storage
- [ ] 3.4 Criar workflow n8n: processar áudio
- [ ] 3.5 Integrar Whisper API (transcrição)
- [ ] 3.6 Integrar Claude (gerar relatório)
- [ ] 3.7 Salvar transcrição e relatório no banco
- [ ] 3.8 Notificar via Telegram quando pronto
- [ ] 3.9 Testar fluxo completo

---

## FASE 4: RECEITUÁRIO
- [ ] 4.1 Criar template PDF receituário
- [ ] 4.2 Implementar geração de PDF
- [ ] 4.3 Salvar PDF no Storage
- [ ] 4.4 Integrar com AcuBot (comando gerar_receituario)
- [ ] 4.5 Implementar envio por email (opcional)
- [ ] 4.6 Testar geração

---

## FASE 5: DASHBOARD WEB
- [ ] 5.1 Criar projeto Next.js
- [ ] 5.2 Configurar Tailwind + shadcn/ui
- [ ] 5.3 Implementar autenticação Supabase
- [ ] 5.4 Criar layout base (sidebar, header)
- [ ] 5.5 Página: Dashboard (resumo do dia)
- [ ] 5.6 Página: Pacientes (lista + busca)
- [ ] 5.7 Página: Ficha do Paciente (dados + histórico)
- [ ] 5.8 Página: Agenda (calendário visual)
- [ ] 5.9 Página: Gravações (player + transcrição)
- [ ] 5.10 Página: Pagamentos (lista)
- [ ] 5.11 Deploy Vercel
- [ ] 5.12 Testar todas as páginas

---

## FASE 6: TESTES E GO-LIVE
- [ ] 6.1 Testar fluxo completo com dados reais
- [ ] 6.2 Ajustar prompts do AcuBot
- [ ] 6.3 Criar documentação de uso para Elena
- [ ] 6.4 Treinar Elena no uso do sistema
- [ ] 6.5 Go-live!

---

## CREDENCIAIS

### Telegram
- Bot: @clinicatayamiti_bot
- Token: 8473085181:AAENJggJEDaZ1zBtVZADEi_esAX5Hib4qSc
- n8n ID: 7kCDy7tdETcUqXmf

### Supabase
- Project: gclgdhvldykcgcyjwuga
- URL: https://gclgdhvldykcgcyjwuga.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- n8n ID: OKPiO5p00C3PUDNT

### n8n
- Workflow: rTGfrlnxW6MVL871
- URL: https://agenciabase.app.n8n.cloud/workflow/rTGfrlnxW6MVL871
