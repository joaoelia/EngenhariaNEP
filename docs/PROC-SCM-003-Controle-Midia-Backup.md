# Procedimento de Controle de Mídia e Backup/Recovery
**PROC-SCM-003**

**Sistema:** AeroGestor  
**Revisão:** 1.0  
**Data:** 09/02/2026

---

## 1. OBJETIVO

Estabelecer procedimentos para controle de mídia eletrônica, backup e recuperação do software, garantindo proteção contra perda de dados e capacidade de restauração.

## 2. ESCOPO

Este procedimento se aplica a:
- **Código-fonte** no repositório Git
- **Banco de dados** em produção e staging
- **Configurações** do sistema
- **Arquivos de build** e artefatos
- **Documentação** técnica
- **Dados de clientes** e registros

## 3. RESPONSABILIDADES

| Papel | Responsabilidade |
|-------|------------------|
| **DevOps Engineer** | Execução de backups, gestão de infraestrutura |
| **DBA** | Backups de banco de dados, otimização |
| **Gerente de TI** | Aprovação de políticas, investimento |
| **Desenvolvedor** | Commits regulares, versionamento |
| **QA** | Validação de procedimentos de recovery |

## 4. POLÍTICA DE BACKUP

### 4.1 Estratégia 3-2-1

```
3 - Três cópias dos dados
2 - Duas mídias diferentes
1 - Uma cópia off-site (externa)
```

**Implementação:**
- **Cópia 1:** Produção (servidor primário)
- **Cópia 2:** Backup local (NAS/storage dedicado)
- **Cópia 3:** Backup cloud (AWS S3/Azure Blob)

### 4.2 Tipos de Backup

| Tipo | Frequência | Retenção | Descrição |
|------|------------|----------|-----------|
| **Completo** | Semanal (domingo 02:00) | 6 semanas | Backup total do sistema |
| **Incremental** | Diário (01:00) | 14 dias | Apenas mudanças desde último backup |
| **Transacional** | Contínuo | 7 dias | Logs de transações do banco |
| **On-demand** | Antes de deploys | 30 dias | Backup manual pré-mudança |

### 4.3 Priorização de Assets

| Prioridade | Asset | RPO | RTO | Backup |
|------------|-------|-----|-----|--------|
| **P1 - Crítico** | Banco de Dados Produção | 15 min | 1 hora | Transacional |
| **P1 - Crítico** | Código-Fonte (Git) | Imediato | 30 min | Push remoto |
| **P2 - Alto** | Configurações Produção | 1 dia | 2 horas | Diário |
| **P2 - Alto** | Uploads de Usuários | 1 dia | 4 horas | Diário |
| **P3 - Médio** | Logs de Sistema | 1 semana | 1 dia | Semanal |
| **P3 - Médio** | Documentação | 1 semana | 1 dia | Semanal |

**Definições:**
- **RPO (Recovery Point Objective):** Quantidade máxima de dados que podemos perder
- **RTO (Recovery Time Objective):** Tempo máximo para restaurar o serviço

## 5. CONTROLE DE MÍDIA ELETRÔNICA

### 5.1 Repositório de Código (GitHub)

**Proteções Implementadas:**
```yaml
# Proteções de Branch (GitHub)
branch_protection:
  branch: main
  required_pull_request_reviews:
    required_approving_review_count: 2
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
  required_status_checks:
    strict: true
    contexts:
      - ci/build
      - ci/test
      - security/scan
  enforce_admins: true
  restrictions:
    users: []
    teams: ['core-team']
  allow_force_pushes: false
  allow_deletions: false
```

**Backup do Repositório:**
```bash
#!/bin/bash
# backup-github-repo.sh

REPO="joaoelia/EngenhariaNEP"
BACKUP_DIR="/backup/repos"
DATE=$(date +%Y%m%d_%H%M%S)

# Clone completo com histórico
git clone --mirror "https://github.com/${REPO}.git" \
  "${BACKUP_DIR}/EngenhariaNEP_${DATE}.git"

# Backup de releases e tags
cd "${BACKUP_DIR}/EngenhariaNEP_${DATE}.git"
git tag > tags_${DATE}.txt
git log --oneline > commits_${DATE}.txt

# Compactar
tar -czf "${BACKUP_DIR}/EngenhariaNEP_${DATE}.tar.gz" .

# Upload para S3
aws s3 cp "${BACKUP_DIR}/EngenhariaNEP_${DATE}.tar.gz" \
  s3://nep-backups/repos/ --storage-class GLACIER

# Notificar
echo "Backup do repositório concluído: EngenhariaNEP_${DATE}.tar.gz" | \
  mail -s "GitHub Backup Success" devops@nep.com
```

**Agendamento (Cron):**
```cron
# Backup semanal do repositório (domingo 03:00)
0 3 * * 0 /opt/scripts/backup-github-repo.sh >> /var/log/backup-repo.log 2>&1
```

### 5.2 Banco de Dados (MySQL/PostgreSQL)

**Script de Backup Completo:**
```bash
#!/bin/bash
# backup-database.sh

# Configurações
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="aerogestor"
DB_USER="backup_user"
BACKUP_DIR="/backup/database"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=42  # 6 semanas

# Criar diretório
mkdir -p "${BACKUP_DIR}"

# Backup completo com pg_dump
export PGPASSWORD="${DB_PASSWORD}"
pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -F c \
  -b \
  -v \
  -f "${BACKUP_DIR}/aerogestor_full_${DATE}.dump" \
  "${DB_NAME}"

# Verificar integridade
pg_restore --list "${BACKUP_DIR}/aerogestor_full_${DATE}.dump" > /dev/null
if [ $? -eq 0 ]; then
  echo "✓ Backup verificado com sucesso"
else
  echo "✗ ERRO: Backup corrompido!"
  exit 1
fi

# Calcular hash
sha256sum "${BACKUP_DIR}/aerogestor_full_${DATE}.dump" > \
  "${BACKUP_DIR}/aerogestor_full_${DATE}.sha256"

# Compactar
gzip "${BACKUP_DIR}/aerogestor_full_${DATE}.dump"

# Upload para S3 (múltiplas classes de storage)
## Hot: últimos 7 dias
if [ $(date +%u) -le 7 ]; then
  STORAGE_CLASS="STANDARD"
else
  STORAGE_CLASS="GLACIER_IR"
fi

aws s3 cp \
  "${BACKUP_DIR}/aerogestor_full_${DATE}.dump.gz" \
  "s3://nep-backups/database/full/" \
  --storage-class "${STORAGE_CLASS}" \
  --metadata "backup-date=${DATE},type=full"

# Limpar backups antigos (local)
find "${BACKUP_DIR}" -name "*.dump.gz" -mtime +${RETENTION_DAYS} -delete

# Log
echo "[$(date)] Backup completo: aerogestor_full_${DATE}.dump.gz (${STORAGE_CLASS})" >> \
  /var/log/backup-db.log

# Notificar sucesso
curl -X POST https://api.nep.com/webhooks/backup \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"success\", \"type\": \"database_full\", \"date\": \"${DATE}\"}"
```

**Script de Backup Incremental:**
```bash
#!/bin/bash
# backup-database-incremental.sh

# Configurações
WAL_DIR="/var/lib/postgresql/14/main/pg_wal"
ARCHIVE_DIR="/backup/database/wal"
DATE=$(date +%Y%m%d)

# Arquivar WAL logs
rsync -av --delete \
  "${WAL_DIR}/" \
  "${ARCHIVE_DIR}/${DATE}/"

# Upload para S3
aws s3 sync \
  "${ARCHIVE_DIR}/${DATE}/" \
  "s3://nep-backups/database/wal-${DATE}/" \
  --storage-class STANDARD_IA

echo "[$(date)] Backup incremental (WAL) concluído" >> /var/log/backup-db.log
```

**Agendamento (Cron):**
```cron
# Backup completo (domingo 02:00)
0 2 * * 0 /opt/scripts/backup-database.sh >> /var/log/backup-db.log 2>&1

# Backup incremental (todos os dias 01:00)
0 1 * * * /opt/scripts/backup-database-incremental.sh >> /var/log/backup-db.log 2>&1

# Verificação de integridade (quarta-feira 04:00)
0 4 * * 3 /opt/scripts/verify-backup-integrity.sh >> /var/log/backup-verify.log 2>&1
```

### 5.3 Arquivos de Configuração

**Backup de Configurações:**
```yaml
# ansible-playbook backup-configs.yml

---
- name: Backup de Configurações do Sistema
  hosts: production
  become: yes
  tasks:
    - name: Criar diretório de backup
      file:
        path: /backup/configs/{{ ansible_date_time.date }}
        state: directory
        mode: '0700'

    - name: Backup - Docker Compose
      copy:
        src: /opt/aerogestor/docker-compose.yml
        dest: /backup/configs/{{ ansible_date_time.date }}/docker-compose.yml
        remote_src: yes

    - name: Backup - Variáveis de Ambiente
      copy:
        src: /opt/aerogestor/.env.production
        dest: /backup/configs/{{ ansible_date_time.date }}/.env.production
        remote_src: yes

    - name: Backup - Nginx Config
      copy:
        src: /etc/nginx/sites-available/aerogestor
        dest: /backup/configs/{{ ansible_date_time.date }}/nginx-aerogestor.conf
        remote_src: yes

    - name: Backup - SSL Certificates
      copy:
        src: /etc/letsencrypt/live/aerogestor.nep.com/
        dest: /backup/configs/{{ ansible_date_time.date }}/ssl/
        remote_src: yes

    - name: Compactar
      archive:
        path: /backup/configs/{{ ansible_date_time.date }}
        dest: /backup/configs/configs_{{ ansible_date_time.date }}.tar.gz
        format: gz

    - name: Upload para S3
      aws_s3:
        bucket: nep-backups
        object: configs/configs_{{ ansible_date_time.date }}.tar.gz
        src: /backup/configs/configs_{{ ansible_date_time.date }}.tar.gz
        mode: put
        encrypt: yes
```

### 5.4 Uploads de Usuários

**Sincronização com S3:**
```bash
#!/bin/bash
# sync-user-uploads.sh

SOURCE_DIR="/var/www/aerogestor/uploads"
S3_BUCKET="s3://nep-aerogestor-uploads"
DATE=$(date +%Y%m%d)

# Sincronizar com S3 (versionamento habilitado)
aws s3 sync "${SOURCE_DIR}" "${S3_BUCKET}" \
  --exclude "*.tmp" \
  --exclude ".DS_Store" \
  --storage-class STANDARD_IA \
  --metadata "backup-date=${DATE}"

# Backup para Glacier (mensal)
if [ $(date +%d) -eq 01 ]; then
  aws s3 sync "${SOURCE_DIR}" "${S3_BUCKET}-archive/${DATE}/" \
    --storage-class DEEP_ARCHIVE
fi

echo "[$(date)] Uploads sincronizados com S3" >> /var/log/sync-uploads.log
```

## 6. PROCEDIMENTOS DE RECOVERY

### 6.1 Recovery de Banco de Dados

**Restauração Completa:**
```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1
DB_NAME="aerogestor"

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: ./restore-database.sh <arquivo_backup.dump.gz>"
  exit 1
fi

# Verificar hash
echo "Verificando integridade do backup..."
sha256sum -c "${BACKUP_FILE/.dump.gz/.sha256}"
if [ $? -ne 0 ]; then
  echo "✗ ERRO: Backup corrompido!"
  exit 1
fi

# Descompactar
gunzip -k "${BACKUP_FILE}"
DUMP_FILE="${BACKUP_FILE/.gz/}"

# Parar aplicação
echo "Parando aplicação..."
docker-compose -f /opt/aerogestor/docker-compose.yml stop app

# Criar backup de segurança do estado atual
echo "Criando backup de segurança..."
pg_dump -F c -f /tmp/pre-restore-backup_$(date +%Y%m%d_%H%M%S).dump "${DB_NAME}"

# Dropar e recriar database
echo "Recreiando database..."
psql -c "DROP DATABASE IF EXISTS ${DB_NAME};"
psql -c "CREATE DATABASE ${DB_NAME};"

# Restaurar
echo "Restaurando backup..."
pg_restore -d "${DB_NAME}" -v "${DUMP_FILE}"

if [ $? -eq 0 ]; then
  echo "✓ Restauração concluída com sucesso"
  
  # Reiniciar aplicação
  docker-compose -f /opt/aerogestor/docker-compose.yml start app
  
  # Smoke tests
  sleep 10
  curl -f http://localhost:3000/api/health || echo "ATENÇÃO: Health check falhou!"
else
  echo "✗ ERRO na restauração!"
  exit 1
fi

# Limpar
rm "${DUMP_FILE}"
```

**Point-in-Time Recovery (PITR):**
```bash
#!/bin/bash
# pitr-restore.sh

TARGET_TIME=$1  # Formato: '2026-02-09 14:30:00'
BASE_BACKUP="/backup/database/aerogestor_full_20260209_020000.dump"
WAL_ARCHIVE="/backup/database/wal"

# Restaurar base backup
pg_restore -d aerogestor_recovery "${BASE_BACKUP}"

# Configurar recovery
cat > /var/lib/postgresql/14/main/recovery.conf <<EOF
restore_command = 'cp ${WAL_ARCHIVE}/%f %p'
recovery_target_time = '${TARGET_TIME}'
recovery_target_action = 'promote'
EOF

# Reiniciar PostgreSQL
systemctl restart postgresql

echo "PITR iniciado. Target: ${TARGET_TIME}"
echo "Monitore: tail -f /var/log/postgresql/postgresql-14-main.log"
```

### 6.2 Recovery de Código-Fonte

**Restauração do Repositório:**
```bash
#!/bin/bash
# restore-repository.sh

BACKUP_FILE=$1  # aerogestor_20260209_030000.tar.gz

# Extrair backup
mkdir -p /tmp/repo-restore
tar -xzf "${BACKUP_FILE}" -C /tmp/repo-restore

# Clonar do backup local
git clone /tmp/repo-restore/EngenhariaNEP.git /opt/aerogestor-restore

# Verificar integridade
cd /opt/aerogestor-restore
git fsck --full

# Verificar tags e commits
git tag
git log --oneline -20

echo "Repositório restaurado em: /opt/aerogestor-restore"
```

### 6.3 Recovery de Configurações

**Restauração Environment:**
```bash
#!/bin/bash
# restore-configs.sh

CONFIG_BACKUP=$1  # configs_20260209.tar.gz

# Extrair
tar -xzf "${CONFIG_BACKUP}" -C /tmp/config-restore

# Aplicar configurações
cp /tmp/config-restore/docker-compose.yml /opt/aerogestor/
cp /tmp/config-restore/.env.production /opt/aerogestor/
cp /tmp/config-restore/nginx-aerogestor.conf /etc/nginx/sites-available/aerogestor

# Recarregar serviços
nginx -t && systemctl reload nginx
cd /opt/aerogestor && docker-compose up -d

echo "Configurações restauradas"
```

## 7. TESTES DE RECOVERY

### 7.1 Cronograma de Testes

| Teste | Frequência | Responsável | Documentar |
|-------|------------|-------------|------------|
| Recovery de DB (PITR) | Mensal | DBA | Sim |
| Recovery de Código | Trimestral | DevOps | Sim |
| Recovery Completo (DR) | Semestral | Gerente TI | Sim |
| Verificação de Integridade | Semanal | DevOps | Log apenas |

### 7.2 Template de Teste de Recovery

```markdown
# TESTE DE RECOVERY - Database

**Data:** __/__/____  
**Executado por:** _____________  
**Tipo:** [ ] Full Restore [ ] PITR [ ] Incremental

## PRÉ-TESTE
- [ ] Backup selecionado: ________________
- [ ] Hash verificado: ✓
- [ ] Ambiente de teste preparado
- [ ] Stakeholders notificados

## EXECUÇÃO
**Início:** __:__  
**Término:** __:__  
**Duração:** ______ minutos

### Passos Executados
1. [ ] Backup baixado do S3
2. [ ] Integridade verificada
3. [ ] Database dropada e recriada
4. [ ] Restore executado
5. [ ] Aplicação reiniciada
6. [ ] Smoke tests executados

## VALIDAÇÃO
- [ ] Contagem de registros: _______ (esperado: _______)
- [ ] Queries de validação executadas
- [ ] Usuários conseguem fazer login
- [ ] Funcionalidades críticas operacionais
- [ ] Logs sem erros críticos

## RESULTADOS
**Status:** [ ] Sucesso [ ] Falhou [ ] Parcial

**RTO Real:** ______ minutos (meta: 60 min)  
**RPO Real:** ______ minutos (meta: 15 min)

## PROBLEMAS ENCONTRADOS
_Descrever qualquer problema..._

## AÇÕES CORRETIVAS
_Se aplicável..._

## APROVAÇÃO
**Testado por:** _______________ Data: __/__/____  
**Revisado por:** _______________ Data: __/__/____
```

## 8. ARMAZENAMENTO DE MÍDIA

### 8.1 Localização de Backups

| Tipo | Local | Tecnologia | Retenção |
|------|-------|------------|----------|
| **Online** | Servidor local | NAS Synology | 14 dias |
| **Nearline** | AWS S3 Standard-IA | Cloud | 90 dias |
| **Offline** | AWS S3 Glacier | Cloud | 7 anos |
| **Off-site** | Azure Blob (DR) | Cloud | 30 dias |

### 8.2 Inventário de Mídia

**Log de Backups (automatizado):**
```sql
-- backup_inventory table

CREATE TABLE backup_inventory (
  id SERIAL PRIMARY KEY,
  backup_type VARCHAR(50) NOT NULL,  -- 'database', 'repository', 'configs'
  backup_ VARCHAR(20) NOT NULL,  -- 'full', 'incremental', 'differential'
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT,
  storage_location VARCHAR(100),  -- 's3://bucket/path'
  created_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  hash_sha256 CHAR(64),
  status VARCHAR(20) DEFAULT 'active',  -- 'active', 'archived', 'expired'
  verified_at TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('active', 'archived', 'expired'))
);

-- Índice para busca rápida
CREATE INDEX idx_backup_type_date ON backup_inventory(backup_type, created_at DESC);
CREATE INDEX idx_expires_at ON backup_inventory(expires_at);
```

**Consulta de Backups Disponíveis:**
```sql
-- Listar backups de banco de dados (últimos 30 dias)
SELECT 
  file_name,
  file_size_bytes / (1024*1024*1024) as size_gb,
  storage_location,
  created_at,
  verified_at,
  CASE 
    WHEN verified_at > NOW() - INTERVAL '7 days' THEN '✓'
    ELSE '⚠'
  END as integrity
FROM backup_inventory
WHERE backup_type = 'database'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### 8.3 Política de Retenção

```python
# retention-policy.py
# Script de limpeza automatizada

import boto3
from datetime import datetime, timedelta

s3 = boto3.client('s3')
BUCKET = 'nep-backups'

# Políticas de retenção
RETENTION_POLICIES = {
    'database/full': {
        'hot': 7,        # 7 dias em Standard
        'warm': 30,      # 30 dias em Standard-IA
        'cold': 90,      # 90 dias em Glacier IR
        'freeze': 2555   # 7 anos em Deep Archive
    },
    'database/incremental': {
        'delete_after': 14  # Deletar após 14 dias
    },
    'repository': {
        'keep': 52  # Manter últimos 52 backups
    },
    'configs': {
        'keep': 24  # Manter últimos 24 backups mensais
    }
}

def apply_lifecycle_policy():
    """Aplicar políticas de ciclo de vida aos backups"""
    
    for prefix, policy in RETENTION_POLICIES.items():
        objects = s3.list_objects_v2(Bucket=BUCKET, Prefix=prefix)
        
        for obj in objects.get('Contents', []):
            key = obj['Key']
            age_days = (datetime.now() - obj['LastModified'].replace(tzinfo=None)).days
            
            # Database full backups - transição de storage class
            if 'database/full' in prefix:
                if age_days >= policy['freeze']:
                    transition_to_storage_class(key, 'DEEP_ARCHIVE')
                elif age_days >= policy['cold']:
                    transition_to_storage_class(key, 'GLACIER_IR')
                elif age_days >= policy['warm']:
                    transition_to_storage_class(key, 'STANDARD_IA')
            
            # Incrementais - deletar após período
            elif 'incremental' in prefix:
                if age_days > policy['delete_after']:
                    s3.delete_object(Bucket=BUCKET, Key=key)
                    print(f"Deletado: {key} (idade: {age_days} dias)")

def transition_to_storage_class(key, storage_class):
    """Transicionar objeto para nova classe de armazenamento"""
    copy_source = {'Bucket': BUCKET, 'Key': key}
    s3.copy_object(
        CopySource=copy_source,
        Bucket=BUCKET,
        Key=key,
        StorageClass=storage_class,
        MetadataDirective='COPY'
    )
    print(f"Transicionado: {key} -> {storage_class}")

if __name__ == '__main__':
    apply_lifecycle_policy()
```

## 9. MONITORAMENTO DE BACKUPS

### 9.1 Alertas

**Configuração de Alertas (Prometheus + Alert):**
```yaml
# alertmanager-rules.yml

groups:
  - name: backup_alerts
    interval: 5m
    rules:
      - alert: BackupFailure
        expr: backup_job_status{job="database_backup"} == 0
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Falha no backup de {{ $labels.backup_type }}"
          description: "Backup {{ $labels.backup_type }} falhou há {{ $value }} minutos"

      - alert: BackupOverdue
        expr: (time() - backup_last_success_time) > 86400
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Backup atrasado - {{ $labels.backup_type }}"
          description: "Último backup bem-sucedido há {{ $value | humanizeDuration }}"

      - alert: BackupStorageFull
        expr: backup_storage_used_percent > 85
        for: 30m
        labels:
          severity: warning
        annotations:
          summary: "Armazenamento de backup chegando ao limite"
          description: "Uso: {{ $value }}%"
```

### 9.2 Dashboard de Monitoramento

**Métricas Importantes:**
- Taxa de sucesso de backups (últimos 30 dias)
- Tamanho médio dos backups
- Tempo médio de execução
- Espaço de armazenamento utilizado
- Última verificação de integridade
- Idade do backup mais antigo disponível

---

**Revisões:**
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 09/02/2026 | João Elia | Versão inicial |
