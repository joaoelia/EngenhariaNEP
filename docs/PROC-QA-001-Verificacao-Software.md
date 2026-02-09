# Procedimento de Verificação de Software Pré-Uso
**PROC-QA-001**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## 1. OBJETIVO

Estabelecer procedimento para verificação do software de aceitação de produto antes do seu uso em ambiente de produção, garantindo conformidade, qualidade e segurança.

## 2. MEIOS INDEPENDENTES DE VERIFICAÇÃO

### 2.1 Ambiente de Testes Independente

**Staging Environment (Homologação):**
- **Infraestrutura:** Servidor dedicado, isolado de produção
- **Dados:** Cópia anonimizada da produção
- **Configuração:** Idêntica à produção
- **Acesso:** Restrito à equipe de QA
- **Finalidade:** Testes de aceitação pré-deploy

### 2.2 Equipe de Verificação

**Não envolvidos no desenvolvimento:**

| Cargo | Responsabilidade | Independência |
|-------|------------------|---------------|
| QA Lead | Coordenação de testes | Externa ao dev |
| QA Engineer | Execução de testes | Externa ao dev |
| QA Automation | Testes automatizados | Externa ao dev |
| Gerente TI | Aprovação final | Externa ao dev |

## 3. VERIFICAÇÃO DA FUNÇÃO DO SOFTWARE

### 3.1 Testes Funcionais

**Checklist de Verificação Funcional:**

```markdown
## Módulo: Consumíveis

### Funcionalidades Básicas
- [ ] Listar consumíveis cadastrados
- [ ] Cadastrar novo consumível
- [ ] Editar consumível existente
- [ ] Excluir consumível
- [ ] Buscar consumível por nome/código
- [ ] Filtrar por categoria
- [ ] Paginação funcionando

### Funcionalidades Avançadas
- [ ] Validação de campos obrigatórios
- [ ] Validação de formatos (números, datas)
- [ ] Mensagens de erro apropriadas
- [ ] Confirmações de ações críticas
- [ ] Feedback visual de sucesso/erro
- [ ] Loading states durante operações

### Integrações
- [ ] Salva corretamente no banco de dados
- [ ] API retorna dados corretos
- [ ] Logs registrados adequadamente
- [ ] Auditoria de ações funcionando

### Performance
- [ ] Listagem carrega em <2s
- [ ] Cadastro processa em <1s
- [ ] Busca responde em <500ms
- [ ] Sem memory leaks
```

**Repetir para cada módulo:** Matéria-Prima, Peças, Ordens, Retiradas

### 3.2 Testes de Integração

**Hardware/Software Compatibility:**
```markdown
## Teste de Compatibilidade de Navegadores

### Chrome (Windows)
- [ ] Versão: 120+ ✓
- [ ] Todas funcionalidades operacionais
- [ ] Layout responsivo OK
- [ ] Performance adequada
- [ ] Console sem erros JavaScript

### Firefox (Windows)
- [ ] Versão: 120+ ✓
- [ ] Todas funcionalidades operacionais  
- [ ] Layout responsivo OK
- [ ] Performance adequada
- [ ] Console sem erros JavaScript

### Edge (Windows)
- [ ] Versão: 120+ ✓
- [ ] Todas funcionalidades operacionais
- [ ] Layout responsivo OK
- [ ] Performance adequada
- [ ] Console sem erros JavaScript

### Resoluções Testadas
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Min suportada)
- [ ] 2560x1440 (2K)
- [ ] 3840x2160 (4K)
```

### 3.3 Testes de Backend/Banco de Dados

**Verificação de Persistência:**
```sql
-- Script de verificação de integridade
-- verify-database.sql

-- 1. Verificar estrutura das tabelas
SELECT table_name, table_rows, data_length 
FROM information_schema.tables 
WHERE table_schema = 'aerogestor';

-- 2. Verificar integridade referencial
SELECT 
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE 
  TABLE_SCHEMA = 'aerogestor' 
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 3. Testar constraints
-- Deve falhar (teste de integridade)
INSERT INTO retiradas (material_id, quantidade) 
VALUES (99999, 10);  -- Material inexistente

-- 4. Verificar triggers/procedures
SHOW TRIGGERS FROM aerogestor;
SHOW PROCEDURE STATUS WHERE Db = 'aerogestor';

-- 5. Performance de queries críticas
EXPLAIN SELECT ...;
```

## 4. CAPACIDADE DE DISTINGUIR CONFORMES/NÃO-CONFORMES

### 4.1 Testes de Validação de Negócio

**Regras de Negócio - Retirada de Material:**

```markdown
## Caso de Teste: RET-001
**Objetivo:** Verificar que sistema impede retirada com quantidade > estoque

**Pré-condições:**
- Material "Parafuso M6" cadastrado
- Quantidade em estoque: 100 unidades

**Passos:**
1. Acessar módulo de Retiradas
2. Selecionar material "Parafuso M6"
3. Informar quantidade: 150 unidades
4. Clicar em "Salvar"

**Resultado Esperado:**
- ❌ Operação deve ser REJEITADA
- Mensagem de erro: "Quantidade solicitada (150) superior ao estoque disponível (100)"
- Transação não gravada no banco
- Estoque permanece inalterado (100 un)

**Resultado Real:**
- [ ] Passou ✓
- [ ] Falhou ✗

**Evidência:**
[Screenshot/Log]

**Status:** _________
**Testado por:** _________ Data: __/__/____
```

**Casos de Teste Obrigatórios:**

| ID | Cenário | Resultado Esperado | Criticidade |
|----|---------|-------------------|-------------|
| VAL-001 | Quantidade negativa | REJEITAR | Alta |
| VAL-002 | Data futura | REJEITAR | Alta |
| VAL-003 | Campo obrigatório vazio | REJEITAR | Alta |
| VAL-004 | Estoque insuficiente | REJEITAR | Alta |
| VAL-005 | Formato inválido | REJEITAR | Média |
| VAL-006 | Duplicação de código | REJEITAR | Média |
| VAL-007 | Caracteres especiais | PERMITIR/SANITIZAR | Média |
| VAL-008 | Valores limites (boundary) | VALIDAR CORRETAMENTE | Alta |

### 4.2 Testes de Fluxo Completo (End-to-End)

**Fluxo: Processo de Retirada de Material**

```gherkin
# Teste E2E em Gherkin (BDD)

Feature: Retirada de Material
  Como usuário do sistema
  Eu quero registrar retirada de material do estoque
  Para que o controle de inventário seja mantido atualizado

Scenario: Retirada bem-sucedida de material
  Given existe material "Chapa de Alumínio" com estoque de 50 unidades
  And usuário está autenticado
  When usuário acessa módulo de "Retiradas"
  And seleciona material "Chapa de Alumínio"
  And informa quantidade "10"
  And informa motivo "Ordem de Produção #123"
  And clica em "Confirmar Retirada"
  Then sistema deve exibir mensagem de sucesso
  And estoque de "Chapa de Alumínio" deve ser atualizado para 40 unidades
  And registro de retirada deve ser criado no histórico
  And auditoria deve registrar a ação

Scenario: Tentativa de retirada com estoque insuficiente
  Given existe material "Tinta Especial" com estoque de 5 litros
  And usuário está autenticado
  When usuário tenta retirar 10 litros de "Tinta Especial"
  Then sistema deve IMPEDIR a retirada
  And deve exibir mensagem "Estoque insuficiente"
  And estoque deve permanecer em 5 litros
  And nenhum registro deve ser criado
```

**Automação dos Testes E2E:**
```javascript
// tests/e2e/retirada.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Retirada de Material', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'teste@nep.com');
    await page.fill('[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('deve permitir retirada com estoque suficiente', async ({ page }) => {
    // Navegar para retiradas
    await page.click('text=Retiradas');
    await page.click('text=Nova Retirada');

    // Preencher formulário
    await page.selectOption('[name="material_id"]', '1'); // Chapa de Alumínio
    await page.fill('[name="quantidade"]', '10');
    await page.fill('[name="motivo"]', 'Ordem #123');

    // Submeter
    await page.click('button:has-text("Confirmar")');

    // Verificar sucesso
    await expect(page.locator('.toast-success')).toContainText('Retirada registrada');
    
    // Verificar estoque atualizado
    await page.goto('/dashboard/materia-prima');
    const estoque = await page.locator('[data-material-id="1"] .estoque').textContent();
    expect(estoque).toBe('40');
  });

  test('deve impedir retirada com estoque insuficiente', async ({ page }) => {
    await page.goto('/dashboard/retiradas/novo');
    
    await page.selectOption('[name="material_id"]', '2'); // Tinta: 5 un
    await page.fill('[name="quantidade"]', '10');
    await page.fill('[name="motivo"]', 'Teste');
    await page.click('button:has-text("Confirmar")');

    // Deve exibir erro
    await expect(page.locator('.error-message')).toContainText('Estoque insuficiente');
    
    // Estoque não deve mudar
    await page.goto('/dashboard/materia-prima');
    const estoque = await page.locator('[data-material-id="2"] .estoque').textContent();
    expect(estoque).toBe('5');
  });
});
```

## 5. IDENTIFICAÇÃO FORMAL DO SOFTWARE APROVADO

### 5.1 Sistema de Aprovação

**Labels de Aprovação (GitHub):**
```
release/approved ✅
release/rejected ❌
release/pending ⏳
```

**Pull Request Approval:**
```markdown
# PR #123 - Release v1.2.0

## Aprovações Necessárias

### Code Review
- [x] @tech-lead (Aprovado: 09/02/2026 10:00)

### QA Testing
- [x] @qa-engineer (Aprovado: 09/02/2026 14:00)
  - ✓ Todos os testes funcionais passaram
  - ✓ Testes de integração OK
  - ✓ Testes E2E executados
  - ✓ Performance validada
  
### Security Review
- [x] @security-team (Aprovado: 09/02/2026 15:00)
  - ✓ Sem vulnerabilidades críticas
  - ✓ Dependências atualizadas
  - ✓ Scan de segurança OK

### Management Approval
- [x] @gerente-ti (Aprovado: 09/02/2026 16:00)

## Status: ✅ APROVADO PARA PRODUÇÃO

**Tag:** v1.2.0
**Deploy Agendado:** 10/02/2026 08:00
**Deploy Por:** @devops
```

### 5.2 Certificado de Aprovação

**Formato do Certificado:**

```markdown
# CERTIFICADO DE APROVAÇÃO DE SOFTWARE

**Sistema:** AeroGestor - Sistema de Gerenciamento Industrial
**Versão:** 1.2.0
**Build:** 20260209.001
**Commit:** ac4bdaa8432f1c149afbf4c8996fb92427ae41e4

## INFORMAÇÕES DE APROVAÇÃO

| Item | DetalheS3. CONTROLE DE CONFIGURAÇÃO DO SOFTWARE

### 3.1 Registro de Versão Aprovada

**Matriz de Versões Aprovadas:**

| Versão | Status | Data Aprovação | Válido Para | Hash SHA-256 |
|--------|--------|----------------|-------------|--------------|
| v1.2.0 | ✅ ATIVA | 09/02/2026 | Produção | e3b0c44298fc...b7852b855 |
| v1.1.9 | ⚙️ Suportada | 25/01/2026 | Suporte até 09/08/2026 | a3c1b44298fc...c8963a923 |
| v1.1.0 | ⚠️ Descontinuada | 15/12/2025 | Sem suporte | b4d2c53309ed...d9074b034 |

### 3.2 Relacionamento Versão ↔ Produto

**Registro de Implantação por Cliente:**

```json
{
  "deployment_id": "PROD-NEP-001",
  "client": "NEP Aviation",
  "environment": "production",
  "software": {
    "system": "AeroGestor",
    "version": "v1.2.0",
    "modules": {
      "frontend": {
        "version": "v1.2.0",
        "hash": "ac4bdaa8..."
      },
      "backend": {
        "version": "v1.2.0",
        "hash": "bc5cedb9..."
      },
      "database": {
        "schema_version": "v1.2.0",
        "hash": "cd6dfeca..."
      }
    }
  },
  "hardware": {
    "server_app": {
      "model": "Dell PowerEdge R640",
      "cpu": "Intel Xeon Gold 6230",
      "ram": "64GB",
      "storage": "2TB NVMe RAID 10",
      "os": "Ubuntu 22.04 LTS"
    },
    "server_db": {
      "model": "Dell PowerEdge R740",
      "cpu": "Intel Xeon Gold 6240",
      "ram": "128GB",
      "storage": "4TB SSD RAID 6",
      "os": "Ubuntu 22.04 LTS"
    }
  },
  "product_acceptance": {
    "used_for": "Controle de qualidade e rastreamento de peças aeronáuticas",
    "criticality": "HIGH",
    "compliance": ["AS9100D", "ISO 9001:2015"]
  },
  "deployed_at": "2026-02-10T08:00:00Z",
  "deployed_by": "devops@nep.com",
  "verified_by": "qa@nep.com"
}
```

## 6. DOCUMENTAÇÃO DE VERIFICAÇÃO

### 6.1 Relatório de Testes

**Template de Relatório:**

```markdown
# RELATÓRIO DE VERIFICAÇÃO DE SOFTWARE

**Versão Testada:** v1.2.0  
**Data Início:** 08/02/2026  
**Data Término:** 09/02/2026  
**Ambiente:** Staging  
**Responsável:** QA Engineer

---

## RESUMO EXECUTIVO

✅ **Status:** APROVADO  
📊 **Taxa de Sucesso:** 98% (147/150 testes)  
⏱️ **Tempo Total:** 16 horas

---

## TESTES EXECUTADOS

### Testes Funcionais
| Módulo | Total | Passou | Falhou | Taxa |
|--------|-------|--------|--------|------|
| Consumíveis | 25 | 25 | 0 | 100% |
| Matéria-Prima | 30 | 30 | 0 | 100% |
| Peças | 28 | 27 | 1 | 96.4% |
| Ordens | 35 | 33 | 2 | 94.3% |
| Retiradas | 32 | 32 | 0 | 100% |
| **TOTAL** | **150** | **147** | **3** | **98%** |

### Testes de Integração
- [x] API ↔ Banco de Dados: 100% (45/45)
- [x] Frontend ↔ Backend: 100% (38/38)
- [x] Autenticação: 100% (12/12)
- [x] Upload de Arquivos: 100% (8/8)

### Testes E2E
- [x] Fluxo de Cadastro Completo: OK
- [x] Fluxo de Retirada: OK
- [x] Fluxo de Relatórios: OK
- [x] Navegação Geral: OK

### Testes de Performance
- [x] Tempo de Carregamento < 2s: ✓
- [x] Tempo de Resposta API < 500ms: ✓
- [x] Capacidade 100 usuários simultâneos: ✓
- [x] Sem Memory Leaks após 4h: ✓

### Testes de Segurança
- [x] OWASP Top 10: Nenhuma vulnerabilidade
- [x] SQL Injection: Protegido
- [x] XSS: Protegido
- [x] CSRF: Protegido
- [x] Autenticação/Autorização: OK

### Testes de Compatibilidade
| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome | 120+ | ✅ OK |
| Firefox | 120+ | ✅ OK |
| Edge | 120+ | ✅ OK |

---

## ISSUES IDENTIFICADAS

### Issue AERO-567 (P3 - Baixa)
**Módulo:** Peças  
**Descrição:** Botão "Exportar" exibe mensagem imprecisa ao falhar  
**Impacto:** Cosmético, não bloqueia operação  
**Status:** Será corrigido na v1.2.1  
**Workaround:** Mensagem ainda é funcional

### Issue AERO-568 (P2 - Média)
**Módulo:** Ordens  
**Descrição:** Filtro por data não persiste ao navegar páginas  
**Impacto:** Usabilidade reduzida  
**Status:** Será corrigido na v1.2.1  
**Workaround:** Reaplicar filtro após navegação

### Issue AERO-569 (P2 - Média)
**Módulo:** Ordens  
**Descrição:** Validação de campo "Prazo" permite datas passadas  
**Impacto:** Dados inconsistentes possíveis  
**Status:** Será corrigido na v1.2.1  
**Workaround:** Orientação aos usuários

---

## AVALIAÇÃO

**Funcionalidade:** ✅ Atende todos os requisitos críticos  
**Performance:** ✅ Dentro dos parâmetros aceitáveis  
**Segurança:** ✅ Sem vulnerabilidades críticas  
**Usabilidade:** ✅ Intuitivo e responsivo  
**Confiabilidade:** ✅ Estável durante testes de stress

---

## RECOMENDAÇÃO

✅ **APROVADO PARA PRODUÇÃO**

As issues identificadas são de baixa prioridade e não impedem o uso seguro e efetivo do sistema. Recomenda-se correção na próxima release (v1.2.1).

---

**Testado por:** João Silva, QA Engineer  
**Revisado por:** Maria Santos, QA Lead  
**Aprovado por:** Pedro Oliveira, Gerente de TI

**Data:** 09/02/2026  
**Assinatura:** _______________________
```

### 6.2 Checklist de Verificação Final

```markdown
# CHECKLIST DE VERIFICAÇÃO PRÉ-PRODUÇÃO

**Versão:** v1.2.0  
**Data:** 09/02/2026

## TESTES
- [x] Todos os testes unitários passaram (>80% cobertura)
- [x] Todos os testes de integração passaram
- [x] Testes E2E executados e aprovados
- [x] Testes de regressão OK
- [x] Testes de performance dentro do aceitável
- [x] Testes de segurança sem achados críticos
- [x] Testes de compatibilidade OK

## APROVAÇÕES
- [x] Code review aprovado (Tech Lead)
- [x] QA sign-off obtido
- [x] Security review aprovado
- [x] Gerência aprovou deploy

## DOCUMENTAÇÃO
- [x] README atualizado
- [x] CHANGELOG preenchido
- [x] Notas de release criadas
- [x] API docs atualizada
- [x] Manual do usuário atualizado
- [x] Procedimentos de rollback documentados

## INFRAESTRUTURA
- [x] Backup da versão atual realizado
- [x] Plano de rollback testado
- [x] Monitoramento configurado
- [x] Alertas configurados
- [x] Capacidade de servidor validada

## DEPLOY
- [x] Build reproducível verificado
- [x] Hash do artifact calculado e registrado
- [x] Tag no Git criada (v1.2.0)
- [x] Variáveis de ambiente configuradas
- [x] Migrações de banco testadas
- [x] Smoke tests preparados

## COMUNICAÇÃO
- [x] Stakeholders notificados
- [x] Janela de manutenção comunicada
- [x] Suporte em standby
- [x] Documentação de suporte atualizada

---

**Verificado por:** __________________  
**Data:** __/__/____  
**Hora:** __:__

**STATUS FINAL:** ✅ APROVADO PARA DEPLOY
```

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
