# AeroGestor Backend

Backend robusto em Java Spring Boot para o sistema de gerenciamento industrial AeroGestor.

## 🛠️ Tecnologias

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data JPA**
- **MySQL 8.0**
- **Docker & Docker Compose**
- **Maven**
- **Lombok**

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Java 17+ (para desenvolvimento local)
- Maven 3.6+ (para desenvolvimento local)

## 🚀 Como Executar

### Com Docker Compose (Recomendado)

Na raiz do projeto (onde está o docker-compose.yml):

```bash
docker-compose up -d
```

Isso irá:
1. Criar o container MySQL com o banco de dados
2. Construir e executar o backend Spring Boot
3. Criar a rede entre os serviços

O backend estará disponível em: `http://localhost:8080`

### Desenvolvimento Local

1. Certifique-se de que o MySQL está rodando
2. Ajuste as configurações em `application.properties`
3. Execute:

```bash
cd backend
mvn spring-boot:run
```

## 📚 Endpoints da API

### Consumíveis
- `GET /api/consumiveis` - Listar todos
- `GET /api/consumiveis/{id}` - Buscar por ID
- `GET /api/consumiveis/search?nome={nome}` - Buscar por nome
- `GET /api/consumiveis/estoque-baixo` - Listar com estoque baixo
- `POST /api/consumiveis` - Criar novo
- `PUT /api/consumiveis/{id}` - Atualizar
- `DELETE /api/consumiveis/{id}` - Deletar
- `POST /api/consumiveis/{id}/retirar` - Retirar quantidade
- `POST /api/consumiveis/{id}/adicionar` - Adicionar quantidade

### Matéria-Prima
- `GET /api/materia-prima` - Listar todas
- `GET /api/materia-prima/{id}` - Buscar por ID
- `GET /api/materia-prima/search?nome={nome}` - Buscar por nome
- `GET /api/materia-prima/tipo/{tipo}` - Buscar por tipo
- `GET /api/materia-prima/estoque-baixo` - Listar com estoque baixo
- `POST /api/materia-prima` - Criar nova
- `PUT /api/materia-prima/{id}` - Atualizar
- `DELETE /api/materia-prima/{id}` - Deletar
- `POST /api/materia-prima/{id}/retirar` - Retirar quantidade
- `POST /api/materia-prima/{id}/adicionar` - Adicionar quantidade

### Peças
- `GET /api/pecas` - Listar todas
- `GET /api/pecas/{id}` - Buscar por ID
- `GET /api/pecas/codigo/{codigo}` - Buscar por código
- `GET /api/pecas/search?nome={nome}` - Buscar por nome
- `GET /api/pecas/categoria/{categoria}` - Buscar por categoria
- `GET /api/pecas/estoque-baixo` - Listar com estoque baixo
- `POST /api/pecas` - Criar nova
- `PUT /api/pecas/{id}` - Atualizar
- `DELETE /api/pecas/{id}` - Deletar
- `POST /api/pecas/{id}/retirar` - Retirar quantidade
- `POST /api/pecas/{id}/adicionar` - Adicionar quantidade

### Ordens
- `GET /api/ordens` - Listar todas
- `GET /api/ordens/{id}` - Buscar por ID
- `GET /api/ordens/numero/{numero}` - Buscar por número
- `GET /api/ordens/tipo/{tipo}` - Buscar por tipo (FABRICACAO, PRODUCAO, PROJETO)
- `GET /api/ordens/status/{status}` - Buscar por status
- `GET /api/ordens/responsavel/{responsavel}` - Buscar por responsável
- `POST /api/ordens` - Criar nova
- `PUT /api/ordens/{id}` - Atualizar
- `DELETE /api/ordens/{id}` - Deletar
- `PATCH /api/ordens/{id}/status` - Atualizar status

### Retiradas
- `GET /api/retiradas` - Listar todas
- `GET /api/retiradas/{id}` - Buscar por ID
- `GET /api/retiradas/tipo/{tipoItem}` - Buscar por tipo (CONSUMIVEL, MATERIA_PRIMA, PECA)
- `GET /api/retiradas/item/{itemId}` - Buscar por item
- `GET /api/retiradas/responsavel/{responsavel}` - Buscar por responsável
- `GET /api/retiradas/periodo?inicio={inicio}&fim={fim}` - Buscar por período
- `POST /api/retiradas` - Criar nova (atualiza estoque automaticamente)
- `DELETE /api/retiradas/{id}` - Deletar

## 🗄️ Estrutura do Banco de Dados

- **consumiveis** - Controle de materiais consumíveis
- **materia_prima** - Gestão de matéria-prima
- **pecas** - Registro de peças fabricadas
- **ordens** - Gerenciamento de ordens (fabricação, produção, projeto)
- **retiradas** - Histórico de retiradas de estoque

## 🏗️ Arquitetura

```
backend/
├── src/main/java/com/aerogestor/
│   ├── model/          # Entidades JPA
│   ├── repository/     # Repositories Spring Data
│   ├── service/        # Lógica de negócio
│   ├── controller/     # REST Controllers
│   ├── config/         # Configurações (CORS, etc)
│   └── AeroGestorApplication.java
├── src/main/resources/
│   └── application.properties
├── Dockerfile
└── pom.xml
```

## 🔧 Configurações

Edite `application.properties` para ajustar:
- Porta do servidor
- Configurações do banco de dados
- Níveis de log
- Comportamento do Hibernate

## 📝 Licença

Projeto desenvolvido para uso interno.
