# Plano de Gerenciamento de Configuração de Software (PGCS)
**Sistema AeroGestor - Sistema de Gerenciamento Industrial**

**Revisão:** 1.0  
**Data:** 09/02/2026  
**Aprovado por:** Gerência de TI - NEP Aviation  
**Próxima revisão:** 09/08/2026

---

## 1. OBJETIVO

Este documento estabelece o Plano de Gerenciamento de Configuração de Software (PGCS) para o sistema AeroGestor, definindo processos e procedimentos para controlar e rastrear todas as versões de software utilizadas na aceitação de produtos aeronáuticos.

## 2. ESCOPO

Este plano aplica-se a:
- Software AeroGestor (Frontend e Backend)
- Bibliotecas e dependências de terceiros
- Scripts de banco de dados
- Configurações de infraestrutura
- Documentação técnica associada

## 3. IDENTIFICAÇÃO DO SOFTWARE

### 3.1 Nomenclatura de Versões
O sistema utiliza **Versionamento Semântico** (SemVer):
```
MAJOR.MINOR.PATCH-BUILD
```
- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis
- **BUILD**: Número sequencial da compilação

**Exemplo:** `1.2.3-20260209.001`

### 3.2 Identificação por Aplicação

#### Frontend (Next.js)
- **ID Sistema:** AERO-FRONT
- **Versão Atual:** 1.0.0
- **Localização:** `/frontend`
- **Tecnologia:** Next.js 16.0.10, React 19, TypeScript

#### Backend (Spring Boot)
- **ID Sistema:** AERO-BACK
- **Versão Atual:** 1.0.0
- **Localização:** `/backend`
- **Tecnologia:** Java 17, Spring Boot 3.2.1

#### Banco de Dados
- **ID Sistema:** AERO-DB
- **Versão do Schema:** 1.0.0
- **SGBD:** MySQL 8.0
- **Localização Scripts:** `/infrastructure/database`

### 3.3 Matriz de Configuração Aprovada

| Componente | Versão Aprovada | Data Aprovação | Aprovador | Hash SHA-256 |
|------------|----------------|----------------|-----------|--------------|
| AERO-FRONT | 1.0.0 | 09/02/2026 | GER-TI | [calculado no build] |
| AERO-BACK  | 1.0.0 | 09/02/2026 | GER-TI | [calculado no build] |
| AERO-DB    | 1.0.0 | 09/02/2026 | GER-TI | [calculado no script] |

## 4. CONTROLE DE VERSÕES

### 4.1 Repositório de Código
- **Sistema:** Git + GitHub
- **URL:** https://github.com/joaoelia/EngenhariaNEP
- **Branch Principal:** `main` (protegida)
- **Branch de Desenvolvimento:** `develop`
- **Branch de Features:** `feature/*`
- **Branch de Hotfix:** `hotfix/*`

### 4.2 Fluxo de Aprovação
1. **Desenvolvimento:** Criação de feature branch
2. **Code Review:** Pull Request com revisão obrigatória
3. **Testes:** Execução de testes automatizados
4. **Aprovação:** Mínimo 1 aprovador técnico
5. **Merge:** Integração na branch main
6. **Tag:** Criação de tag de versão
7. **Release:** Publicação com notas de versão

### 4.3 Rastreabilidade
Cada commit deve incluir:
- **ID da Tarefa/Issue**
- **Descrição clara da mudança**
- **Motivo da mudança**
- **Impacto no sistema**

Formato de commit:
```
[TIPO] #ISSUE: Descrição

TIPO: feat|fix|docs|refactor|test|chore
ISSUE: Número da issue no sistema
```

## 5. CONTROLE DE SOFTWARES OBSOLETOS

### 5.1 Ciclo de Vida de Versões
- **Ativa:** Versão em uso na produção
- **Suportada:** Versão anterior ainda mantida (6 meses)
- **Descontinuada:** Sem suporte, substituição obrigatória
- **Obsoleta:** Desativada e arquivada

### 5.2 Registro de Versões Obsoletas

| Versão | Data Descontinuação | Motivo | Substituída por |
|--------|-------------------|--------|-----------------|
| -      | -                 | -      | -               |

### 5.3 Procedimento de Descontinuação
1. Notificação 30 dias antes da descontinuação
2. Atualização da documentação
3. Migração de dados (se necessário)
4. Arquivamento da versão antiga
5. Atualização da matriz de configuração

## 6. INTEGRAÇÃO SOFTWARE/HARDWARE

### 6.1 Especificação de Hardware Mínimo

#### Servidor de Aplicação
- **Processador:** 4 cores, 2.5 GHz
- **Memória RAM:** 8 GB
- **Armazenamento:** 50 GB SSD
- **Sistema Operacional:** Linux Ubuntu 22.04 LTS ou Docker
- **Java Runtime:** OpenJDK 17
- **Node.js:** 18.x ou superior

#### Servidor de Banco de Dados
- **Processador:** 4 cores, 2.5 GHz
- **Memória RAM:** 16 GB
- **Armazenamento:** 100 GB SSD
- **Sistema Operacional:** Linux Ubuntu 22.04 LTS ou Docker
- **MySQL:** 8.0

#### Estações Cliente
- **Navegador:** Chrome 120+, Firefox 120+, Edge 120+
- **Resolução:** Mínimo 1366x768
- **Conexão:** Internet 10 Mbps

### 6.2 Matriz de Compatibilidade

| Software | Versão | Hardware | SO Compatível | Observações |
|----------|--------|----------|---------------|-------------|
| AERO-FRONT | 1.0.0 | Cliente Web | Qualquer com navegador | Responsivo |
| AERO-BACK | 1.0.0 | Servidor App | Ubuntu 22.04, Docker | JDK 17 |
| AERO-DB | 1.0.0 | Servidor DB | Ubuntu 22.04, Docker | MySQL 8.0 |

## 7. REFERÊNCIA CRUZADA DE DOCUMENTOS

### 7.1 Documentos Relacionados

| Documento | Código | Versão | Relacionado com |
|-----------|--------|--------|-----------------|
| Manual de Instalação | DOC-INST-001 | 1.0 | AERO-FRONT, AERO-BACK, AERO-DB |
| Procedimento de Backup | PROC-BKP-001 | 1.0 | AERO-DB |
| Manual do Usuário | DOC-USER-001 | 1.0 | AERO-FRONT |
| API Reference | DOC-API-001 | 1.0 | AERO-BACK |
| Procedimento de Atualização | PROC-UPD-001 | 1.0 | AERO-FRONT, AERO-BACK |

### 7.2 Código Fonte Associado

| Módulo | Repositório | Branch | Última Versão |
|--------|-------------|--------|---------------|
| Frontend | /frontend | main | 1.0.0 |
| Backend | /backend | main | 1.0.0 |
| Infraestrutura | /infrastructure | main | 1.0.0 |

## 8. SISTEMA DE CONTROLE DE DOCUMENTOS

### 8.1 Identificação de Documentos
Formato: `[TIPO]-[MÓDULO]-[SEQUENCIAL]`
- **TIPO:** DOC (Documento), PROC (Procedimento), FORM (Formulário)
- **MÓDULO:** Identificador do módulo/sistema
- **SEQUENCIAL:** Número de 3 dígitos

### 8.2 Controle de Revisões

| Revisão | Data | Autor | Descrição das Mudanças | Aprovador |
|---------|------|-------|------------------------|-----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial | GER-TI |

### 8.3 Marcação Externa
Todo software em produção deve exibir:
- Número da versão na interface
- Data do build
- Hash do commit (primeiros 8 caracteres)

**Exemplo de exibição:**
```
AeroGestor v1.0.0-20260209.001 (commit: ac4bdaa8)
```

## 9. IDENTIFICAÇÃO EM NÍVEL DE SISTEMA VS PRODUTO

### 9.1 Nível de Sistema
Identificação do software completo instalado no servidor:
```
Sistema: AeroGestor v1.0.0
Frontend: AERO-FRONT v1.0.0
Backend: AERO-BACK v1.0.0
Database: AERO-DB v1.0.0
Build: 20260209.001
```

### 9.2 Nível de Produto
Cada implantação específica para um cliente/ambiente:
```
Cliente: NEP Aviation
Ambiente: Produção
Sistema: AeroGestor v1.0.0
Configuração: PROD-NEP-001
Data Implantação: 09/02/2026
```

## 10. PROCEDIMENTO DE MODIFICAÇÃO

### 10.1 Solicitação de Mudança
1. Abertura de issue no sistema de controle
2. Avaliação de impacto
3. Aprovação pela gerência
4. Desenvolvimento da mudança
5. Testes de validação
6. Aprovação do QA
7. Documentação da mudança
8. Deploy controlado

### 10.2 Registro de Modificações
Manter log permanente com:
- Data e hora da modificação
- Autor responsável
- Descrição detalhada
- Versão anterior → Versão nova
- Motivo da mudança
- Revisões de código
- Testes realizados
- Aprovações obtidas

## 11. PROTEÇÃO E SEGURANÇA

### 11.1 Controle de Acesso
- Repositório Git: Acesso via autenticação SSH/Token
- Servidor de Produção: Acesso restrito via VPN
- Banco de Dados: Credenciais criptografadas
- Backup: Armazenamento offsite criptografado

### 11.2 Separação de Ambientes
- **Desenvolvimento:** Acesso livre para desenvolvedores
- **Homologação:** Acesso para QA e gerência
- **Produção:** Acesso restrito, apenas deploy automatizado

### 11.3 Masters e Duplicatas
- Código fonte master: GitHub (branch main protegida)
- Backup diário: Servidor NAS local
- Backup semanal: Cloud storage criptografado
- Backups não coexistem no mesmo local

## 12. VERIFICAÇÃO PRÉ-USO

### 12.1 Checklist de Verificação
Antes de cada release em produção:
- [ ] Todos os testes automatizados passaram
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Notas de versão criadas
- [ ] Backup da versão anterior realizado
- [ ] Plano de rollback preparado
- [ ] Hash SHA-256 calculado e registrado
- [ ] Assinatura digital aplicada (se aplicável)

### 12.2 Validação de Conformidade
- Testes de integração com hardware
- Verificação de compatibilidade
- Testes de aceitação do usuário
- Validação de performance

## 13. INSTRUÇÕES DE INSTALAÇÃO

### 13.1 Procedimento de Deploy
Documento detalhado em: `DOC-INST-001-Manual-Instalacao.md`

### 13.2 Verificação Pós-Instalação
- [ ] Frontend acessível
- [ ] Backend respondendo
- [ ] Banco de dados conectado
- [ ] Testes de smoke executados
- [ ] Logs verificados sem erros
- [ ] Versão exibida corretamente

## 14. RESPONSABILIDADES

| Papel | Responsabilidade |
|-------|------------------|
| Gerente de TI | Aprovação final de mudanças |
| Tech Lead | Revisão de código, aprovação técnica |
| Desenvolvedor | Implementação conforme padrões |
| QA | Validação e testes |
| DevOps | Deploy e infraestrutura |

## 15. TREINAMENTO

Todo colaborador com acesso ao sistema deve ser treinado em:
- Uso do sistema de controle de versão
- Procedimentos de código seguro
- Processo de release
- Políticas de segurança

## 16. AUDITORIAS

### 16.1 Frequência
- **Auditoria Interna:** Trimestral
- **Revisão de Conformidade:** Semestral
- **Auditoria Externa:** Anual (se aplicável)

### 16.2 Evidências Mantidas
- Logs de acesso ao repositório
- Histórico de commits
- Aprovações de pull requests
- Registros de deploy
- Relatórios de testes
- Notas de versão

---

## ANEXOS

### Anexo A - Formulário de Solicitação de Mudança
Ver documento: `FORM-SCM-001-Solicitacao-Mudanca.md`

### Anexo B - Checklist de Verificação de Release
Ver documento: `FORM-SCM-002-Checklist-Release.md`

### Anexo C - Registro de Problemas de Software
Ver documento: `FORM-SCM-003-Registro-Problemas.md`

---

**Controle de Distribuição:**
- Gerência de TI
- Equipe de Desenvolvimento
- Qualidade
- Auditoria

**Aprovações:**
```
______________________________    ______________________________
Gerente de TI                     Gerente de Qualidade
Data: ____/____/______            Data: ____/____/______
```
