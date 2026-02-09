# Procedimento de Controle de Mudanças
**PROC-SCM-001**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026  
**Próxima Revisão:** 09/08/2026

---

## 1. OBJETIVO

Estabelecer procedimento padronizado para controlar todas as modificações no software de aceitação de produto, garantindo rastreabilidade, aprovação e documentação adequadas.

## 2. APLICAÇÃO

Este procedimento aplica-se a todas as mudanças em:
- Código fonte (frontend/backend)
- Estrutura de banco de dados
- Configurações de sistema
- Dependências de terceiros
- Documentação técnica

## 3. TIPOS DE MUDANÇA

### 3.1 Classificação por Severidade

#### CRÍTICA (P0)
- Correção de vulnerabilidades de segurança
- Correção de bugs que impedem operação
- Perda de dados
- **SLA:** 4 horas para análise, 24h para resolução

#### ALTA (P1)
- Funcionalidade importante não operacional
- Performance severamente degradada
- **SLA:** 24 horas para análise, 72h para resolução

#### MÉDIA (P2)
- Nova funcionalidade solicitada
- Melhoria de usabilidade
- **SLA:** 5 dias úteis para análise

#### BAIXA (P3)
- Melhorias cosméticas
- Refatoração de código
- **SLA:** 15 dias úteis para análise

### 3.2 Classificação por Tipo

| Tipo | Código | Descrição | Revisão Necessária |
|------|--------|-----------|-------------------|
| Feature | FEAT | Nova funcionalidade | Code Review + QA |
| Bugfix | FIX | Correção de defeito | Code Review + QA |
| Hotfix | HOTF | Correção urgente | Code Review mínimo |
| Refactor | REFAC | Melhoria de código | Code Review |
| Docs | DOCS | Documentação | Revisão técnica |
| Config | CONF | Mudança de configuração | Revisão DevOps |

## 4. PROCESSO DE SOLICITAÇÃO

### 4.1 Abertura de Issue
1. Acessar repositório GitHub
2. Criar nova Issue usando template apropriado
3. Preencher todos os campos obrigatórios:
   - Título descritivo
   - Tipo de mudança
   - Prioridade
   - Descrição detalhada
   - Justificativa de negócio
   - Impacto esperado
   - Anexos (prints, logs, etc.)

### 4.2 Template de Issue

```markdown
## Tipo de Mudança
[ ] Feature  [ ] Bugfix  [ ] Hotfix  [ ] Refactor  [ ] Docs  [ ] Config

## Prioridade
[ ] P0-Crítica  [ ] P1-Alta  [ ] P2-Média  [ ] P3-Baixa

## Descrição
[Descreva a mudança solicitada]

## Justificativa
[Por que esta mudança é necessária?]

## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Impacto
**Sistemas Afetados:**
- [ ] Frontend
- [ ] Backend
- [ ] Banco de Dados
- [ ] Infraestrutura

**Usuários Impactados:** [número/tipo]
**Downtime Necessário:** [sim/não, tempo estimado]

## Testes Necessários
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes de aceitação
- [ ] Testes de performance
- [ ] Testes de regressão

## Documentação
- [ ] README atualizado
- [ ] API docs atualizada
- [ ] Manual do usuário atualizado
- [ ] Changelog atualizado

## Anexos
[Screenshots, logs, diagramas]
```

## 5. PROCESSO DE APROVAÇÃO

### 5.1 Fluxo de Aprovação

```
┌─────────────────┐
│ Issue Criada    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Triagem         │ ◄── Gerente TI
│ (24h máximo)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Aprovação       │ ◄── Tech Lead
│ Técnica         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Desenvolvimento │ ◄── Desenvolvedor
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Code Review     │ ◄── Revisor (mín. 1)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Testes QA       │ ◄── QA
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Aprovação Final │ ◄── Gerente TI
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy          │ ◄── DevOps
└─────────────────┘
```

### 5.2 Critérios de Aprovação

**Aprovação Técnica (Tech Lead):**
- [ ] Mudança alinhada com arquitetura do sistema
- [ ] Estimativa de esforço razoável
- [ ] Recursos disponíveis
- [ ] Prioridade justificada

**Code Review (Desenvolvedor Sênior):**
- [ ] Código segue padrões estabelecidos
- [ ] Sem vulnerabilidades de segurança evidentes
- [ ] Testes adequados incluídos
- [ ] Documentação atualizada
- [ ] Performance não degradada

**QA (Quality Assurance):**
- [ ] Todos os testes passaram
- [ ] Critérios de aceitação atendidos
- [ ] Sem regressões identificadas
- [ ] Comportamento conforme especificado

**Aprovação Final (Gerente TI):**
- [ ] Todas as aprovações anteriores obtidas
- [ ] Documentação completa
- [ ] Riscos identificados e mitigados
- [ ] Plano de rollback preparado

## 6. DESENVOLVIMENTO

### 6.1 Branch Strategy

```
main (produção)
  │
  ├── develop (desenvolvimento)
  │     │
  │     ├── feature/AERO-123-nova-funcionalidade
  │     ├── feature/AERO-124-outra-feature
  │     └── ...
  │
  └── hotfix/AERO-999-correcao-critica
```

### 6.2 Criação de Branch
```bash
# Para features
git checkout develop
git pull origin develop
git checkout -b feature/AERO-123-descricao-curta

# Para hotfix
git checkout main
git pull origin main
git checkout -b hotfix/AERO-999-descricao-curta
```

### 6.3 Padrão de Commits

**Formato:**
```
[TIPO] #ISSUE: Descrição concisa (max 72 caracteres)

Descrição detalhada do que foi alterado e por quê.
Pode ter múltiplas linhas.

Refs: #123, #124
```

**Exemplos:**
```bash
[FEAT] #123: Adicionar módulo de retirada de materiais

Implementa funcionalidade completa de retirada incluindo:
- Formulário de solicitação
- Validação de estoque disponível
- Registro de histórico
- Atualização automática de inventário

Refs: #123

[FIX] #456: Corrigir cálculo de quantidade disponível

O cálculo estava considerando apenas entradas e não
estava subtraindo as retiradas já registradas.

Refs: #456
```

## 7. CODE REVIEW

### 7.1 Checklist do Revisor

**Arquitetura e Design:**
- [ ] Mudanças alinhadas com arquitetura do sistema
- [ ] Princípios SOLID respeitados
- [ ] Sem duplicação desnecessária de código
- [ ] Separação adequada de responsabilidades

**Código:**
- [ ] Código legível e auto-explicativo
- [ ] Nomenclatura clara e consistente
- [ ] Comentários onde necessário (não óbvio)
- [ ] Sem código comentado ou debug code

**Segurança:**
- [ ] Validação de inputs
- [ ] Proteção contra SQL Injection
- [ ] Proteção contra XSS
- [ ] Dados sensíveis não expostos em logs
- [ ] Autenticação/autorização adequada

**Performance:**
- [ ] Queries otimizadas
- [ ] Sem loops desnecessários
- [ ] Caching utilizado apropriadamente
- [ ] Recursos liberados adequadamente

**Testes:**
- [ ] Testes unitários incluídos
- [ ] Cobertura adequada (>80%)
- [ ] Testes de integração quando necessário
- [ ] Edge cases considerados

**Documentação:**
- [ ] README atualizado
- [ ] API docs atualizada
- [ ] Comentários JSDoc/Javadoc
- [ ] CHANGELOG atualizado

### 7.2 Processo de Revisão
1. Desenvolvedor cria Pull Request (PR)
2. Sistema executa testes automatizados
3. Revisor analisa mudanças em até 48h
4. Revisor adiciona comentários/sugestões
5. Desenvolvedor ajusta conforme feedback
6. Revisor aprova o PR
7. Merge realizado

## 8. TESTES

### 8.1 Testes Obrigatórios

**Para Features (FEAT):**
- Testes unitários (>80% cobertura)
- Testes de integração
- Testes de aceitação
- Testes de regressão (casos críticos)

**Para Bugfix (FIX):**
- Teste reproduzindo o bug
- Teste validando a correção
- Testes de regressão relacionados

**Para Hotfix (HOTF):**
- Teste mínimo validando correção
- Smoke tests em produção

### 8.2 Ambientes de Teste

| Ambiente | Proposito | Deploy | Dados |
|----------|-----------|--------|-------|
| Local | Desenvolvimento | Manual | Sintéticos |
| Development | Integração contínua | Automático (PR) | Sintéticos |
| Staging | Homologação | Manual aprovado | Cópia prod (anonimizados) |
| Production | Produção | Manual aprovado | Reais |

## 9. DEPLOY

### 9.1 Checklist Pré-Deploy

**Preparação:**
- [ ] Backup completo realizado
- [ ] Plano de rollback documentado
- [ ] Janela de manutenção comunicada
- [ ] Equipe de suporte avisada
- [ ] Monitoramento preparado

**Validação:**
- [ ] Todos os testes passaram
- [ ] Code review aprovado
- [ ] QA sign-off obtido
- [ ] Gerência aprovada
- [ ] Documentação atualizada

**Técnico:**
- [ ] Versão tagueada no Git
- [ ] Notas de release criadas
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações de DB testadas
- [ ] Assets compilados

### 9.2 Procedimento de Deploy

**Para Mudanças Normais:**
```bash
# 1. Criar tag de versão
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0

# 2. Deploy staging
cd infrastructure
docker-compose -f docker-compose.staging.yml up -d

# 3. Testes de smoke
./scripts/smoke-tests.sh

# 4. Deploy produção (aprovado)
docker-compose -f docker-compose.prod.yml up -d
```

**Para Hotfix:**
```bash
# 1. Criar hotfix branch
git checkout -b hotfix/v1.2.1 main

# 2. Desenvolver correção
# ... commits ...

# 3. Merge para main
git checkout main
git merge hotfix/v1.2.1
git tag -a v1.2.1 -m "Hotfix 1.2.1"

# 4. Merge para develop
git checkout develop
git merge hotfix/v1.2.1

# 5. Deploy imediato
cd infrastructure
docker-compose -f docker-compose.prod.yml up -d
```

### 9.3 Verificação Pós-Deploy
```bash
# Checklist de verificação (15 min após deploy)
[ ] Aplicação acessível
[ ] Versão correta exibida
[ ] Logs sem erros críticos
[ ] Métricas de performance normais
[ ] Funcionalidades críticas operacionais
[ ] Testes de fumaça executados
```

## 10. DOCUMENTAÇÃO DE MUDANÇAS

### 10.1 Notas de Release

Cada release deve ter notas detalhadas:

```markdown
# Release v1.2.0 - 2026-02-09

## ✨ Novas Funcionalidades
- [FEAT-123] Módulo de controle de retiradas
- [FEAT-124] Dashboard com métricas em tempo real

## 🐛 Correções
- [FIX-456] Corrigido cálculo de estoque disponível
- [FIX-457] Resolvido problema de timeout em relatórios

## 🔧 Melhorias
- [REFAC-789] Otimização de queries do banco de dados
- [REFAC-790] Melhorias de performance na listagem

## 📚 Documentação
- Atualizado manual do usuário
- Adicionados diagramas de arquitetura

## ⚠️ Breaking Changes
Nenhuma mudança incompatível

## 📦 Dependências Atualizadas
- Spring Boot: 3.2.0 → 3.2.1
- React: 18.2.0 → 19.0.0

## 🗄️ Migrações de Banco
- Migration 001: Adicionar tabela retiradas
- Migration 002: Índice em coluna data_retirada

## 🔄 Procedimento de Atualização
1. Parar aplicação
2. Backup do banco de dados
3. Executar migrações
4. Deploy nova versão
5. Verificar logs

## 👥 Contribuidores
- João Elia (@joaoelia)
- Equipe NEP
```

### 10.2 CHANGELOG

Manter arquivo `CHANGELOG.md` atualizado:
```markdown
# Changelog

## [1.2.0] - 2026-02-09
### Added
- Módulo de retiradas de materiais
- Dashboard com gráficos

### Fixed
- Cálculo incorreto de estoque
- Timeout em relatórios grandes

### Changed
- Performance melhorada em 40%

## [1.1.0] - 2026-01-15
...
```

## 11. REGISTRO PERMANENTE

### 11.1 Informações Registradas

Todo deploy mantém registro com:
```json
{
  "release_id": "v1.2.0",
  "timestamp": "2026-02-09T10:30:00Z",
  "deployed_by": "joao.elia@nep.com",
  "environment": "production",
  "previous_version": "v1.1.9",
  "git_commit": "ac4bdaa8",
  "build_number": "20260209.001",
  "changes": [
    {
      "issue": "AERO-123",
      "type": "feature",
      "description": "Módulo de retiradas",
      "author": "João Elia",
      "reviewed_by": "Tech Lead",
      "approved_by": "Gerente TI"
    }
  ],
  "approvals": [
    {
      "role": "Tech Lead",
      "name": "...",
      "date": "2026-02-08"
    },
    {
      "role": "QA",
      "name": "...",
      "date": "2026-02-09"
    }
  ],
  "tests_executed": {
    "unit": {"passed": 234, "failed": 0},
    "integration": {"passed": 45, "failed": 0},
    "e2e": {"passed": 12, "failed": 0}
  },
  "rollback_plan": "docs/rollback-v1.2.0.md"
}
```

### 11.2 Armazenamento de Evidências

Localização dos registros:
- **Repositório Git:** Histórico completo de commits
- **GitHub Issues:** Rastreamento de mudanças
- **Pull Requests:** Code reviews e aprovações
- **CI/CD Logs:** Testes e deploys
- **Arquivo JSON:** `/docs/releases/v1.2.0.json`

## 12. RESPONSABILIDADES

| Atividade | Responsável | Prazo |
|-----------|-------------|-------|
| Criar issue | Solicitante | Imediato |
| Triagem | Gerente TI | 24h |
| Aprovação técnica | Tech Lead | 48h |
| Desenvolvimento | Desenvolvedor | Conforme estimativa |
| Code review | Revisor | 48h após PR |
| Testes QA | QA | 48h após code review |
| Aprovação deploy | Gerente TI | 24h após QA |
| Deploy | DevOps | Conforme janela |
| Verificação pós-deploy | DevOps | 15min após deploy |

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
