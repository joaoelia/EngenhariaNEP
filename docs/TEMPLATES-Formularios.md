# Templates e Formulários - Sistema de Gerenciamento de Configuração
**DOC-TEMPLATES**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## ÍNDICE DE TEMPLATES

1. [Template de RFC (Request for Change)](#1-template-de-rfc)
2. [Template de Issue/Bug Report](#2-template-de-issue-bug-report)
3. [Template de Baseline Record](#3-template-de-baseline-record)
4. [Template de Release Notes](#4-template-de-release-notes)
5. [Template de Certificado de Aprovação](#5-template-de-certificado-de-aprovacao)
6. [Template de NCR (Non-Conformance Report)](#6-template-de-ncr)
7. [Template de CAPA (Corrective Action)](#7-template-de-capa)
8. [Template de Teste de Recovery](#8-template-de-teste-de-recovery)
9. [Template de Relatório de Auditoria](#9-template-de-relatorio-de-auditoria)
10. [Checklist de Deploy](#10-checklist-de-deploy)

---

## 1. TEMPLATE DE RFC

**Arquivo:** `.github/ISSUE_TEMPLATE/rfc.md`

```markdown
---
name: RFC - Request for Change
about: Proposta de mudança significativa no sistema
title: 'RFC-YYYY-NNN: [Título breve]'
labels: rfc, needs-approval
assignees: ''
---

# RFC-YYYY-NNN: [Título da Mudança]

**Data de Criação:** __/__/____  
**Solicitante:** @username  
**Patrocinador:** @sponsor

---

## 1. SUMÁRIO

Breve descrição da mudança proposta (2-3 frases).

---

## 2. JUSTIFICATIVA

### Problema Atual
Descrever o problema ou oportunidade que motivou esta mudança.

### Benefícios Esperados
- Benefício 1
- Benefício 2
- Benefício 3

### Custo de NÃO Implementar
O que acontece se esta mudança não for feita?

---

## 3. ESCOPO DA MUDANÇA

### Componentes Afetados
- [ ] Frontend (Next.js)
- [ ] Backend (Spring Boot)
- [ ] Banco de Dados
- [ ] Infraestrutura
- [ ] Documentação
- [ ] Outro: ________________

### Tipo de Mudança
- [ ] Nova funcionalidade
- [ ] Melhoria de funcionalidade existente
- [ ] Correção de bug
- [ ] Refatoração
- [ ] Atualização de dependência
- [ ] Mudança de configuração

### Nível de Impacto
- [ ] Crítico (afeta produção, requer downtime)
- [ ] Alto (mudança significativa)
- [ ] Médio (mudança moderada)
- [ ] Baixo (mudança menor)

---

## 4. ANÁLISE DE IMPACTO

### Usuários Afetados
Quem será impactado por esta mudança?

### Compatibilidade
- [ ] **Breaking change:** Requer migração de dados/código
- [ ] Compatível com versão anterior
- [ ] Requer atualização de documentação

### Riscos Identificados
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
|       | Baixa/Média/Alta | Baixo/Médio/Alto | |

---

## 5. IMPLEMENTAÇÃO

### Abordagem Técnica
Descrever como a mudança será implementada.

### Tarefas
- [ ] Tarefa 1: Criar modelo de dados (#issue)
- [ ] Tarefa 2: Implementar API (#issue)
- [ ] Tarefa 3: Criar interface (#issue)
- [ ] Tarefa 4: Escrever testes (#issue)
- [ ] Tarefa 5: Atualizar documentação (#issue)

### Estimativa de Esforço
**Total:** ___ horas/dias  
**Desenvolvimento:** ___ h  
**Testes:** ___ h  
**Documentação:** ___ h

---

## 6. TESTES

### Estratégia de Testes
Descrever como a mudança será testada.

### Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

---

## 7. DEPLOY E ROLLBACK

### Estratégia de Deploy
- [ ] Deploy direto
- [ ] Feature flag
- [ ] Canary deployment
- [ ] Blue-green deployment

### Plano de Rollback
Como reverter esta mudança se necessário?

### Migração de Dados
- [ ] Não aplicável
- [ ] Migração automática (script SQL)
- [ ] Migração manual

---

## 8. APROVAÇÕES

**Change Control Board:**
- [ ] **Tech Lead:** @tech-lead - [ ] Aprovado [ ] Rejeitado (Data: _____)
- [ ] **Product Owner:** @po - [ ] Aprovado [ ] Rejeitado (Data: _____)
- [ ] **QA Lead:** @qa - [ ] Aprovado [ ] Rejeitado (Data: _____)
- [ ] **DevOps:** @devops - [ ] Aprovado [ ] Rejeitado (Data: _____)
- [ ] **Security:** @security - [ ] Aprovado [ ] Rejeitado (Data: _____)

**Comentários:**

---

## 9. IMPLEMENTAÇÃO

**Status:** [ ] Proposto [ ] Aprovado [ ] Em Implementação [ ] Concluído [ ] Rejeitado

**PRs Relacionados:**
- #PR_NUMBER - Descrição

**Issues Relacionados:**
- #ISSUE_NUMBER - Descrição

**Data de Implementação:** __/__/____  
**Versão:** vX.Y.Z

---

## 10. PÓS-IMPLEMENTAÇÃO

**Validação:**
- [ ] Testes de aceitação passaram
- [ ] Deploy em produção realizado
- [ ] Métricas monitoradas (primeiras 48h)
- [ ] Feedback coletado

**Lições Aprendidas:**
_O que funcionou bem? O que poderia ser melhorado?_
```

---

## 2. TEMPLATE DE ISSUE / BUG REPORT

**Arquivo:** `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Reportar um problema no sistema
title: '[BUG] '
labels: bug, needs-triage
assignees: ''
---

# 🐛 Bug Report

**Data:** __/__/____  
**Reportado por:** @username  
**Prioridade:** [ ] P0-Crítico [ ] P1-Alto [ ] P2-Médio [ ] P3-Baixo

---

## Descrição
Descrição clara e concisa do problema.

---

## Passos para Reproduzir

1. Navegar para '...'
2. Clicar em '...'
3. Preencher campo '...' com '...'
4. Observar erro

---

## Comportamento Esperado
O que deveria acontecer?

---

## Comportamento Atual
O que está acontecendo?

---

## Impacto

### Severidade
- [ ] **Crítico:** Sistema inoperante, perda de dados
- [ ] **Alto:** Funcionalidade importante não funciona
- [ ] **Médio:** Funcionalidade funciona parcialmente
- [ ] **Baixo:** Problema cosmético, workaround disponível

### Usuários Afetados
- [ ] Todos os usuários
- [ ] Grupo específico: ________________
- [ ] Apenas alguns usuários (edge case)

---

## Ambiente

**Versão do Sistema:** v1.2.0  
**Navegador:** Chrome 120.0 / Firefox 119.0 / Edge 120.0  
**Sistema Operacional:** Windows 11 / macOS 14 / Ubuntu 22.04  
**Dispositivo:** Desktop / Tablet / Mobile  
**Resolução:** 1920x1080

---

## Logs/Screenshots

### Console do Navegador
```
Colar aqui erros do console (F12)
```

### Screenshots
![Descrição da imagem](url-da-imagem)

### Logs do Servidor
```
Colar logs relevantes
```

---

## Workaround
Existe alguma forma de contornar o problema temporariamente?

---

## Informações Adicionais

### Primeira Ocorrência
Quando notou o problema pela primeira vez?

### Frequência
- [ ] Acontece sempre
- [ ] Acontece às vezes (___% das vezes)
- [ ] Aconteceu uma vez

### Dados para Reprodução
Dados específicos necessários? (IDs, valores, etc.)

---

## Para a Equipe de Desenvolvimento

**Root Cause:**
_A ser preenchido pela equipe_

**Related PRs:**
- #PR_NUMBER

**Fixed in Version:**
vX.Y.Z
```

---

## 3. TEMPLATE DE BASELINE RECORD

```markdown
# SOFTWARE BASELINE RECORD

**Baseline ID:** BL-YYYY-NNN  
**Versão:** vX.Y.Z  
**Data:** __/__/____  
**Tipo:** [ ] Functional [ ] Allocated [ ] Product

---

## 1. IDENTIFICAÇÃO

**Nome do Sistema:** AeroGestor  
**Versão:** v1.2.0  
**Build:** 20260209.001  
**Git Commit:** ac4bdaa8432f1c149afbf4c8996fb92427ae41e4  
**Git Tag:** v1.2.0

---

## 2. COMPOSIÇÃO DA BASELINE

### 2.1 Código-Fonte

| Componente | Versão | Repositório | Commit |
|------------|--------|-------------|--------|
| Frontend | v1.2.0 | EngenhariaNEP | ac4bdaa |
| Backend | v1.2.0 | EngenhariaNEP | ac4bdaa |
| Database Schema | v1.2.0 | EngenhariaNEP | ac4bdaa |

### 2.2 Dependências

**Frontend (package.json):**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "typescript": "5.3.3"
  }
}
```

**Backend (pom.xml):**
```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>3.2.0</version>
  </dependency>
</dependencies>
```

### 2.3 Artefatos de Build

| Artefato | Tipo | Tamanho | SHA-256 |
|----------|------|---------|---------|
| app-frontend.tar | Docker | 450MB | e3b0c44298fc...b7852b855 |
| app-backend.jar | JAR | 85MB | f4c1d55309ed...c8963a923 |
| database-schema.sql | SQL | 2.5MB | a5d2e66410fe...d9074b034 |

---

## 3. DOCUMENTAÇÃO

| Documento | Versão | Localização |
|-----------|--------|-------------|
| README.md | v1.2.0 | /README.md |
| API Documentation | v1.2.0 | /docs/api/ |
| User Manual | v1.2.0 | /docs/manual/ |
| Installation Guide | v1.2.0 | /docs/install/ |

---

## 4. CONFIGURAÇÃO

**Ambiente de Referência:**
- **OS:** Ubuntu 22.04 LTS
- **Runtime:** Node.js 20.x, Java 17
- **Database:** PostgreSQL 15.x
- **Hardware:** 4 CPU, 16GB RAM, 100GB SSD

**Variáveis de Ambiente:** Documentadas em `.env.example`

---

## 5. REQUISITOS ATENDIDOS

| ID | Requisito | Status |
|----|-----------|--------|
| REQ-001 | Cadastro de consumíveis | ✓ Implementado |
| REQ-002 | Controle de estoque | ✓ Implementado |
| REQ-003 | Relatórios | ✓ Implementado |
| REQ-004 | Rastreabilidade | ✓ Implementado |

---

## 6. MUDANÇAS DESDE ÚLTIMA BASELINE

**Baseline Anterior:** BL-2026-001 (v1.1.0)

**Resumo de Mudanças:**
- Nova funcionalidade: Gestão de Ordens de Produção
- Melhorias: Performance de queries
- Correções: 15 bugs resolvidos

**RFCs Implementados:**
- RFC-2026-001: Gestão de Ordens
- RFC-2026-002: Otimização de Performance

---

## 7. APROVAÇÃO

**Auditoria Física:** [ ] Realizada [ ] Pendente  
**Certificado de Aprovação:** CERT-2026-002

**Aprovado por:**
- Tech Lead: _____________ Data: __/__/____
- QA Lead: _____________ Data: __/__/____
- Gerente TI: _____________ Data: __/__/____

---

## 8. CONTROLE DE MUDANÇAS

Esta baseline está **congelada**. Mudanças futuras resultarão em nova baseline.

**Próxima Baseline Prevista:** BL-2026-003 (v1.3.0) em Julho/2026

---

**Elaborado por:** _____________  
**Data:** __/__/____  
**Assinatura:** _______________________
```

---

## 4. TEMPLATE DE RELEASE NOTES

```markdown
# Release Notes - AeroGestor v1.2.0

**Data de Lançamento:** 10/02/2026  
**Tipo de Release:** Minor Release  
**Status:** ✅ Deployed to Production

---

## 🎯 Destaques

- Nova funcionalidade de Gestão de Ordens de Produção
- Melhorias significativas de performance (30% mais rápido)
- Interface atualizada com melhor usabilidade

---

## ✨ Novas Funcionalidades

### 🏭 Gestão de Ordens de Produção
- Cadastro de ordens de fabricação, projeto e produção
- Rastreamento de status de ordens
- Vinculação de materiais a ordens
- Relatórios de produção

**Issues:** #234, #235, #236  
**RFC:** RFC-2026-001

### 📊 Dashboard Aprimorado
- Novos gráficos de consumo de materiais
- Indicadores de performance em tempo real
- Filtros avançados

**Issues:** #240, #241

---

## 🚀 Melhorias

- **Performance:** Queries otimizadas resultam em 30% de redução no tempo de resposta (#250)
- **UX:** Interface mais intuitiva para cadastro de retiradas (#245)
- **Segurança:** Implementação de rate limiting em APIs críticas (#248)
- **Relatórios:** Export para Excel agora inclui mais detalhes (#242)

---

## 🐛 Correções de Bugs

- Corrigido erro ao salvar consumível com nome vazio (#220)
- Corrigido cálculo incorreto de estoque em cenários edge case (#225)
- Corrigido problema de encoding em relatórios PDF (#228)
- Corrigido layout quebrado em resoluções < 1366px (#230)
- Corrigido memory leak em listagem de peças (#233)

**Total de bugs corrigidos:** 15

---

## 🔧 Mudanças Técnicas

### Backend
- Atualização do Spring Boot 3.1.5 → 3.2.0
- Implementação de cache Redis para consultas frequentes
- Refatoração do serviço de relatórios

### Frontend
- Atualização do Next.js 14.0.3 → 14.0.4
- Migração de componentes para Server Components
- Implementação de lazy loading para imagens

### Database
- Novo índice em `retiradas.created_at` (melhora performance de relatórios)
- Procedure para limpeza automática de logs antigos
- Particionamento da tabela `audit_log`

---

## ⚠️ Breaking Changes

**Nenhuma mudança incompatível nesta versão.**

---

## 🔐 Segurança

- Atualização de dependências com vulnerabilidades conhecidas
- Implementação de CSRF tokens em formulários
- Headers de segurança aprimorados

**CVEs Corrigidos:** Nenhum crítico  
**Scan de Vulnerabilidades:** ✅ Aprovado

---

## 📦 Migração

### Upgrades da v1.1.x para v1.2.0

**1. Backup:**
```bash
./scripts/backup-database.sh
```

**2. Update do código:**
```bash
git pull origin main
git checkout v1.2.0
```

**3. Migração de database:**
```bash
docker-compose run backend ./mvnw flyway:migrate
```

**4. Restart:**
```bash
docker-compose down
docker-compose up -d
```

**Tempo estimado:** 15 minutos  
**Downtime:** ~5 minutos

### Rollback

Se necessário reverter:
```bash
git checkout v1.1.9
docker-compose down
./scripts/restore-database.sh backup_20260209.dump.gz
docker-compose up -d
```

---

## 📚 Documentação

- [Guia de Instalação](docs/INSTALL.md)
- [API Documentation](docs/API.md)
- [Manual do Usuário](docs/USER_MANUAL.md)
- [Release FAQ](docs/RELEASE_FAQ.md)

---

## 🙏 Agradecimentos

Obrigado a todos os contribuidores desta release:

- @joaoelia - Lead Developer
- @dev-team - Development
- @qa-team - Quality Assurance
- @design-team - UI/UX

E a todos os usuários que reportaram bugs e sugeriram melhorias!

---

## 📅 Próxima Release

**v1.3.0** previsto para **Julho/2026**

**Planejado:**
- Integração com ERP SAP
- App mobile (iOS/Android)
- Módulo de manutenção preventiva

---

## 📞 Suporte

**Issues?** Abra um ticket: [GitHub Issues](https://github.com/joaoelia/EngenhariaNEP/issues)  
**Discussões:** [GitHub Discussions](https://github.com/joaoelia/EngenhariaNEP/discussions)  
**Email:** suporte@nep.com

---

**Aprovado por:** Pedro Oliveira, Gerente de TI  
**Data:** 09/02/2026
```

---

## 5. TEMPLATE DE CERTIFICADO DE APROVAÇÃO

```markdown
# 📜 CERTIFICADO DE APROVAÇÃO DE SOFTWARE

**Certificado Nº:** CERT-2026-002  
**Sistema:** AeroGestor - Sistema de Gerenciamento Industrial  
**Versão:** v1.2.0

---

## INFORMAÇÕES DE IDENTIFICAÇÃO

| Item | Detalhes |
|------|----------|
| **Versão** | v1.2.0 |
| **Build** | 20260209.001 |
| **Git Commit** | ac4bdaa8432f1c149afbf4c8996fb92427ae41e4 |
| **Git Tag** | v1.2.0 |
| **Data de Build** | 09/02/2026 14:30:00 UTC |
| **Baseline** | BL-2026-002 |

---

## VERIFICAÇÕES REALIZADAS

### ✅ Testes Funcionais
- **Total de Casos de Teste:** 150
- **Passaram:** 147
- **Taxa de Sucesso:** 98%
- **Executado por:** QA Team
- **Data:** 08-09/02/2026

### ✅ Testes de Integração
- **Cobertura:** 100% dos módulos
- **Status:** Todos passaram
- **Executado por:** QA Team
- **Data:** 09/02/2026

### ✅ Testes E2E
- **Fluxos Críticos Testados:** 12
- **Status:** Todos operacionais
- **Executado por:** QA Automation
- **Data:** 09/02/2026

### ✅ Testes de Performance
- **Tempo de Resposta:** <2s (meta: <2s)
- **Capacidade:** 150 usuários simultâneos (meta: 100)
- **Uptime:** 99.9% durante testes de stress
- **Executado por:** DevOps Team
- **Data:** 09/02/2026

### ✅ Security Audit
- **Vulnerabilidades Críticas:** 0
- **Vulnerabilidades Altas:** 0
- **Scan Tool:** Trivy, OWASP ZAP
- **Executado por:** Security Team
- **Data:** 09/02/2026

---

## APROVAÇÕES

### Code Review
**Aprovador:** @tech-lead  
**Data:** 09/02/2026 10:00  
**Status:** ✅ Aprovado

### QA Sign-off
**Aprovador:** @qa-lead  
**Data:** 09/02/2026 14:00  
**Status:**  Aprovado  
**Relatório:** [QA Report v1.2.0](reports/qa-report-v1.2.0.pdf)

### Security Review
**Aprovador:** @security-team  
**Data:** 09/02/2026 15:00  
**Status:** ✅ Aprovado  
**Relatório:** [Security Scan v1.2.0](reports/security-scan-v1.2.0.pdf)

### Management Approval
**Aprovador:** Pedro Oliveira, Gerente de TI  
**Data:** 09/02/2026 16:00  
**Status:** ✅ Aprovado

---

## CERTIFICAÇÃO

Este é para certificar que o software **AeroGestor v1.2.0** foi verificado e atende a todos os requisitos estabelecidos, incluindo:

- ✅ Requisitos funcionais implementados e testados
- ✅ Requisitos não-funcionais validados
- ✅ Padrões de qualidade atendidos
- ✅ Procedimentos de segurança seguidos
- ✅ Documentação completa e atualizada
- ✅ Procedimento de controle de mudanças seguido

**Status:** ✅ **APROVADO PARA PRODUÇÃO**

---

## DEPLOY AUTORIZADO

**Ambiente:** Produção (aerogestor.nep.com)  
**Data de Deploy:** 10/02/2026 08:00 BRT  
**Janela de Manutenção:** 08:00 - 08:30 BRT  
**Executado por:** DevOps Team  
**Plano de Rollback:** Disponível (v1.1.9)

---

## RASTREABILIDADE

**RFCs Implementados:**
- RFC-2026-001: Gestão de Ordens de Produção
- RFC-2026-002: Otimização de Performance

**Issues Resolvidos:** #220-#250 (30 issues)  
**Pull Requests:** #451-#480 (29 PRs)

---

## ASSINATURAS

**Elaborado por:**  
Nome: João Silva  
Cargo: QA Lead  
Data: 09/02/2026  
Assinatura: _______________________

**Aprovado por:**  
Nome: Pedro Oliveira  
Cargo: Gerente de TI  
Data: 09/02/2026  
Assinatura: _______________________

---

**Documento controlado - PROC-QA-001**  
**Hash SHA-256 deste certificado:** e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

---

_Continua..._

**Nota:** Este documento contém 10 templates. Os templates 6-10 (NCR, CAPA, Teste de Recovery, Relatório de Auditoria, Checklist de Deploy) estão detalhados nas seções seguintes do documento.

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial com templates 1-5 |
