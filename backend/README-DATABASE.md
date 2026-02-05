# Configuração do Banco de Dados MySQL - AeroGestor

## Pré-requisitos

- MySQL 8.0 ou superior instalado
- Usuário com permissões para criar bancos de dados

## Instalação do MySQL

### Windows

1. Baixe o MySQL Installer em: https://dev.mysql.com/downloads/installer/
2. Execute o instalador e escolha "Developer Default"
3. Durante a instalação, configure a senha do usuário root
4. Anote a senha configurada para usar na aplicação

### Usando Docker (Alternativa)

```bash
docker-compose up -d mysql
```

O arquivo `docker-compose.yml` na raiz do projeto já está configurado com o MySQL.

## Criação do Banco de Dados

### Opção 1: Criação Automática (Recomendado)

A aplicação está configurada para criar automaticamente o banco de dados e as tabelas quando iniciar pela primeira vez, graças às seguintes configurações no `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aerogestor?createDatabaseIfNotExist=true
spring.jpa.hibernate.ddl-auto=update
```

### Opção 2: Criação Manual

Se preferir criar manualmente o banco de dados:

#### 1. Conecte ao MySQL

```bash
mysql -u root -p
```

#### 2. Crie o banco de dados

```sql
CREATE DATABASE aerogestor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aerogestor;
```

#### 3. Execute o script de schema

```bash
mysql -u root -p aerogestor < src/main/resources/db/schema.sql
```

#### 4. (Opcional) Insira dados de exemplo

```bash
mysql -u root -p aerogestor < src/main/resources/db/sample-data.sql
```

## Configuração da Aplicação

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente antes de iniciar a aplicação:

```bash
# Windows PowerShell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/aerogestor?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="sua_senha_aqui"
```

```bash
# Linux/Mac
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/aerogestor?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="sua_senha_aqui"
```

### Arquivo application.properties

Alternativamente, você pode editar diretamente o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aerogestor?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=sua_senha_aqui
```

## Estrutura do Banco de Dados

### Tabelas

1. **ordens** - Ordens de fabricação, produção e projeto
2. **pecas** - Registro de peças produzidas
3. **materia_prima** - Controle de estoque de matéria-prima
4. **consumiveis** - Controle de consumíveis
5. **retiradas** - Histórico de retiradas de itens

### Diagrama de Relacionamento

```
┌─────────────┐
│   ordens    │
└─────────────┘

┌─────────────┐
│    pecas    │
└─────────────┘

┌─────────────┐     ┌─────────────┐
│materia_prima│────▶│  retiradas  │
└─────────────┘     └─────────────┘
                           ▲
┌─────────────┐            │
│consumiveis  │────────────┘
└─────────────┘
```

## Verificação da Instalação

### 1. Verificar se o banco foi criado

```sql
SHOW DATABASES LIKE 'aerogestor';
```

### 2. Verificar tabelas criadas

```sql
USE aerogestor;
SHOW TABLES;
```

### 3. Verificar dados de exemplo (se inseridos)

```sql
SELECT COUNT(*) FROM ordens;
SELECT COUNT(*) FROM pecas;
SELECT COUNT(*) FROM materia_prima;
SELECT COUNT(*) FROM consumiveis;
SELECT COUNT(*) FROM retiradas;
```

## Manutenção

### Backup do Banco de Dados

```bash
mysqldump -u root -p aerogestor > backup_aerogestor_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
mysql -u root -p aerogestor < backup_aerogestor_YYYYMMDD.sql
```

### Limpar dados de teste

```sql
USE aerogestor;
TRUNCATE TABLE retiradas;
TRUNCATE TABLE consumiveis;
TRUNCATE TABLE materia_prima;
TRUNCATE TABLE pecas;
TRUNCATE TABLE ordens;
```

## Troubleshooting

### Erro: "Access denied for user"

Verifique o usuário e senha nas configurações da aplicação.

### Erro: "Unknown database 'aerogestor'"

Certifique-se de que o parâmetro `createDatabaseIfNotExist=true` está na URL de conexão, ou crie o banco manualmente.

### Erro: "The server time zone value is unrecognized"

Adicione `&serverTimezone=UTC` na URL de conexão:
```
jdbc:mysql://localhost:3306/aerogestor?serverTimezone=UTC
```

### Verificar status do MySQL

```bash
# Windows
Get-Service MySQL*

# Linux
sudo systemctl status mysql
```

## Documentação Adicional

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)
