# Documentação - Sistema de Gerenciamento de Configuração

**AeroGestor - NEP Aviation Parts**

---

## 📚 Índice de Documentos

### Planejamento e Governança

| Documento | Descrição | Versão |
|-----------|-----------|--------|
| **[PGCS](PGCS-Plano-Gerenciamento-Configuracao-Software.md)** | Plano de Gerenciamento de Configuração de Software | v1.0 |
| **[COMPLIANCE-MATRIX](COMPLIANCE-MATRIX.md)** | Matriz de Compliance (AS9100D, ISO 9001) | v1.0 |

---

### Procedimentos Operacionais

#### Gerenciamento de Configuração

| Código | Documento | Descrição | Versão |
|--------|-----------|-----------|--------|
| PROC-SCM-001 | **[Controle de Mudanças](PROC-SCM-001-Controle-Mudancas.md)** | Processo de RFC e CCB | v1.0 |
| PROC-SCM-002 | **[Rastreamento de Problemas](PROC-SCM-002-Rastreamento-Problemas.md)** | Gestão de Issues e Bugs | v1.0 |
| PROC-SCM-003 | **[Controle de Mídia e Backup](PROC-SCM-003-Controle-Midia-Backup.md)** | Backup, Recovery e Controle de Mídia | v1.0 |

#### Qualidade e Segurança

| Código | Documento | Descrição | Versão |
|--------|-----------|-----------|--------|
| PROC-QA-001 | **[Verificação de Software](PROC-QA-001-Verificacao-Software.md)** | Testes e Aprovação Pré-Produção | v1.0 |
| PROC-SEC-001 | **[Segurança e Controle de Acesso](PROC-SEC-001-Seguranca-Controle-Acesso.md)** | Política de Segurança e RBAC | v1.0 |

#### Auditoria

| Código | Documento | Descrição | Versão |
|--------|-----------|-----------|--------|
| PROC-AUD-001 | **[Auditoria de Configuração](PROC-AUD-001-Auditoria-Configuracao.md)** | Auditorias PCA/FCA/Processo | v1.0 |

---

### Templates e Formulários

| Documento | Descrição | Versão |
|-----------|-----------|--------|
| **[TEMPLATES-Formularios](TEMPLATES-Formularios.md)** | Templates de RFC, Issue, Baseline, Release Notes, etc. | v1.0 |

---

## 🗂️ Estrutura de Documentação

```
docs/
├── README.md                                          # Este arquivo
│
├── PGCS-Plano-Gerenciamento-Configuracao-Software.md # Plano Mestre
│
├── Procedimentos/
│   ├── PROC-SCM-001-Controle-Mudancas.md
│   ├── PROC-SCM-002-Rastreamento-Problemas.md
│   ├── PROC-SCM-003-Controle-Midia-Backup.md
│   ├── PROC-QA-001-Verificacao-Software.md
│   ├── PROC-SEC-001-Seguranca-Controle-Acesso.md
│   └── PROC-AUD-001-Auditoria-Configuracao.md
│
├── Templates/
│   └── TEMPLATES-Formularios.md
│
├── Compliance/
│   └── COMPLIANCE-MATRIX.md
│
├── Registros/                                         # A ser criado
│   ├── baselines/
│   ├── certificates/
│   ├── audits/
│   ├── ncr/
│   └── capa/
│
└── Referencias/                                       # Futuro
    ├── AS9100D-Requirements.pdf
    └── ISO9001-2015.pdf
```

---

## 🎯 Propósito da Documentação

Esta documentação estabelece o **Sistema de Gerenciamento de Configuração de Software** para o projeto AeroGestor, visando:

1. **Conformidade Regulatória:** Atender requisitos de certificações aeroespaciais (AS9100D) e de qualidade (ISO 9001:2015)
2. **Rastreabilidade:** Garantir rastreamento completo de requisitos → código → testes → deploy
3. **Controle de Qualidade:** Processos estruturados de verificação, validação e auditoria
4. **Gestão de Mudanças:** Controle rigoroso de alterações no software
5. **Continuidade de Negócio:** Procedimentos de backup/recovery robustos
6. **Segurança da Informação:** Controle de acesso e auditoria de ações

---

## 📖 Guia Rápido por Papel

### Para Desenvolvedores

**Leitura Obrigatória:**
1. [PROC-SCM-001](PROC-SCM-001-Controle-Mudancas.md) - Como criar RFCs e PRs
2. [PROC-SCM-002](PROC-SCM-002-Rastreamento-Problemas.md) - Como reportar e resolver bugs
3. [TEMPLATES](TEMPLATES-Formularios.md) - Templates de RFC e Issue

**Fluxo de Trabalho:**
RFC → Aprovação → Branch → Desenvolvimento → PR → Review → Merge → Deploy

---

### Para QA/Testes

**Leitura Obrigatória:**
1. [PROC-QA-001](PROC-QA-001-Verificacao-Software.md) - Procedimentos de teste e aprovação
2. [TEMPLATES](TEMPLATES-Formularios.md) - Certificado de Aprovação, Relatório de Testes

**Responsabilidades:**
- Executar testes funcionais, integração, E2E
- Emitir Certificados de Aprovação
- Validar conformidade com requisitos

---

### Para DevOps/SRE

**Leitura Obrigatória:**
1. [PROC-SCM-003](PROC-SCM-003-Controle-Midia-Backup.md) - Backup e recovery
2. [PROC-SEC-001](PROC-SEC-001-Seguranca-Controle-Acesso.md) - Segurança e controle de acesso

**Responsabilidades:**
- Executar backups diários/semanais
- Realizar testes de recovery
- Gerenciar controle de acesso
- Monitorar logs de auditoria

---

### Para Gestores/Gerência

**Leitura Obrigatória:**
1. [PGCS](PGCS-Plano-Gerenciamento-Configuracao-Software.md) - Visão geral do sistema SCM
2. [COMPLIANCE-MATRIX](COMPLIANCE-MATRIX.md) - Status de compliance e métricas
3. [PROC-AUD-001](PROC-AUD-001-Auditoria-Configuracao.md) - Processo de auditoria

**Responsabilidades:**
- Aprovar mudanças significativas (CCB)
- Revisar relatórios de auditoria
- Aprovar NCRs e CAPAs
- Decidir sobre investimentos em infraestrutura

---

### Para Auditores (Internos/Externos)

**Documentos Principais:**
1. [COMPLIANCE-MATRIX](COMPLIANCE-MATRIX.md) - Mapeamento compliance → implementação
2. [PROC-AUD-001](PROC-AUD-001-Auditoria-Configuracao.md) - Procedimentos de auditoria
3. Todos os **Registros/** (baselines, certificados, NCRs, CAPAs)

**Evidências Disponíveis:**
- Histórico Git completo
- RFCs, Issues, PRs no GitHub
- Logs de backup e recovery
- Logs de auditoria (audit_log database)
- Relatórios de testes

---

## 🔄 Ciclo de Vida de uma Mudança

```
┌─────────────────────────────────────────────────────────────────┐
│                     Fluxo de Mudança                            │
└─────────────────────────────────────────────────────────────────┘

1. PROPOSTA
   ↓
   [RFC criado] → Análise de Impacto → Estimativa
   ↓
2. APROVAÇÃO
   ↓
   CCB Review → Aprovações (Tech/PO/QA/DevOps) → RFC Aprovado
   ↓
3. IMPLEMENTAÇÃO
   ↓
   Branch → Desenvolvimento → Testes Unitários → PR
   ↓
4. REVISÃO
   ↓
   Code Review → CI/CD → Testes Automáticos → Aprovação PR
   ↓
5. DEPLOY
   ↓
   Staging → Testes QA → Certificado Aprovação → Produção
   ↓
6. VERIFICAÇÃO
   ↓
   Smoke Tests → Monitoramento → Feedback → Baseline Atualizado
   ↓
7. AUDITORIA
   ↓
   Auditoria Física (PCA) → Rastreabilidade Verificada → Fechamento
```

---

## 📊 Métricas de Qualidade (Q1/2026)

| Métrica | Valor Atual | Meta | Status |
|---------|-------------|------|--------|
| Taxa de Conformidade SCM | 97% | >95% | ✅ |
| % Commits com PR Review | 98% | >95% | ✅ |
| Cobertura de Testes | 82% | >80% | ✅ |
| Backups Bem-sucedidos | 99.8% | >99% | ✅ |
| RTO (Tempo de Recuperação) | 45 min | <60 min | ✅ |
| Issues Resolvidos/Mês | 52 | >40 | ✅ |
| NCRs Abertos/Trimestre | 1 | <5 | ✅ |

---

## 🆘 Procedimentos de Emergência

### Incidente de Segurança
**Procedimento:** [PROC-SEC-001](PROC-SEC-001-Seguranca-Controle-Acesso.md) - Seção 6  
**Contato:** security@nep.com

### Perda de Dados / Corruption
**Procedimento:** [PROC-SCM-003](PROC-SCM-003-Controle-Midia-Backup.md) - Seção 6  
**Scripts:** `restore-database.sh`, `pitr-restore.sh`

### Bug Crítico em Produção
**Procedimento:** [PROC-SCM-002](PROC-SCM-002-Rastreamento-Problemas.md) - Fluxo Fast-Track  
**Contato:** devops@nep.com

### Falha de Certificação
**Procedimento:** [PROC-AUD-001](PROC-AUD-001-Auditoria-Configuracao.md) - Seção 6 (NCR/CAPA)  
**Contato:** qualidade@nep.com

---

## 🔗 Links Úteis

- **Repositório GitHub:** [https://github.com/joaoelia/EngenhariaNEP](https://github.com/joaoelia/EngenhariaNEP)
- **Issues:** [https://github.com/joaoelia/EngenhariaNEP/issues](https://github.com/joaoelia/EngenhariaNEP/issues)
- **Pull Requests:** [https://github.com/joaoelia/EngenhariaNEP/pulls](https://github.com/joaoelia/EngenhariaNEP/pulls)
- **Releases:** [https://github.com/joaoelia/EngenhariaNEP/releases](https://github.com/joaoelia/EngenhariaNEP/releases)

---

## 📞 Contatos

| Papel | Email | Extensão |
|-------|-------|----------|
| **Gerente de TI** | pedro.oliveira@nep.com | 1001 |
| **Tech Lead** | joao.elia@nep.com | 1002 |
| **QA Lead** | joao.silva@nep.com | 1003 |
| **DevOps** | maria.santos@nep.com | 1004 |
| **Security** | carlos.ferreira@nep.com | 1005 |
| **Qualidade** | ana.costa@nep.com | 1006 |

**Suporte Geral:** suporte@nep.com  
**Emergências:** emergencia@nep.com (24/7)

---

## 📅 Revisões de Documentação

Esta documentação é revisada:
- **Mensalmente:** Verificação de atualidade
- **Trimestralmente:** Auditoria de processo (PROC-AUD-001)
- **Anualmente:** Revisão completa do PGCS

**Próxima Revisão Programada:** 09/05/2026

---

## ✅ Status de Implementação

| Componente | Status | Notas |
|------------|--------|-------|
| Documentação | ✅ 100% | Versão inicial completa |
| Controle de Versão (Git) | ✅ 100% | GitHub configurado |
| Processo de Mudanças (RFC) | ✅ 100% | Templates criados |
| Rastreamento de Issues | ✅ 100% | GitHub Issues |
| Backup/Recovery | ✅ 100% | Scripts implementados |
| Controle de Acesso | ✅ 100% | RBAC implementado |
| Auditoria | ✅ 100% | Procedimentos definidos |
| Testes Automatizados | 🔄 82% | Em expansão |
| Dashboard de Métricas | 🔄 60% | Em desenvolvimento |
| Certificação AS9100D | ⏳ 0% | Planejado Nov/2026 |

**Legenda:**
- ✅ Implementado
- 🔄 Em Progresso
- ⏳ Planejado
- ❌ Não Iniciado

---

## 📝 Como Contribuir com a Documentação

1. **Identificar necessidade:** Documento faltante ou desatualizado
2. **Criar Issue:** [Tipo: documentation] no GitHub
3. **Fazer proposta:** Fork → Branch → Edição → PR
4. **Revisão:** Tech Lead + QA Lead aprovam
5. **Merge:** Documentação atualizada
6. **Comunicar:** Notificar equipe sobre mudanças

**Padrões de Documentação:**
- Formato: Markdown (.md)
- Encoding: UTF-8
- Line endings: LF
- Estrutura: Seções numeradas, tabelas para dados estruturados
- Versionamento: Tabela de revisões no rodapé
- Linguagem: Português (Brasil) com termos técnicos em inglês quando apropriado

---

## 📄 Licença e Propriedade

**Proprietário:** NEP Aviation Parts Ltda.  
**Classificação:** Uso Interno  
**Confidencialidade:** Confidencial (compartilhar apenas com auditores autorizados)

© 2026 NEP Aviation Parts - Todos os direitos reservados

---

**Última Atualização:** 09/02/2026  
**Mantenedor:** João Elia (@joaoelia)  
**Versão da Documentação:** 1.0
