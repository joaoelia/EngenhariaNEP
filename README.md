# AeroGestor - Sistema de Gerenciamento Industrial

Sistema completo de gerenciamento industrial com frontend em Next.js e backend em Java Spring Boot.

## 📁 Estrutura do Projeto

```
AeroGestor/
├── frontend/               # Aplicação Next.js
│   ├── app/               # Rotas e páginas
│   ├── components/        # Componentes React
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários
│   ├── public/           # Arquivos estáticos
│   ├── package.json
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── backend/               # API REST Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/aerogestor/
│   │       │   ├── model/        # Entidades JPA
│   │       │   ├── repository/   # Repositórios
│   │       │   ├── service/      # Lógica de negócio
│   │       │   ├── controller/   # Endpoints REST
│   │       │   ├── config/       # Configurações
│   │       │   └── exception/    # Tratamento de erros
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── infrastructure/        # Infraestrutura e DevOps
│   ├── docker-compose.yml
│   ├── setup-database.bat
│   └── setup-database.ps1
│
├── docs/                  # Documentação
├── .gitignore
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Docker Desktop
- Node.js 18+ e pnpm
- Java 17+ (opcional, se não usar Docker)

### 1. Backend (Java + MySQL)

```bash
# Entre na pasta de infraestrutura
cd infrastructure

# Inicia MySQL e Backend com Docker
docker-compose up -d

# Backend estará disponível em: http://localhost:8080/api
```

### 2. Frontend (Next.js)

```bash
# Entre na pasta do frontend
cd frontend

# Instala dependências
pnpm install

# Inicia servidor de desenvolvimento
pnpm dev

# Frontend estará disponível em: http://localhost:3000
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 16** - Framework React com Turbopack
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Componentes UI reutilizáveis
- **Lucide Icons** - Biblioteca de ícones
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Java 17** - Linguagem de programação
- **Spring Boot 3.2.1** - Framework Java
- **Spring Data JPA** - Abstração de persistência
- **Hibernate** - ORM
- **MySQL 8.0** - Banco de dados
- **Maven** - Gerenciador de dependências
- **Lombok** - Redução de boilerplate

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 📚 Recursos

### Módulos do Sistema
- **Consumíveis** - Controle de estoque de materiais consumíveis
- **Matéria-Prima** - Gestão de matérias-primas e insumos
- **Peças Fabricadas** - Registro e controle de peças produzidas
- **Ordens** - Gerenciamento de ordens de fabricação, produção e projetos
- **Retiradas** - Histórico de movimentações de estoque

### APIs RESTful
- `/api/consumiveis`
- `/api/materia-prima`
- `/api/pecas`
- `/api/ordens`
- `/api/retiradas`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aerogestor
spring.datasource.username=root
spring.datasource.password=root
server.port=8080
server.servlet.context-path=/api
```

### Frontend
Crie um arquivo `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🐳 Docker

### Comandos Úteis

```bash
# Visualizar logs
cd infrastructure
docker-compose logs -f backend

# Parar containers
docker-compose down

# Reconstruir imagens
docker-compose build --no-cache

# Verificar status
docker-compose ps
```

## 📋 Features Implementadas

- ✅ CRUD completo de Consumíveis
- ✅ CRUD completo de Matéria-Prima
- ✅ CRUD completo de Peças
- ✅ CRUD completo de Ordens (Fabricação, Produção, Projeto)
- ✅ Sistema de Retiradas com histórico
- ✅ Rastreamento de estoque
- ✅ Interface responsiva
- ✅ Diálogos de visualização, edição e exclusão
- ✅ Validação de formulários
- ✅ API RESTful documentada
- ✅ Containerização com Docker

## 🚧 Roadmap

- [ ] Autenticação e autorização
- [ ] Dashboard com gráficos e métricas
- [ ] Relatórios em PDF
- [ ] Sistema de notificações
- [ ] Controle de versão de documentos
- [ ] Integração com ERP

## 📝 Licença

Projeto desenvolvido para uso interno - NEP
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📝 Licença

Projeto desenvolvido para uso interno - Aviation Parts
