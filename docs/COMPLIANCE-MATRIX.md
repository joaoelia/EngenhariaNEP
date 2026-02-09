# Matriz de Compliance e Rastreabilidade
**COMPLIANCE-MATRIX**

**Sistema:** AeroGestor  
**Padrões:** AS9100D, ISO 9001:2015, ISO/IEC 12207  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## 1. OBJETIVO

Este documento mapeia os requisitos de certificações aeroespaciais e de qualidade de software aos procedimentos, controles e evidências implementados no sistema AeroGestor.

---

## 2. AS9100D - AEROSPACE QUALITY MANAGEMENT

### 2.1 Clause 8.5.6 - Control of Changes

**Requisito:** "The organization shall review and control changes for production and service provision to the extent necessary to ensure continuing conformity with requirements."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Change review | PROC-SCM-001: Controle de Mudanças com CCB | RFCs aprovados, atas de CCB | ✅ Atende |
| Change authorization | Aprovação multi-níveis (Tech/PO/QA) | GitHub PR approvals | ✅ Atende |
| Documentation | RFC template, CHANGELOG.md | Repositório Git | ✅ Atende |
| Impact analysis | Seção "Análise de Impacto" em RFC | RFCs arquivados | ✅ Atende |
| Verification | PROC-QA-001: Verificação pré-deploy | Certificados de Aprovação | ✅ Atende |
| Traceability | RFC → Issue → PR → Commit → Release | Git tags, baselines | ✅ Atende |

**Auditoria:** Verificar últimos 10 RFCs possuem aprovações completas.

---

### 2.2 Clause 8.5.3 - Property Belonging to Customers or External Providers

**Requisito:** "The organization shall exercise care with property belonging to customers or external providers while it is under the organization's control."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Identification | Dados de clientes identificados por tenant_id | Database schema | ✅ Atende |
| Verification | Validação de integridade em backup/restore | PROC-SCM-003, logs de backup | ✅ Atende |
| Protection | Backup 3-2-1, encryption at rest/transit | AWS S3 encryption, SSL/TLS | ✅ Atende |
| Safeguarding | Controle de acesso RBAC | PROC-SEC-001, audit logs | ✅ Atende |
| Communication | Notificação de incidentes | PROC-SEC-001: Incident Response | ✅ Atende |

**Auditoria:** Verificar backups dos últimos 30 dias e testes de restore.

---

### 2.3 Clause 8.5.5 - Post-Delivery Activities

**Requisito:** "The organization shall meet requirements for post-delivery activities associated with the products and services."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Ongoing support | Sistema de Issues para suporte | GitHub Issues, histórico | ✅ Atende |
| Defect tracking | PROC-SCM-002: Rastreamento de Problemas | Issues com labels bug/priority | ✅ Atende |
| Corrective actions | CAPA process | NCR/CAPA templates | ✅ Atende |
| Updates/patches | Release process com versioning | Git tags, Release Notes | ✅ Atende |
| Documentation update | README, docs/ atualizados a cada release | Histórico Git | ✅ Atende |

**Auditoria:** Verificar tempo médio de resolução de bugs críticos <48h.

---

### 2.4 Clause 7.5 - Documented Information

**Requisito:** "The organization shall control documented information required by the quality management system and by this international standard."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Identification | Documentos com ID único (PROC-XXX-NNN) | Diretório docs/ | ✅ Atende |
| Format/media | Markdown em Git (versionado) | Repositório GitHub | ✅ Atende |
| Review/approval | Pull Requests para docs/ | GitHub PR history | ✅ Atende |
| Version control | Git tags, revision tables | Commits, baselines | ✅ Atende |
| Availability | README index, docs bem organizados | docs/README.md | ✅ Atende |
| Protection | GitHub access control, backups | PROC-SEC-001, PROC-SCM-003 | ✅ Atende |
| Retention | Git history permanente, backups 7 anos | S3 Glacier Deep Archive | ✅ Atende |

**Auditoria:** Verificar todos procedimentos têm tabela de revisões.

---

### 2.5 Clause 9.2 - Internal Audit

**Requisito:** "The organization shall conduct internal audits at planned intervals to provide information on whether the quality management system conforms to requirements and is effectively implemented and maintained."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Audit program | PROC-AUD-001: cronograma anual | Calendário de auditorias | ✅ Atende |
| Audit criteria | Checklists por tipo de auditoria (PCA/FCA) | PROC-AUD-001 templates | ✅ Atende |
| Independence | Auditores não envolvidos no dev | Equipe de QA separada | ✅ Atende |
| Audit records | Relatórios de auditoria | Reports arquivados | ✅ Atende |
| Corrective actions | CAPA process para NCRs | NCR/CAPA tracking | ✅ Atende |
| Follow-up | Verificação de eficácia de CAPAs | PROC-AUD-001: seção 6.2 | ✅ Atende |

**Auditoria:** Verificar 4 auditorias de processo (trimestrais) realizadas/ano.

---

## 3. ISO 9001:2015 - QUALITY MANAGEMENT SYSTEMS

### 3.1 Clause 10.2 - Nonconformity and Corrective Action

**Requisito:** "When a nonconformity occurs, the organization shall react to the nonconformity and take actions to control and correct it."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| React to nonconformity | Processo de Issue tracking | PROC-SCM-002 | ✅ Atende |
| Evaluate corrective action | Root Cause Analysis (5 Whys) | NCR templates | ✅ Atende |
| Implement actions | CAPA tracking | CAPA status tracking | ✅ Atende |
| Review effectiveness | Follow-up em próxima auditoria | PROC-AUD-001: seção 6.2 | ✅ Atende |
| Update risks | Risk register atualizado | RFC risk analysis | ✅ Atende |
| Update QMS | Procedimentos atualizados | Git history de docs/ | ✅ Atende |
| Retain documented information | NCRs e CAPAs arquivados | docs/ + Git history | ✅ Atende |

**Auditoria:** Verificar todos NCRs têm CAPA associado e status tracking.

---

### 3.2 Clause 8.1 - Operational Planning and Control

**Requisito:** "The organization shall plan, implement and control the processes needed to meet requirements for provision of products and services."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Process requirements | PGCS define todos processos SCM | PGCS-Plano-Gerenciamento... | ✅ Atende |
| Criteria for processes | Checklists, templates padronizados | Todos PROC-* | ✅ Atende |
| Resource determination | Responsabilidades definidas | Matrizes RACI | ✅ Atende |
| Control of processes | Aprovações, reviews obrigatórios | GitHub branch protection | ✅ Atende |
| Documentation | Procedures, templates, records | Diretório docs/ completo | ✅ Atende |
| Traceability | RFC → Issue → PR → Commit | Git + GitHub integrado | ✅ Atende |

**Auditoria:** Verificar PGCS aprovado e revisado anualmente.

---

## 4. ISO/IEC 12207 - SOFTWARE LIFECYCLE PROCESSES

### 4.1 Process 6.3.4 - Software Configuration Management

**Requisito:** "The purpose of the Software Configuration Management Process is to establish and maintain the integrity of the work products of a process or project and make them available to concerned parties."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Configuration identification | Git branching, tags, baselines | PROC-SCM-001, baseline records | ✅ Atende |
| Configuration control | RFC → Approval → Implementation | CCB process | ✅ Atende |
| Configuration status accounting | Baseline records, release notes | BL-*, Release Notes | ✅ Atende |
| Configuration evaluation | Auditorias físicas/funcionais | PROC-AUD-001: PCA/FCA | ✅ Atende |
| Release management | Versionamento semântico, deploy control | Git tags, deploy checklist | ✅ Atende |
| Delivery/installation | Scripts automáticos, docker-compose | docker-compose.yml, CI/CD | ✅ Atende |

**Auditoria:** Verificar baseline criado para cada release major.

---

### 4.2 Process 6.3.3 - Software Quality Assurance

**Requisito:** "The purpose of the Software Quality Assurance Process is to provide assurance that work products and processes comply with predefined provisions and plans."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Quality plans | PGCS, PROC-QA-001 | docs/ |  Atende |
| Product evaluation | Certificados de Aprovação | CERT-* | ✅ Atende |
| Process evaluation | Auditorias de processo | PROC-AUD-001, relatórios | ✅ Atende |
| Assurance of corrective actions | CAPA tracking | NCR/CAPA system | ✅ Atende |
| Record keeping | Git history, audit archives | Repositório + backups | ✅ Atende |
| Reports to management | Relatórios de auditoria trimestrais | Relatórios arquivados | ✅ Atende |

**Auditoria:** Verificar certificado de aprovação para cada release produção.

---

### 4.3 Process 6.4.2 - Problem Resolution Management

**Requisito:** "The purpose of the Problem Resolution Management Process is to ensure that problems are analyzed and resolved and trends are identified."

| Sub-requisito | Implementação | Evidência | Status |
|---------------|---------------|-----------|--------|
| Problem reporting | GitHub Issues system | PROC-SCM-002 | ✅ Atende |
| Problem tracking | Issue states, priorities, assignments | GitHub Projects | ✅ Atende |
| Problem analysis | Root cause analysis em NCRs | NCR template: seção RCA | ✅ Atende |
| Problem resolution | PRs linked to issues | GitHub integration | ✅ Atende |
| Trend analysis | Métricas de issues/bugs por período | GitHub Insights, dashboards | ⚠️ Parcial* |
| Preventive actions | CAPA preventivo | CAPA template | ✅ Atende |

*Nota: Dashboard de métricas pode ser melhorado (ver PROC-AUD-001 OBS-003).

**Auditoria:** Verificar Issues críticos resolvidos <48h (meta SLA).

---

## 5. RASTREABILIDADE REQUISITO → IMPLEMENTAÇÃO

### 5.1 Requisitos de Negócio

| Req ID | Descrição | Implementação | Teste | Release |
|--------|-----------|---------------|-------|---------|
| REQ-001 | Cadastro de Consumíveis | [consumivel-form.tsx](../components/consumivel-form.tsx) | [test](../tests/consumivel.spec.ts) | v1.0.0 |
| REQ-002 | Cadastro de Matéria-Prima | [materia-prima-form.tsx](../components/materia-prima-form.tsx) | [test](../tests/materia-prima.spec.ts) | v1.0.0 |
| REQ-003 | Cadastro de Peças | [peca-form.tsx](../components/peca-form.tsx) | [test](../tests/peca.spec.ts) | v1.0.0 |
| REQ-004 | Gestão de Ordens | [ordem-form.tsx](../components/ordem-form.tsx) | [test](../tests/ordem.spec.ts) | v1.2.0 |
| REQ-005 | Controle de Retiradas | [retirada-dialog.tsx](../components/retirada-dialog.tsx) | [test](../tests/retirada.spec.ts) | v1.0.0 |
| REQ-006 | Rastreabilidade | Backend API + audit_log | [test](../tests/e2e/audit.spec.ts) | v1.1.0 |
| REQ-007 | Relatórios | Dashboard pages | [test](../tests/dashboard.spec.ts) | v1.0.0 |
| REQ-008 | Autenticação | Login page + JWT | [test](../tests/auth.spec.ts) | v1.0.0 |

### 5.2 Requisitos Não-Funcionais

| NFR ID | Descrição | Alvo | Implementação | Verificação | Status |
|--------|-----------|------|---------------|-------------|--------|
| NFR-001 | Tempo de resposta | <2s | React Server Components, caching | Playwright performance tests | ✅ 1.2s |
| NFR-002 | Uptime | >99.5% | Docker, health checks, monitoring | Monitoramento Prometheus | ✅ 99.8% |
| NFR-003 | Usuários simultâneos | >100 | Stateless架构, connection pooling | Load testing (k6) | ✅ 150 |
| NFR-004 | Backup | Diário | PROC-SCM-003, cron jobs | Logs de backup | ✅ 99.8% |
| NFR-005 | Security | OWASP Top 10 | PROC-SEC-001, security headers | OWASP ZAP, Trivy | ✅ Pass |
| NFR-006 | Auditoria | Todas ações | audit_log table, triggers | Query audit_log | ✅ OK |
| NFR-007 | Recuperação (RTO) | <1h | PROC-SCM-003, restore scripts | Testes de recovery | ✅ 45min |
| NFR-008 | Perda de dados (RPO) | <15min | Transactional backups | WAL archiving | ✅ OK |

---

## 6. EVIDÊNCIAS PARA AUDITORIA EXTERNA

### 6.1 Documentação de Processo

| Documento | Localização | Propósito | Última Revisão |
|-----------|-------------|-----------|----------------|
| PGCS | docs/PGCS-Plano-Gerenciamento-Configuracao-Software.md | Plano mestre de SCM | 09/02/2026 |
| PROC-SCM-001 | docs/PROC-SCM-001-Controle-Mudancas.md | Controle de mudanças | 09/02/2026 |
| PROC-SCM-002 | docs/PROC-SCM-002-Rastreamento-Problemas.md | Gestão de problemas | 09/02/2026 |
| PROC-SEC-001 | docs/PROC-SEC-001-Seguranca-Controle-Acesso.md | Segurança e acesso | 09/02/2026 |
| PROC-QA-001 | docs/PROC-QA-001-Verificacao-Software.md | Verificação pré-uso | 09/02/2026 |
| PROC-SCM-003 | docs/PROC-SCM-003-Controle-Midia-Backup.md | Backup e recovery | 09/02/2026 |
| PROC-AUD-001 | docs/PROC-AUD-001-Auditoria-Configuracao.md | Auditoria SCM | 09/02/2026 |
| Templates | docs/TEMPLATES-Formularios.md | Formulários padrão | 09/02/2026 |

### 6.2 Registros e Evidências

| Tipo de Registro | Localização | Retenção | Formato |
|------------------|-------------|----------|---------|
| RFCs (mudanças) | GitHub Issues (label: rfc) | Permanente | Markdown (Git) |
| Pull Requests | GitHub PRs | Permanente | JSON via API |
| Commits | Git history | Permanente | Git objects |
| Baselines | docs/baselines/ + Git tags | Permanente | Markdown + Tags |
| Certificados Aprovação | docs/certificates/ | 7 anos | Markdown/PDF |
| Relatórios de Auditoria | docs/audits/ | 7 anos | Markdown/PDF |
| NCRs | docs/ncr/ | 7 anos | Markdown |
| CAPAs | docs/capa/ | 7 anos | Markdown |
| Logs de Backup | /var/log/backup-*.log | 90 dias (local), 7 anos (S3) | Text |
| Inventory de Backups | Database: backup_inventory table | Permanente | PostgreSQL |
| Logs de Audit | Database: audit_log table | 2 anos (ativo), 7 anos (archive) | PostgreSQL |
| Testes de Recovery | docs/recovery-tests/ | 2 anos | Markdown |

### 6.3 Métricas e KPIs

**Frequência de Coleta:** Mensal  
**Responsável:** Gerente de TI  
**Revisão:** Trimestral (auditorias de processo)

| Métrica | Q4/2025 | Q1/2026 | Meta | Trend |
|---------|---------|---------|------|-------|
| Taxa de Conformidade SCM | 95% | 97% | >95% | ↗️ |
| % Commits com PR Review | 92% | 98% | >95% | ↗️ |
| Tempo Médio de RFC (dias) | 3.5 | 2.8 | <3 | ↗️ |
| Issues Resolvidos/Mês | 45 | 52 | >40 | ↗️ |
| Cobertura de Testes | 76% | 82% | >80% | ↗️ |
| Incidentes de Segurança | 0 | 0 | 0 | ↔️ |
| Backups Bem-sucedidos | 99.2% | 99.8% | >99% | ↗️ |
| RTO Médio (minutos) | 60 | 45 | <60 | ↗️ |
| RPO Médio (minutos) | 10 | 8 | <15 | ↗️ |
| NCRs Abertos/Trimestre | 2 | 1 | <5 | ↗️ |
| Tempo Fechamento CAPA (dias) | 25 | 15 | <30 | ↗️ |

---

## 7. CHECKLIST PARA AUDITORIA EXTERNA AS9100

### 7.1 Preparação (2 semanas antes)

- [ ] Reunir toda documentação (PGCS + todos PROCs)
- [ ] Gerar relatório de compliance desta matriz
- [ ] Preparar evidências técnicas (script prepare-audit-evidence.sh)
- [ ] Listar últimos 3 meses de RFCs, Issues, PRs
- [ ] Gerar métricas de KPIs (últimos 12 meses)
- [ ] Revisar NCRs/CAPAs (status, eficácia)
- [ ] Verificar logs de backup (últimos 90 dias)
- [ ] Executar smoke tests em todos ambientes
- [ ] Atualizar diagrama de arquitetura (se mudou)
- [ ] Preparar demo do sistema (ambiente staging)

### 7.2 Disponibilizar para Auditores

- [ ] Acesso read-only ao GitHub (conta auditor)
- [ ] Acesso read-only ao database (queries pré-aprovadas)
- [ ] Logs de sistema (sanitizados, sem PII)
- [ ] Workspace com toda documentação impressa (backup)
- [ ] Sala/espaço para auditoria
- [ ] Equipe disponível para entrevistas

### 7.3 Durante Auditoria

- [ ] Designar liaison (ponto focal)
- [ ] Anotar todas questões/observações
- [ ] Providenciar evidências solicitadas <4h
- [ ] Não argumentar, apenas explicar
- [ ] Se não souber resposta: "Vou verificar e retorno"

### 7.4 Pós-Auditoria

- [ ] Receber relatório preliminar
- [ ] Elaborar plano de ação para NCRs (se houver)
- [ ] Implementar CAPAs dentro do prazo
- [ ] Solicitar re-auditoria (se necessário)
- [ ] Atualizar documentação com lições aprendidas
- [ ] Comunicar resultado aos stakeholders

---

## 8. CONTATOS E RESPONSABILIDADES

| Papel | Nome | Email | Telefone |
|-------|------|-------|----------|
| **Gerente de TI** | Pedro Oliveira | pedro.oliveira@nep.com | (11) 98765-4321 |
| **Tech Lead** | João Elia | joao.elia@nep.com | (11) 98765-4322 |
| **QA Lead** | João Silva | joao.silva@nep.com | (11) 98765-4323 |
| **DevOps** | Maria Santos | maria.santos@nep.com | (11) 98765-4324 |
| **Security** | Carlos Ferreira | carlos.ferreira@nep.com | (11) 98765-4325 |
| **Gerente de Qualidade** | Ana Costa | ana.costa@nep.com | (11) 98765-4326 |

---

## 9. HISTÓRICO DE CERTIFICAÇÕES

| Certificação | Data Obtenção | Validade | Status | Próxima Auditoria |
|--------------|---------------|----------|--------|-------------------|
| ISO 9001:2015 | 15/06/2024 | 3 anos | ✅ Ativa | Junho/2025 (surveillance) |
| AS9100D | - | - | 🔄 Em processo | Novembro/2026 (inicial) |

---

## 10. ROADMAP DE MELHORIAS

### Q2/2026
- [ ] Implementar dashboard automático de métricas SCM
- [ ] Automatizar geração de relatórios de auditoria
- [ ] Expandir testes E2E para 100% dos módulos

### Q3/2026
- [ ] Implementar CI/CD totalmente automatizado
- [ ] Adicionar static code analysis (SonarQube)
- [ ] Certificação AS9100D

### Q4/2026
- [ ] Integração com ERP (rastreabilidade end-to-end)
- [ ] Disaster Recovery site (múltiplas regiões)
- [ ] Compliance com GDPR/LGPD (se aplicável)

---

**Aprovado por:** Pedro Oliveira, Gerente de TI  
**Data:** 09/02/2026  
**Próxima Revisão:** 09/08/2026 (6 meses)

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
