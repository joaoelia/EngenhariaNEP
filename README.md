# AeroGestor - Sistema de Gerenciamento Industrial

Sistema completo de gerenciamento industrial com frontend em Next.js e backend em Java Spring Boot.

## 📁 Estrutura do Projeto

```
AeroGestor/
├── app/                    # Frontend Next.js
├── components/             # Componentes React
├── backend/                # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/aerogestor/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   ├── service/
│   │       │   ├── controller/
│   │       │   └── config/
│   │       └── resources/
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yml      # Orquestração Docker
├── package.json            # Dependências frontend
└── next.config.mjs
```

## 🚀 Como Executar

### Backend (Java + MySQL)

```bash
# Inicia MySQL e Backend com Docker
docker-compose up -d

# Backend estará disponível em: http://localhost:8080
```

### Frontend (Next.js)

```bash
# Instala dependências
pnpm install

# Inicia servidor de desenvolvimento
pnpm dev

# Frontend estará disponível em: http://localhost:3000
```

## 🛠️ Tecnologias

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide Icons

### Backend
- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- MySQL 8.0
- Maven
- Docker

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
- `/api/retiradas`

Documentação completa no [backend/README.md](backend/README.md)

## 🔧 Configuração

### Backend
Edite `backend/src/main/resources/application.properties`

### Frontend
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📝 Licença

Projeto desenvolvido para uso interno - Aviation Parts
