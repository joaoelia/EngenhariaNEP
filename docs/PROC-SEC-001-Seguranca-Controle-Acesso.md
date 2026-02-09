# Procedimento de Segurança e Controle de Acesso
**PROC-SEC-001**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## 1. OBJETIVO

Estabelecer métodos e instalações para proteger programas de computadores do acesso não autorizado, danos inadvertidos ou degradação, garantindo integridade e disponibilidade do software de aceitação de produto.

## 2. CONTROLE DE CONFIGURAÇÃO DO SOFTWARE

### 2.1 Proteção do Repositório de Código

**Branch Protection Rules (GitHub):**
```yaml
Branch: main (produção)
Proteções:
  - Require pull request before merging: ✓
  - Require approvals: 1
  - Dismiss stale reviews: ✓
  - Require review from Code Owners: ✓
  - Require status checks to pass: ✓
  - Require branches to be up to date: ✓
  - Require signed commits: ✓
  - Include administrators: ✓
  - Restrict who can push: ✓
    - Permitido apenas: Gerente TI, DevOps
```

**Níveis de Acesso ao Repositório:**

| Cargo | Nível | Read | Write | Admin | Deploy Prod |
|-------|-------|------|-------|-------|-------------|
| Gerente TI | Admin | ✓ | ✓ | ✓ | ✓ |
| Tech Lead | Maintainer | ✓ | ✓ | ✗ | ✓ |
| Desenvolvedor Sênior | Developer | ✓ | ✓ | ✗ | ✗ |
| Desenvolvedor | Developer | ✓ | ✓ | ✗ | ✗ |
| QA | Reporter | ✓ | ✗ | ✗ | ✗ |
| Estagiário | Guest | ✓ | ✗ | ✗ | ✗ |

### 2.2 Controle de Alterações Não Autorizadas

**Políticas de Commit:**
1. **Commits diretos bloqueados** - Toda mudança via Pull Request
2. **Commits assinados obrigatórios** - GPG key validado
3. **Message format obrigatório** - Padrão de mensagem verificado
4. **Force push bloqueado** - Histórico imutável

**Verificação de Integridade:**
```bash
# Script de verificação diária (cron)
#!/bin/bash
# verify-integrity.sh

# Verifica assinaturas GPG de todos os commits
git log --show-signature --since="24 hours ago"

# Verifica se há commits sem aprovação
git log --oneline --since="24 hours ago" | while read commit; do
  pr=$(gh pr list --state merged --search "$commit" --json number)
  if [ -z "$pr" ]; then
    echo "ALERTA: Commit $commit sem PR aprovado!"
    exit 1
  fi
done

# Gera relatório
echo "Verificação de integridade: OK - $(date)" >> /var/log/aerogestor/integrity.log
```

## 3. ACESSO LIMITADO E PROTEÇÃO

### 3.1 Autenticação Multi-Fator (MFA)

**Obrigatório para:**
- Acesso ao repositório GitHub
- Acesso aos servidores de produção
- Acesso ao painel de administração
- Acesso ao banco de dados de produção

**Métodos Suportados:**
- Authenticator App (Google Authenticator, Microsoft Authenticator)
- SMS (backup apenas)
- Hardware Security Key (recomendado para admins)

### 3.2 Controle de Acesso ao Código

**Matriz de Permissões:**

**Ambientes de Desenvolvimento:**
```
LOCAL:
  - Código: Acesso total (próprio workspace)
  - Banco: Banco local/docker

DEVELOPMENT:
  - Código: Push para branches feature/*
  - Banco: Acesso read/write
  - Deploy: Automático via CI

STAGING:
  - Código: Merge restrito (via PR aprovado)
  - Banco: Acesso read-only (exceto QA)
  - Deploy: Manual, aprovação Tech Lead

PRODUCTION:
  - Código: Merge restrito (via PR + aprovações)
  - Banco: Acesso restrito (apenas DevOps)
  - Deploy: Manual, aprovação Gerência
```

### 3.3 Controle de Acesso SSH

**Chaves SSH Autorizadas:**
```bash
# /home/aerogestor/.ssh/authorized_keys (servidor produção)

# João Elia - Gerente TI
ssh-rsa AAAA...== joao.elia@nep.com

# Tech Lead
ssh-rsa AAAA...== tech.lead@nep.com

# DevOps
ssh-rsa AAAA...== devops@nep.com

# Todas as chaves com timestamp e expiração
# Renovação anual obrigatória
```

**Configuração SSH Hardening:**
```config
# /etc/ssh/sshd_config

# Desabilitar autenticação por senha
PasswordAuthentication no
PermitEmptyPasswords no

# Apenas chaves específicas
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Desabilitar root login
PermitRootLogin no

# Timeout de inatividade
ClientAliveInterval 300
ClientAliveCountMax 2

# Usuários permitidos
AllowUsers aerogestor devops

# Port não padrão (alterar de 22)
Port 2222
```

### 3.4 Firewall e Network Security

**Regras de Firewall (production):**
```bash
# Apenas portas necessárias
ALLOW: 443 (HTTPS)
ALLOW: 2222 (SSH) - Apenas IPs corporativos
DENY: Tudo mais

# IPs Permitidos SSH
ALLOW 2222 from 192.168.1.0/24  # Rede corporativa
ALLOW 2222 from 203.0.113.50    # VPN
DENY 2222 from 0.0.0.0/0         # Bloquear resto
```

## 4. SEPARAÇÃO DE MASTERS E DUPLICATAS

### 4.1 Localizações de Armazenamento

**Master (Produção Ativa):**
- Local: Servidor de Produção
- Path: `/opt/aerogestor/production`
- Backup: Não armazenado localmente
- Acesso: Apenas deploy automatizado

**Duplicatas (Backups):**

| Tipo | Localização | Frequência | Retenção | Acesso |
|------|-------------|------------|----------|--------|
| Backup Diário | NAS Local | Diário 02:00 | 30 dias | DevOps |
| Backup Semanal | Cloud AWS S3 | Domingo 03:00 | 90 dias | Gerente TI |
| Backup Mensal | Cloud Azure | 1º dia mês | 1 ano | Gerente TI |
| Snapshot Git | GitHub | Cada commit | Infinito | Conforme permissões |

### 4.2 Política de Separação

**Regra Fundamental:**
> Masters e duplicatas NUNCA estão disponíveis simultaneamente no mesmo equipamento.

**Implementação:**
```bash
# Script de backup (backup.sh)
#!/bin/bash

# 1. Criar snapshot do sistema
SNAPSHOT="/tmp/aerogestor-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
cd /opt/aerogestor
tar -czf "$SNAPSHOT" production/

# 2. Calcular hash para integridade
sha256sum "$SNAPSHOT" > "$SNAPSHOT.sha256"

# 3. Transferir para NAS (rede separada)
scp "$SNAPSHOT" "$SNAPSHOT.sha256" backup@nas.nep.com:/backups/

# 4. Verificar transferência
ssh backup@nas.nep.com "sha256sum -c /backups/$(basename $SNAPSHOT).sha256"

# 5. REMOVER local imediatamente após confirmação
if [ $? -eq 0 ]; then
  rm -f "$SNAPSHOT" "$SNAPSHOT.sha256"
  echo "Backup realizado e removido localmente: $(date)" >> /var/log/backup.log
else
  echo "ERRO: Falha na verificação de integridade!" >> /var/log/backup.log
  exit 1
fi

# 6. Copiar para cloud (após remoção local)
ssh backup@nas.nep.com "aws s3 cp /backups/$(basename $SNAPSHOT) s3://aerogestor-backups/"
```

### 4.3 Prevenção de Adulteração

**Medidas Implementadas:**
1. **Checksums SHA-256** - Toda transferência verificada
2. **Criptografia em repouso** - AES-256 nos backups
3. **Criptografia em trânsito** - TLS 1.3 mínimo
4. **Imutabilidade** - Backups em modo WORM (Write Once Read Many)
5. **Versionamento** - S3 Versioning habilitado
6. **Auditoria** - Logs de todos acessos

**Teste de Integridade Mensal:**
```bash
# Script teste-integridade-backup.sh
#!/bin/bash

# Restaurar backup mais recente em ambiente isolado
LATEST_BACKUP=$(aws s3 ls s3://aerogestor-backups/ | sort | tail -n 1)

# Download e verificação
aws s3 cp "$LATEST_BACKUP" /tmp/test-restore.tar.gz
sha256sum -c /tmp/test-restore.tar.gz.sha256

# Extração
tar -xzf /tmp/test-restore.tar.gz -C /tmp/test-env/

# Testes básicos
cd /tmp/test-env/
docker-compose up -d
sleep 30

# Verificar se sobe corretamente
curl -f http://localhost:3000/health || exit 1
curl -f http://localhost:8080/api/health || exit 1

# Cleanup
docker-compose down
rm -rf /tmp/test-env /tmp/test-restore.*

echo "Teste de integridade: SUCESSO - $(date)"
```

## 5. MINIMIZAÇÃO DE RISCOS DE ARMAZENAGEM

### 5.1 Estratégia de Armazenamento

**Redundância Geográfica:**
```
Primary: Datacenter NEP (São Paulo)
  ├─ Servidor Produção (NVMe RAID 10)
  └─ NAS Local (HDD RAID 6)

Secondary: Cloud AWS (São Paulo - sa-east-1)
  ├─ S3 Standard
  └─ Glacier (arquivamento longo prazo)

Tertiary: Cloud Azure (EUA - eastus)
  └─ Blob Storage (disaster recovery)
```

### 5.2 Proteção contra Deterioração

**Validação Periódica:**
```bash
# Cron job semanal: validaç~~ão de todos os backups
0 4 * * 0 /opt/scripts/validate-all-backups.sh

# validate-all-backups.sh
#!/bin/bash

# Listar todos os backups
aws s3 ls s3://aerogestor-backups/ --recursive > /tmp/backup-list.txt

# Verificar integridade de cada um
while read backup; do
  FILENAME=$(echo $backup | awk '{print $4}')
  
  # Download hash
  aws s3 cp "s3://aerogestor-backups/$FILENAME.sha256" /tmp/
  
  # Download arquivo
  aws s3 cp "s3://aerogestor-backups/$FILENAME" /tmp/
  
  # Verificar
  if sha256sum -c "/tmp/$FILENAME.sha256"; then
    echo "$FILENAME: OK"
  else
    echo "ALERTA: $FILENAME CORROMPIDO!" | mail -s "Backup Corrompido" it@nep.com
  fi
  
  # Cleanup
  rm -f "/tmp/$FILENAME" "/tmp/$FILENAME.sha256"
done < /tmp/backup-list.txt
```

### 5.3 Regeneração de Erros

**Detecção Automática:**
- Verificação de checksum em cada acesso
- Alertas imediatos se corrupção detectada
- Restore automático de backup anterior

**Procedimento de Recuperação:**
1. Detectar corrupção (automated monitoring)
2. Notificar equipe imediatamente  
3. Identificar último backup íntegro
4. Restaurar de backup verificado
5. Validar integridade pós-restauração
6. Investigar causa raiz da corrupção
7. Documentar incidente

## 6. GARANTIA DE REPRODUÇÃO DO CÓDIGO

### 6.1 Build Determinístico

**Dockerfile com versões fixas:**
```dockerfile
# Backend - Dockerfile
FROM eclipse-temurin:17.0.6-jdk-alpine AS builder

# Instalar Maven versão específica
ENV MAVEN_VERSION=3.9.0
RUN wget https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz

# Build com hash verificação
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime com hash do JAR
FROM eclipse-temurin:17.0.6-jre-alpine
COPY --from=builder target/aerogestor-*.jar app.jar

# Metadata de build
LABEL version="${BUILD_VERSION}"
LABEL commit="#${GIT_COMMIT}"
LABEL build_date="${BUILD_DATE}"

CMD ["java", "-jar", "app.jar"]
```

### 6.2 Lock Files

**Dependências Bloqueadas:**
- Backend: `pom.xml` com versões exatas
- Frontend: `pnpm-lock.yaml` commitado
- Infrastructure: `docker-compose.yml` com image tags fixos

**Exemplo pom.xml:**
```xml
<dependencies>
  <!-- Versões exatas, não ranges -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.1</version> <!-- Exato, não 3.2.+ -->
  </dependency>
</dependencies>
```

### 6.3 Processo de Build Reproduzível

**Pipeline CI/CD:**
```yaml
# .github/workflows/build.yml
name: Build Reproduzível

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-22.04  # Versão fixa do runner
    
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0  # História completa para metadata
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17.0.6'  # Versão exata
        
    - name: Build
      run: |
        # Metadata de build
        export BUILD_VERSION=$(git describe --tags)
        export GIT_COMMIT=$(git rev-parse --short HEAD)
        export BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
        
        # Build
        mvn clean package -DskipTests
        
        # Calcular hash do artifact
        sha256sum target/*.jar > target/artifact.sha256
        
        # Criar arquivo de build info
        cat > target/build-info.json <<EOF
        {
          "version": "$BUILD_VERSION",
          "commit": "$GIT_COMMIT",
          "date": "$BUILD_DATE",
          "builder": "GitHub Actions",
          "runner": "ubuntu-22.04",
          "java": "17.0.6",
          "maven": "$(mvn --version | head -n1)"
        }
        EOF
    
    - name: Upload Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: |
          target/*.jar
          target/*.sha256
          target/build-info.json
```

### 6.4 Verificação de Reprodutibilidade

**Teste Mensal:**
```bash
# Verificar que mesmo commit gera mesmo artifact
#!/bin/bash

COMMIT="ac4bdaa8"
EXPECTED_HASH="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

# Build 1
git checkout $COMMIT
mvn clean package -DskipTests
HASH1=$(sha256sum target/*.jar | awk '{print $1}')

# Limpar completamente
git clean -fdx

# Build 2
mvn clean package -DskipTests
HASH2=$(sha256sum target/*.jar | awk '{print $1}')

# Verificar
if [ "$HASH1" = "$HASH2" ] && [ "$HASH1" = "$EXPECTED_HASH" ]; then
  echo "✓ Build reproduzível confirmado"
  exit 0
else
  echo "✗ FALHA: Build não reproduzível!"
  echo "Build 1: $HASH1"
  echo "Build 2: $HASH2"
  echo "Esperado: $EXPECTED_HASH"
  exit 1
fi
```

## 7. AUDITORIA E MONITORAMENTO

### 7.1 Logs de Acesso

**Eventos Auditados:**
```bash
# /var/log/aerogestor/access.log

2026-02-09T10:30:00Z | SSH_LOGIN | joao.elia@nep.com | 192.168.1.50 | SUCCESS
2026-02-09T10:31:15Z | GIT_PULL | joao.elia@nep.com | branch:main | SUCCESS
2026-02-09T10:35:00Z | DEPLOY_PROD | devops@nep.com | v1.2.0 | SUCCESS
2026-02-09T11:00:00Z | DB_ACCESS | backup-script | backup:full | SUCCESS
2026-02-09T14:00:00Z | SSH_LOGIN | unknown@external.com | 203.0.113.99 | DENIED
```

### 7.2 Alertas de Segurança

**Notificações Imediatas:**
- Tentativa de acesso negada (3+ em 10min)
- Login fora do horário comercial
- Acesso de IP não autorizado
- Modificação em arquivos críticos
- Tentativa de escalonamento de privilégios

```bash
# fail2ban configurado
[sshd]
enabled = true
filter = sshd
action = iptables[name=SSH, port=2222, protocol=tcp]
         sendmail-whois[name=SSH, dest=security@nep.com]
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

### 7.3 Revisão de Acessos

**Trimestral:**
- Revisar lista de usuários com acesso
- Remover acessos inativos (>90 dias)
- Validar níveis de permissão
- Renovar chaves SSH expiradas
- Atualizar documentação de acessos

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
