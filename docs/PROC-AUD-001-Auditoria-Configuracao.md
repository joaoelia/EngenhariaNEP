# Procedimento de Auditoria de Configuração de Software
**PROC-AUD-001**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## 1. OBJETIVO

Estabelecer procedimentos para auditoria periódica de configuração de software, garantindo conformidade com processos estabelecidos e requisitos de certificação (AS9100, ISO 9001).

## 2. ESCOPO

Auditorias cobrem:
- **Controle de Versão:** Git, branching, tags
- **Gerenciamento de Mudanças:** RFCs, aprovações
- **Rastreamento de Problemas:** Issues, bugs
- **Controle de Acesso:** Permissões, autenticação
- **Backup/Recovery:** Procedimentos, testes
- **Documentação:** Atualização, completude

## 3. TIPOS DE AUDITORIA

### 3.1 Auditoria Física (Physical Configuration Audit - PCA)

**Objetivo:** Verificar que a documentação corresponde ao produto entregue.

**Frequência:** A cada release major (vX.0.0)

**Checklist:**
```markdown
# AUDITORIA FÍSICA - Release v1.2.0

## DOCUMENTAÇÃO vs. PRODUTO

### Código-Fonte
- [ ] Tag Git existe: v1.2.0 ✓
- [ ] Hash SHA-256 corresponde ao documentado
- [ ] Branch de release foi criada (release/1.2.0)
- [ ] Merge para `main` devidamente aprovado

### Build Artifacts
- [ ] Docker images criadas com tag correta
- [ ] Hash das imagens documentado
- [ ] Artefatos publicados no registry
- [ ] Checksum verificado

### Banco de Dados
- [ ] Scripts de migração presentes (v1.1.0 → v1.2.0)
- [ ] Schema version atualizado
- [ ] Rollback scripts disponíveis
- [ ] Documentação de mudanças no schema

### Documentação Técnica
- [ ] README atualizado
- [ ] CHANGELOG preenchido
- [ ] API docs refletem alterações
- [ ] Diagramas atualizados (se aplicável)

### Configurações
- [ ] docker-compose.yml versionado
- [ ] .env.example atualizado
- [ ] Nginx configs documentados
- [ ] Variáveis de ambiente listadas

## RASTREABILIDADE

### Requirements → Code
- [ ] Issue #234: Nova funcionalidade X → PR #456 → commit abc123
- [ ] Issue #235: Correção bug Y → PR #457 → commit def456
- [ ] RFC-2026-002 → Issues #236, #237 → Release v1.2.0

### Tests → Features
- [ ] Funcionalidade X tem testes: test-feature-x.spec.ts
- [ ] Cobertura de testes ≥ 80%
- [ ] Testes E2E cobrem fluxo completo

## CONFORMIDADE

### Processo SCM
- [ ] Todos commits seguem padrão (Conventional Commits)
- [ ] Todas mudanças passaram por PR review
- [ ] Aprovações registradas (2+ reviewers)
- [ ] CI/CD executou com sucesso

### Segurança
- [ ] Scan de vulnerabilidades executado
- [ ] Dependências atualizadas
- [ ] Secrets não commitados
- [ ] Logs de audit registrados

---

**Auditado por:** _____________  
**Data:** __/__/____  
**Resultado:** [ ] Aprovado [ ] Aprovado com ressalvas [ ] Reprovado  
**Ressalvas:** _________________________
```

### 3.2 Auditoria Funcional (Functional Configuration Audit - FCA)

**Objetivo:** Verificar que o software atende aos requisitos especificados.

**Frequência:** A cada release major ou sob demanda

**Checklist:**
```markdown
# AUDITORIA FUNCIONAL - Release v1.2.0

## REQUISITOS vs. IMPLEMENTAÇÃO

### Requisitos Funcionais
| ID | Requisito | Implementado | Testado | Status |
|----|-----------|--------------|---------|--------|
| REQ-001 | Cadastro de consumíveis | ✓ | ✓ | OK |
| REQ-002 | Controle de estoque | ✓ | ✓ | OK |
| REQ-003 | Geração de relatórios | ✓ | ✓ | OK |
| REQ-004 | Rastreabilidade de retiradas | ✓ | ✓ | OK |
| REQ-005 | Integração com ERP (futuro) | ✗ | - | N/A |

### Requisitos Não-Funcionais
| ID | Requisito | Alvo | Medido | Status |
|----|-----------|------|--------|--------|
| NFR-001 | Tempo de resposta < 2s | 2s | 1.2s | ✓ OK |
| NFR-002 | Uptime > 99.5% | 99.5% | 99.8% | ✓ OK |
| NFR-003 | Suporte 100 usuários | 100 | 150 | ✓ OK |
| NFR-004 | Backup diário | Sim | Sim | ✓ OK |
| NFR-005 | Logs de auditoria | Sim | Sim | ✓ OK |

### Testes de Aceitação
- [ ] Todos os casos de teste executados (150/150)
- [ ] Taxa de sucesso ≥ 95% (147/150 = 98%)
- [ ] Issues críticas resolvidas (0 pendentes)
- [ ] Testes de regressão OK
- [ ] Smoke tests pós-deploy OK

---

**Auditado por:** _____________  
**Data:** __/__/____  
**Resultado:** [ ] Aprovado [ ] Aprovado com ressalvas [ ] Reprovado
```

### 3.3 Auditoria de Processo (Process Audit)

**Objetivo:** Verificar aderência aos processos de SCM estabelecidos.

**Frequência:** Trimestral

**Checklist:**
```markdown
# AUDITORIA DE PROCESSO - Q1/2026

## ADERÊNCIA AOS PROCEDIMENTOS

### PROC-SCM-001: Controle de Mudanças
- [ ] RFCs criados para todas mudanças significativas
- [ ] RFCs seguem template estabelecido
- [ ] Aprovações documentadas (CCB)
- [ ] Rastreabilidade RFC → Issue → PR mantida

**Amostra auditada:** 20 RFCs  
**Conformidade:** 19/20 (95%)  
**Não-conformidades:**
- RFC-2026-015 não teve aprovação do Product Owner documentada

### PROC-SCM-002: Rastreamento de Problemas
- [ ] Issues criados para todos bugs reportados
- [ ] Issues seguem template (descrição, passos, impacto)
- [ ] Priorização documentada
- [ ] Resolução rastreável até commit

**Amostra auditada:** 30 Issues  
**Conformidade:** 28/30 (93%)  
**Não-conformidades:**
- Issue #445 sem priority label
- Issue #467 falta relacionamento com PR

### PROC-SEC-001: Segurança e Controle de Acesso
- [ ] Matrix de acesso atualizada
- [ ] Revisão de permissões realizada
- [ ] Acessos inativos removidos
- [ ] Logs de audit funcionando

**Conformidade:** 100%

### PROC-QA-001: Verificação de Software
- [ ] Testes de aceitação realizados antes de deploy
- [ ] Certificado de aprovação emitido
- [ ] Documentação de verificação completa
- [ ] Ambiente de staging utilizado

**Releases auditados:** v1.1.0, v1.2.0  
**Conformidade:** 100%

### PROC-SCM-003: Controle de Mídia e Backup
- [ ] Backups executando conforme cronograma
- [ ] Testes de recovery realizados
- [ ] Integridade verificada
- [ ] Documentação de backup atualizada

**Conformidade:** 100%

## MÉTRICAS DE PROCESSO

| Métrica | Q4/2025 | Q1/2026 | Meta | Status |
|---------|---------|---------|------|--------|
| % Commits com PR review | 92% | 98% | >95% | ✓ |
| Tempo médio de RFC | 3.5d | 2.8d | <3d | ✓ |
| Issues resolvidos/mês | 45 | 52 | >40 | ✓ |
| Cobertura de testes | 76% | 82% | >80% | ✓ |
| Incidentes de segurança | 0 | 0 | 0 | ✓ |

## RECOMENDAÇÕES
1. Reforçar treinamento sobre preenchimento correto de RFCs
2. Implementar validação automatizada de Issue templates
3. Continuar monitorando métricas de qualidade

---

**Auditado por:** _____________  
**Data:** __/__/____  
**Aprovado por:** _____________ (Gerente de Qualidade)
```

## 4. CRONOGRAMA DE AUDITORIAS

### 4.1 Calendário Anual

```
2026 - Plano de Auditorias SCM

Janeiro
- Auditoria de Processo (Q4/2025)

Fevereiro
- Auditoria Física (Release v1.2.0)

Março
- Teste de Recovery (Semestral)

Abril
- Auditoria de Processo (Q1/2026)

Maio
- Auditoria de Acesso (Semestral)

Junho
- Auditoria Funcional (Release v1.3.0)

Julho
- Auditoria de Processo (Q2/2026)

Agosto
- Auditoria de Backup (Semestral)

Setembro
- Teste de Recovery (Anual - completo)

Outubro
- Auditoria de Processo (Q3/2026)

Novembro
- Auditoria Externa (Certificação AS9100)

Dezembro
- Revisão Anual de Documentação
```

### 4.2 Triggers para Auditorias Não-Programadas

**Auditorias imediatas devem ser realizadas quando:**
- Incidente de segurança (violação, vazamento)
- Falha crítica em produção (downtime > 4h)
- Perda de dados
- Não-conformidade detectada externamente
- Mudança de pessoal-chave (Admin, DBA)

## 5. PREPARAÇÃO PARA AUDITORIA

### 5.1 Artefatos Necessários

**Documentação:**
- [ ] Plano de Gerenciamento de Configuração (PGCS)
- [ ] Procedimentos SCM (todos)
- [ ] Registros de mudanças (RFCs)
- [ ] Issues e resoluções
- [ ] Logs de audit
- [ ] Relatórios de backup
- [ ] Certificados de aprovação

**Evidências Técnicas:**
```bash
# Script: prepare-audit-evidence.sh

AUDIT_DIR="/audit/2026-Q1"
mkdir -p "${AUDIT_DIR}"

# 1. Exportar histórico Git
git log --since="2026-01-01" --until="2026-03-31" \
  --pretty=format:"%h|%an|%ae|%ad|%s" --date=iso \
  > "${AUDIT_DIR}/git-commits.csv"

# 2. Listar tags e releases
git tag -l "v*" --sort=-v:refname | head -10 > "${AUDIT_DIR}/releases.txt"

# 3. Exportar PRs (via GitHub CLI)
gh pr list --state merged --limit 100 \
  --json number,title,createdAt,mergedAt,author,reviews \
  > "${AUDIT_DIR}/pull-requests.json"

# 4. Exportar Issues
gh issue list --state all --limit 200 \
  --json number,title,state,createdAt,closedAt,assignees,labels \
  > "${AUDIT_DIR}/issues.json"

# 5. Relatório de cobertura de testes
cp coverage/lcov-report/index.html "${AUDIT_DIR}/test-coverage.html"

# 6. Scan de segurança
trivy image aerogestor-app:latest \
  --format json \
  --output "${AUDIT_DIR}/security-scan.json"

# 7. Logs de backup (últimos 90 dias)
cat /var/log/backup-db.log | grep "$(date +%Y)" > "${AUDIT_DIR}/backup-logs.txt"

# 8. Inventário de backups
psql -d aerogestor -c "
  SELECT * FROM backup_inventory 
  WHERE created_at > NOW() - INTERVAL '90 days'
  ORDER BY created_at DESC
" --csv > "${AUDIT_DIR}/backup-inventory.csv"

# 9. Logs de audit de acesso
psql -d aerogestor -c "
  SELECT * FROM audit_log 
  WHERE event_date > NOW() - INTERVAL '90 days'
  ORDER BY event_date DESC
  LIMIT 1000
" --csv > "${AUDIT_DIR}/access-audit.csv"

# 10. Compactar tudo
tar -czf audit-evidence-$(date +%Y-Q%q).tar.gz "${AUDIT_DIR}"

echo "Evidências preparadas: audit-evidence-$(date +%Y-Q%q).tar.gz"
```

### 5.2 Acesso do Auditor

**Conta de Auditor:**
```yaml
# auditor_access.yml

username: auditor@nep.com
role: auditor
permissions:
  - read_only: true
  - git: clone, log, show
  - database: SELECT only
  - systems: view logs, view configs
  - no_write: true
  - no_delete: true
  - no_export_data: false  # Pode exportar para relatório

access_period:
  start: "2026-04-01"
  end: "2026-04-15"
  
mfa_required: true
ip_whitelist:
  - "192.168.1.100"  # IP do auditor
```

## 6. AÇÕES CORRETIVAS

### 6.1 Registro de Não-Conformidades

**Template de NCR (Non-Conformance Report):**
```markdown
# NCR-2026-001

**Data Identificação:** 09/02/2026  
**Identificado por:** Auditor Interno (João Silva)  
**Auditoria:** Processo Q1/2026

## DESCRIÇÃO DA NÃO-CONFORMIDADE

**Procedimento:** PROC-SCM-001 (Controle de Mudanças)  
**Requisito:** Todas mudanças significativas devem ter RFC aprovado antes da implementação  
**Não-Conformidade:** RFC-2026-015 implementado sem aprovação do Product Owner documentada

## EVIDÊNCIA

- RFC-2026-015 criado em 05/02/2026
- PR #456 mergeado em 06/02/2026
- Aprovação técnica presente (Tech Lead)
- **Faltante:** Aprovação de negócio (Product Owner)

## ANÁLISE DE CAUSA RAIZ

**Método:** 5 Whys

1. Por que RFC foi implementado sem aprovação completa?
   - Aprovação do PO não foi obtida

2. Por que aprovação não foi obtida?
   - PO estava em viagem de negócios

3. Por que não esperaram retorno?
   - Mudança era considerada urgente (bug crítico)

4. Por que não há procedimento para urgências?
   - **Causa Raiz:** Procedimento não contempla aprovação emergencial

## IMPACTO

**Severidade:** Baixa  
**Risco:** Médio (processo contornado)  
**Produto:** Nenhum (mudança era válida e necessária)

## AÇÃO CORRETIVA

**Imediata:**
- [ ] Obter aprovação retroativa do Product Owner
- [ ] Documentar no RFC

**Preventiva:**
- [ ] Atualizar PROC-SCM-001 com procedimento de aprovação emergencial
- [ ] Definir "delegate" para cada papel do CCB
- [ ] Treinar equipe sobre novo procedimento

**Responsável:** Gerente de TI  
**Prazo:** 20/02/2026

## VERIFICAÇÃO DA EFICÁCIA

**Data:** __/__/____  
**Método:** Próxima auditoria verificar se procedimento atualizado está sendo seguido  
**Resultado:** [ ] Efetivo [ ] Inefetivo

---

**Aberto por:** _______________ Data: __/__/____  
**Aprovado por:** _______________ Data: __/__/____  
**Fechado por:** _______________ Data: __/__/____
```

### 6.2 Plano de Ação Corretiva (CAPA)

```markdown
# CAPA-2026-001

**NCR Relacionada:** NCR-2026-001  
**Data Abertura:** 09/02/2026

## AÇÕES

| # | Ação | Responsável | Prazo | Status |
|---|------|-------------|-------|--------|
| 1 | Obter aprovação retroativa (RFC-2026-015) | João Elia | 12/02/2026 | ✓ Concluído |
| 2 | Revisar PROC-SCM-001 | João Elia | 15/02/2026 | ✓ Concluído |
| 3 | Incluir seção "Aprovação Emergencial" | João Elia | 15/02/2026 | ✓ Concluído |
| 4 | Definir delegates para CCB | Gerente TI | 18/02/2026 | ⏳ Em andamento |
| 5 | Treinar equipe (workshop) | Gerente TI | 22/02/2026 | ⏸ Pendente |
| 6 | Atualizar checklist de RFC | João Elia | 20/02/2026 | ✓ Concluído |

## VERIFICAÇÃO

**Método:** Auditoria de follow-up (Q2/2026)  
**Critério de Sucesso:** Todas aprovações emergenciais desde 20/02 seguiram novo procedimento

## LIÇÕES APRENDIDAS

- Procedimentos devem contemplar cenários excepcionais
- Comunicação clara dos papéis e delegates é essencial
- Treinamento regular previne não-conformidades

---

**Status do CAPA:** [ ] Aberto [X] Em Implementação [ ] Concluído [ ] Verificado

**Próxima Revisão:** 01/07/2026 (Auditoria Q2)
```

## 7. MÉTRICAS E KPIs

### 7.1 Indicadores de Conformidade

| KPI | Descrição | Meta | Q1/2026 |
|-----|-----------|------|---------|
| Taxa de Conformidade SCM | % processos em conformidade | >95% | 97% |
| NCRs Abertos | Não-conformidades identificadas | <5/trimestre | 1 |
| Tempo Médio de CAPA | Dias para fechar ação corretiva | <30d | 15d |
| % Commits com Review | Commits mergeados após review | >95% | 98% |
| % Releases com PCA | Releases auditadas fisicamente | 100% | 100% |
| Backups Bem-sucedidos | Taxa de sucesso de backups | >99% | 99.8% |
| Testes de Recovery | Testes realizados no prazo | 100% | 100% |

### 7.2 Dashboard de Auditoria

**Visualização (Grafana/similar):**
```
┌─────────────────────── COMPLIANCE DASHBOARD ───────────────────────┐
│                                                                     │
│  Conformidade Geral                   Auditorias Realizadas (2026) │
│  ████████████████░░ 97%               ├─ PCA: 1 (aprovada)         │
│                                       ├─ FCA: 1 (aprovada)         │
│  NCRs Abertos: 0                      └─ Processo: 1 (1 NCR)       │
│  CAPAs Pendentes: 1                                                │
│                                                                     │
│  Próximas Auditorias:                 Métricas de Qualidade        │
│  • Processo Q2: 01/07/2026            ├─ Cobertura Testes: 82%     │
│  • PCA v1.3.0: 15/07/2026             ├─ PRs Reviewed: 98%         │
│                                       ├─ Backups OK: 99.8%         │
│  Histórico de Conformidade            └─ Uptime: 99.9%             │
│  Q4/25  Q1/26  Q2/26  Q3/26                                        │
│   95%    97%    ?      ?                                           │
└─────────────────────────────────────────────────────────────────────┘
```

## 8. RELATÓRIO FINAL DE AUDITORIA

**Template de Relatório:**
```markdown
# RELATÓRIO DE AUDITORIA DE CONFIGURAÇÃO DE SOFTWARE

**Período:** Q1/2026 (01/01/2026 - 31/03/2026)  
**Tipo:** Auditoria de Processo  
**Auditores:** João Silva (Lead), Maria Santos  
**Auditados:** Equipe de TI NEP Aviation

---

## 1. SUMÁRIO EXECUTIVO

A auditoria de processo do Q1/2026 foi realizada conforme planejado entre os dias 01-05/04/2026. O sistema de gerenciamento de configuração de software do AeroGestor está substancialmente em conformidade com os procedimentos estabelecidos.

**Resultado Geral:** ✅ APROVADO COM RESSALVAS

**Taxa de Conformidade:** 97% (acima da meta de 95%)  
**NCRs Emitidas:** 1 (baixa severidade)  
**CAPAs Abertos:** 1  
**Observações:** 3

---

## 2. ESCOPO DA AUDITORIA

### Procedimentos Auditados
- PROC-SCM-001: Controle de Mudanças
- PROC-SCM-002: Rastreamento de Problemas
- PROC-SEC-001: Segurança e Controle de Acesso
- PROC-QA-001: Verificação de Software
- PROC-SCM-003: Controle de Mídia e Backup

### Período Coberto
01/01/2026 - 31/03/2026 (3 meses)

### Amostra Auditada
- 20 RFCs
- 30 Issues
- 50 Pull Requests
- 2 Releases (v1.1.0, v1.2.0)
- 90 dias de logs de backup

---

## 3. ACHADOS

### 3.1 Não-Conformidades (NCR)
Ver **NCR-2026-001** em anexo

### 3.2 Observações

**OBS-001:** Documentação de API poderia ser mais detalhada  
**Severidade:** Baixa  
**Recomendação:** Incluir mais exemplos de uso nas APIs

**OBS-002:** Tempo de revisão de PRs variável (1h - 3d)  
**Severidade:** Baixa  
**Recomendação:** Estabelecer SLA para code review

**OBS-003:** Testes E2E não cobrem todos os módulos  
**Severidade:** Média  
**Recomendação:** Expandir cobertura E2E para 100% dos módulos

---

## 4. PONTOS FORTES

1. **Controle de Versão:** Git utilizado de forma eficaz, branching strategy clara
2. **Code Review:** 98% dos commits passam por review
3. **Backup:** Procedimentos robustos, testes regulares
4. **Segurança:** Controle de acesso bem definido, logs de audit funcionando
5. **Documentação:** PGCS e procedimentos bem estruturados

---

## 5. OPORTUNIDADES DE MELHORIA

1. Automatizar validação de templates de RFC/Issue
2. Implementar SLA para code review
3. Expandir testes E2E
4. Melhorar documentação de API
5. Criar dashboard de métricas de SCM

---

## 6. CONCLUSÃO

O sistema de gerenciamento de configuração do AeroGestor está operando de forma eficaz e em conformidade com os padrões estabelecidos. A única não-conformidade identificada é de baixa severidade e está sendo tratada através de CAPA.

A equipe demonstrou comprometimento com os processos de qualidade e as melhorias implementadas desde a última auditoria (Q4/2025) são notáveis.

**Recomendação:** Manter certificação AS9100, sob condição de fechamento do CAPA-2026-001 no prazo.

---

## 7. ANEXOS

- Anexo A: NCR-2026-001
- Anexo B: CAPA-2026-001
- Anexo C: Evidências (audit-evidence-2026-Q1.tar.gz)
- Anexo D: Logs de Auditoria

---

**Elaborado por:** João Silva, Auditor Lead  
**Revisado por:** Maria Santos, Auditora  
**Aprovado por:** Pedro Oliveira, Gerente de Qualidade

**Data:** 05/04/2026  
**Assinaturas:** _______________________________
```

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
