# Procedimento de Rastreamento e Solução de Problemas de Software
**PROC-SCM-002**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## 1. OBJETIVO

Estabelecer métodos e procedimentos padronizados para relatar, rastrear e solucionar problemas identificados no software de aceitação de produto.

## 2. ESCOPO

Aplica-se a todos os problemas:
- Bugs/defeitos no software
- Problemas de performance
- Vulnerabilidades de segurança  
- Incompatibilidades
- Comportamentos inesperados

## 3. CLASSIFICAÇÃO DE PROBLEMAS

### 3.1 Severidade

| Nível | Descrição | Tempo de Resposta | Resolução |
|-------|-----------|-------------------|-----------|
| **S1 - Crítico** | Sistema inoperante, perda de dados, vulnerabilidade crítica | 1h | 4h |
| **S2 - Alto** | Funcionalidade importante quebrada, workaround difícil | 4h | 24h |
| **S3 - Médio** | Funcionalidade com workaround disponível | 8h | 5 dias |
| **S4 - Baixo** | Problema cosmético, documentação | 24h | 15 dias |

### 3.2 Prioridade

| Prioridade | Quando Aplicar |
|------------|----------------|
| **P0** | Produção parada OU perda de dados OU segurança comprometida |
| **P1** | Funcionalidade crítica inoperante |
| **P2** | Impacto moderado com workaround |
| **P3** | Impacto baixo ou melhorias |

## 4. PROCESSO DE REPORTE

### 4.1 Canais de Reporte

**Interno (Equipe):**
- GitHub Issues
- Sistema de tickets interno
- E-mail: bugs@aerogestor.nep.com

**Usuários:**
- Formulário web no sistema
- E-mail de suporte
- Telefone de emergência (S1 apenas)

### 4.2 Template de Reporte de Bug

```markdown
# [TIPO] Título Descritivo do Problema

## Informações Básicas
**Severidade:** [ ] S1-Crítico [ ] S2-Alto [ ] S3-Médio [ ] S4-Baixo
**Prioridade:** [ ] P0  [ ] P1  [ ] P2  [ ] P3
**Ambiente:** [ ] Produção  [ ] Homologação  [ ] Desenvolvimento
**Reportado por:** [Nome]
**Data:** [DD/MM/AAAA HH:MM]

## Descrição
[Descrição clara e concisa do problema]

## Passos para Reproduzir
1. Passo 1
2. Passo 2
3. Passo 3

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que realmente acontece]

## Evidências
- Screenshots: [anexar]
- Logs: [colar ou anexar]
- Vídeo: [link se disponível]

## Informações do Sistema
**Versão do Software:** v1.0.0
**Navegador:** Chrome 120
**Sistema Operacional:** Windows 11
**Usuário Afetado:** [ID ou nome]

## Impacto
**Usuários Afetados:** [número]
**Operação Bloqueada:** [ ] Sim  [ ] Não
**Workaround Disponível:** [ ] Sim  [ ] Não
**Descrição do Workaround:** [se aplicável]

## Frequência
[ ] Sempre (100%)
[ ] Frequente (>50%)
[ ] Ocasional (10-50%)
[ ] Raro (<10%)

## Logs Relevantes
```
[Colar logs aqui]
```

## Informações Adicionais
[Qualquer outra informação relevante]
```

## 5. WORKFLOW DE RASTREAMENTO

### 5.1 Estados do Problema

```
┌──────────┐
│ NOVO     │ ← Issue criada
└────┬─────┘
     │
     ▼
┌──────────┐
│ TRIAGEM  │ ← Análise inicial (24h)
└────┬─────┘
     │
     ├─────► DUPLICADO → FECHADO
     ├─────► NÃO É BUG → FECHADO
     ├─────► INVÁLIDO → FECHADO
     │
     ▼
┌──────────┐
│ ABERTO   │ ← Confirmado
└────┬─────┘
     │
     ▼
┌──────────┐
│ ATRIBUÍDO│ ← Desenvolvedor designado
└────┬─────┘
     │
     ▼
┌──────────┐
│ EM PROGRESSO │ ← Desenvolvimento da correção
└────┬─────┘
     │
     ▼
┌──────────┐
│ RESOLVIDO│ ← Correção implementada
└────┬─────┘
     │
     ▼
┌──────────┐
│ EM TESTE │ ← QA validando
└────┬─────┘
     │
     ├─────► REABERTO → EM PROGRESSO (se falhar)
     │
     ▼
┌──────────┐
│ FECHADO  │ ← Validado e deployado
└──────────┘
```

### 5.2 Transições de Estado

| De | Para | Responsável | Condições |
|----|------|-------------|-----------|
| NOVO | TRIAGEM | Sistema | Automático |
| TRIAGEM | ABERTO | Triagem | Bug confirmado |
| TRIAGEM | DUPLICADO | Triagem | Já existe issue |
| TRIAGEM | NÃO É BUG | Triagem | Comportamento esperado |
| TRIAGEM | INVÁLIDO | Triagem | Informações insuficientes |
| ABERTO | ATRIBUÍDO | Tech Lead | Desenvolvedor designado |
| ATRIBUÍDO | EM PROGRESSO | Desenvolvedor | Iniciou trabalho |
| EM PROGRESSO | RESOLVIDO | Desenvolvedor | Correção completada + PR |
| RESOLVIDO | EM TESTE | QA | Teste iniciado |
| EM TESTE | FECHADO | QA | Testes passaram |
| EM TESTE | REABERTO | QA | Correção não funciona |
| REABERTO | EM PROGRESSO | Desenvolvedor | Retrabalhando |

## 6. PROCESSO DE TRIAGEM

### 6.1 Responsável
- Gerente de TI ou Tech Lead
- Executada diariamente
- SLA: 24 horas para primeira resposta

### 6.2 Atividades de Triagem

1. **Validar Informações**
   - Informações completas?
   - Passos de reprodução claros?
   - Evidências anexadas?
   - → Se não: solicitar mais informações (INVÁLIDO temporário)

2. **Verificar Duplicação**
   - Buscar issues similares
   - → Se duplicado: marcar como DUPLICADO e referenciar issue original

3. **Confirmar Bug**
   - Tentar reproduzir localmente
   - → Se não reproduz: solicitar mais detalhes
   - → Se comportamento esperado: marcar NÃO É BUG e explicar

4. **Avaliar Severidade e Prioridade**
   - Reclassificar se necessário
   - Considerar:
     - Número de usuários afetados
     - Impacto nos negócios
     - Workarounds disponíveis
     - Esforço estimado para correção

5. **Atribuir Responsável**
   - Designar desenvolvedor apropriado
   - Considerar expertise e carga de trabalho

6. **Notificar Stakeholders**
   - Reportador do bug
   - Gerência (se S1 ou P0)
   - Equipe de suporte

### 6.3 Registro deTriagem
```json
{
  "issue_id": "AERO-456",
  "triaged_at": "2026-02-09T09:00:00Z",
  "triaged_by": "tech.lead@nep.com",
  "classification": {
    "severity": "S2",
    "priority": "P1",
    "category": "backend/calculations"
  },
  "decision": "CONFIRMED",
  "assigned_to": "dev1@nep.com",
  "estimated_effort": "4h",
  "target_version": "v1.2.1",
  "notes": "Problema no cálculo de estoque, workaround: recalcular manualmente"
}
```

## 7. PROCESSO DE RESOLUÇÃO

### 7.1 Investigação

**Análise Inicial:**
- Reproduzir o problema
- Analisar logs de erro
- Identificar código relacionado
- Determinar causa raiz

**Análise de Impacto:**
- Módulos afetados
- Dados afetados
- Código relacionado
- Testes necessários

### 7.2 Desenvolvimento da Correção

**Boas Práticas:**
1. Criar branch específico: `fix/AERO-456-descricao`
2. Escrever teste que reproduz o bug
3. Implementar correção mínima necessária
4. Validar que te teste agora passa
5. Executar testes de regressão
6. Documentar a correção no código

**Commit Message:**
```
[FIX] #456: Corrigir cálculo de estoque disponível

Problema: O cálculo não considerava retiradas pendentes,
resultando em quantidades incorretas exibidas aos usuários.

Solução: Modificado método calculateAvailableStock() para
subtrair retiradas com status PENDING.

Testes:
- Adicionado teste unitário testCalculateStockWithPendingWithdrawals
- Verificados cenários edge case (estoque zero, multiplas retiradas)
- Executados testes de regressão no módulo de estoque

Impacto: Backend (StockService.java)

Refs: #456
```

### 7.3 Code Review de Correção

**Checklist do Revisor:**
- [ ] Correção resolve problema na causa raiz
- [ ] Não introduz novos problemas
- [ ] Teste específico incluído
- [ ] Testes de regressão passam
- [ ] Código limpo e compreensível
- [ ] Documentação atualizada
- [ ] Performance não degradada

### 7.4 Validação QA

**Teste de Regressão:**
```markdown
# Plano de Teste - AERO-456

## Cenário 1: Reproduzir Bug Original
- [ ] Seguir passos do reporte original
- [ ] Verificar que problema não ocorre mais

## Cenário 2: Casos Normais
- [ ] Teste com estoque positivo
- [ ] Teste com múltiplas retiradas
- [ ] Teste com estoque zerado

## Cenário 3: Edge Cases
- [ ] Estoque exatamente igual à retirada
- [ ] Múltiplas retiradas simultâneas
- [ ] Cancelamento de retirada

## Cenário 4: Regressão
- [ ] Cadastro de retirada continua funcionando
- [ ] Listagem de retiradas OK
- [ ] Relatórios de estoque OK
```

## 8. RASTREABILIDADE

### 8.1 Registro Permanente

Cada problema mantém histórico completo:

```json
{
  "issue": "AERO-456",
  "title": "Cálculo incorreto de estoque disponível",
  "created_at": "2026-02-08T14:30:00Z",
  "created_by": "user@nep.com",
  "severity": "S2",
  "priority": "P1",
  "environment": "production",
  "affected_version": "v1.0.0",
  "timeline": [
    {
      "timestamp": "2026-02-08T14:30:00Z",
      "action": "created",
      "by": "user@nep.com"
    },
    {
      "timestamp": "2026-02-09T09:00:00Z",
      "action": "triaged",
      "by": "tech.lead@nep.com",
      "details": "Confirmado, P1, atribuído para dev1"
    },
    {
      "timestamp": "2026-02-09T10:00:00Z",
      "action": "started",
      "by": "dev1@nep.com"
    },
    {
      "timestamp": "2026-02-09T14:00:00Z",
      "action": "fixed",
      "by": "dev1@nep.com",
      "commit": "abc123def",
      "pr": "https://github.com/.../pull/45"
    },
    {
      "timestamp": "2026-02-09T15:00:00Z",
      "action": "code_reviewed",
      "by": "tech.lead@nep.com",
      "approved": true
    },
    {
      "timestamp": "2026-02-09T16:00:00Z",
      "action": "tested",
      "by": "qa@nep.com",
      "passed": true
    },
    {
      "timestamp": "2026-02-10T10:00:00Z",
      "action": "deployed",
      "by": "devops@nep.com",
      "version": "v1.2.1",
      "environment": "production"
    },
    {
      "timestamp": "2026-02-10T10:30:00Z",
      "action": "verified",
      "by": "user@nep.com"
    },
    {
      "timestamp": "2026-02-10T10:35:00Z",
      "action": "closed",
      "by": "tech.lead@nep.com"
    }
  ],
  "metrics": {
    "time_to_triage": "18h 30m",
    "time_to_fix": "5h",
    "time_to_deploy": "20h",
    "total_resolution_time": "44h"
  },
  "resolution": {
    "type": "fixed",
    "description": "Corrigido cálculo para considerar retiradas pendentes",
    "fixed_in_version": "v1.2.1",
    "verification_steps": "Verificar tela de estoque após retirada"
  }
}
```

### 8.2 Relatórios e Métricas

**Relatório Semanal:**
- Issues abertas no período
- Issues resolvidas no período
- Tempo médio de resolução por severidade
- Taxa de reopen
- Top 5 categorias de problemas

**Dashboards:**
- Issues abertas vs fechadas (trend)
- Distribuição por severidade
- Distribuição por módulo
- SLA compliance
- Backlog aging

## 9. COMUNICAÇÃO

### 9.1 Notificações Automáticas

**Para Reportador:**
- Issue criada (confirmação)
- Issue triada (status e expectativa)
- Issue em progresso (desenvolvedor atribuído)
- Issue resolvida (solicitar verificação)
- Issue fechada (confirmação final)

**Para Equipe:**
- Issues S1/P0 criadas (broadcast)
- Issues atribuídas (notificação pessoal)
- Code review solicitado
- Deploy com correções

### 9.2 Comunicados Internos

Para problemas S1/P0:
```
URGENTE - AERO-456 - Sistema de Retiradas Inoperante

Severidade: S1 - Crítica
Prioridade: P0
Status: EM PROGRESSO

Descrição:
Sistema de retiradas retornando erro 500 ao tentar
salvar nova retirada. Usuários não conseguem registrar
movimentações de estoque.

Impacto:
- 25 usuários afetados
- Operação completamente bloqueada
- Sem workaround disponível

Ação Imediata:
- Desenvolvedor: João Silva
- ETA Correção: 2h
- Próxima atualização em: 30min

Gerente de TI
```

## 10. GESTÃO DE CONHECIMENTO

### 10.1 Base de Conhecimento

Problemas recorrentes devem gerar:
- Artigo na KB
- FAQ atualizada
- Documentação preventiva
- Melhorias no sistema

### 10.2 Post-Mortem (S1/P0)

Para problemas críticos, realizar análise post-mortem:

```markdown
# Post-Mortem: AERO-789 - Indisponibilidade do Sistema

## Resumo
Indisponibilidade total do sistema por 2h30m em 09/02/2026.

## Timeline
- 14:32 - Primeiros relatos de lentidão
- 14:45 - Sistema completamente inoperante
- 14:50 - Equipe iniciou investigação
- 15:30 - Causa raiz identificada (memory leak)
- 16:00 - Correção implementada
- 16:30 - Deploy realizado
- 17:00 - Sistema completamente restaurado

## Causa Raiz
Memory leak no módulo de processamento de relatórios
causado por conexões de banco não fechadas adequadamente.

## Impacto
- 150 usuários afetados
- 2h30m de downtime
- 5 pedidos não processados

## O Que Funcionou Bem
- Detecção rápida do problema
- Comunicação efetiva com stakeholders
- Rollback preparado (não foi necessário)

## O Que Pode Melhorar
- Monitoramento de memória insuficiente
- Alertas não configurados corretamente
- Testes de stress não cobriram esse cenário

## Ações de Melhoria
1. [ ] Implementar monitoramento de memória (Resp: DevOps, Prazo: 15/02)
2. [ ] Configurar alertas proativos (Resp: DevOps, Prazo: 15/02)
3. [ ] Adicionar testes de stress (Resp: QA, Prazo: 20/02)
4. [ ] Code review de patterns de conexão DB (Resp: TechLead, Prazo: 22/02)
5. [ ] Documentar runbook para memory issues (Resp: Dev, Prazo: 25/02)

## Lições Aprendidas
- Sempre fechar recursos em bloco finally ou try-with-resources
- Monitoramento proativo > Reativo
- Testes de carga são essenciais
```

## 11. INTEGRAÇÃO COM CONTROLE DE MUDANÇAS

Todo problema resolvido deve seguir processo de mudança:
1. Correção desenvolvida em branch separado
2. Pull Request criado
3. Code review obrigatório
4. Testes QA
5. Aprovação de deploy
6. Release notes atualizadas

Referência: `PROC-SCM-001-Controle-Mudanças.md`

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
