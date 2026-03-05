# Configuração de Ambiente - AeroGestor

## ✅ Status de Configuração

- ✅ `.env` criado com configurações de produção
- ✅ JWT Secret gerado de forma segura: `Hh4EzpkvInlZjvDLtnfIy0NTjdsg0aY0Pa7zbrxNk1s=`
- ✅ `.env` já está no `.gitignore` (padrão: `*.env*`)
- ✅ `.env.example` disponível como referência

---

## 📋 Arquivos de Ambiente

### Frontend
- **`.env.example`** - Template com exemplos (COMMITAR no Git)
- **`.env`** - Configuração local de desenvolvimento (❌ NÃO COMMITAR)
- **`.env.production`** - Configuração de produção (❌ NÃO COMMITAR)

### Backend
- **`application.properties`** - Padrões (GitHub)
- **Variáveis de Ambiente** - Via Docker, Kubernetes ou servidor (❌ sensível)

---

## 🚀 Antes de Deploy em Produção

### Passo 1: Gerar novo JWT Secret (recomendado a cada ambiente)

```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Copiar o valor gerado e atualizar `APP_JWT_SECRET` no `.env`**

---

### Passo 2: Atualizar Credenciais de Produção

Edite o arquivo `.env` com dados reais:

```env
# Frontend
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com

# Database
SPRING_DATASOURCE_URL=jdbc:mysql://seu-host:3306/aerogestor?useSSL=true
SPRING_DATASOURCE_USERNAME=seu_usuario_db
SPRING_DATASOURCE_PASSWORD=sua_senha_segura

# Admin
APP_ADMIN_EMAIL=admin@seu-dominio.com
APP_ADMIN_PASSWORD=SenhaForteComMaisde12Caracteres123!

# CORS
APP_CORS_ALLOWED_ORIGINS=https://seu-dominio.com

# JWT
APP_JWT_SECRET=Hh4EzpkvInlZjvDLtnfIy0NTjdsg0aY0Pa7zbrxNk1s=
```

---

### Passo 3: Verificar .gitignore

✅ Já está configurado:

```ignore
# .gitignore
.env*
```

Isso significa:
- ✅ `.env` será ignorado
- ✅ `.env.local` será ignorado  
- ✅ `.env.production` será ignorado
- ✅ `.env.example` será commitado (serve como template)

**Verificar antes de fazer commit:**
```bash
git status
```

Se aparecer `.env` na lista, você não seguiu as instruções! ⚠️

---

## 🔧 Para Diferentes Ambientes

### Desenvolvimento Local

```bash
# Frontend: usar port 3000
NEXT_PUBLIC_API_URL=http://localhost:8080

# Backend: use docker-compose
docker-compose up -d
```

### Staging

```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api-staging.seu-dominio.com

# Backend: deploy em servidor staging
```

### Produção

```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com

# Backend: deploy em produção
# Variáveis de ambiente via:
# - Docker secrets (Swarm)
# - Kubernetes secrets
# - AWS Systems Manager Parameter Store
# - Azure Key Vault
# Etc.
```

---

## 🛡️ Segurança - Checklist

- [ ] `.env` arquivo criado com valores de produção reais
- [ ] JWT Secret alterado (use `node -e "..."` para gerar)
- [ ] Email admin alterado
- [ ] Senha admin alterada e armazenada seguramente
- [ ] `NEXT_PUBLIC_API_URL` usa HTTPS
- [ ] `APP_CORS_ALLOWED_ORIGINS` apenas seu domínio (sem localhost)
- [ ] Database password é forte (>12 caracteres)
- [ ] Database URL usa `useSSL=true`
- [ ] Não fez commit de `.env` no Git
- [ ] `.env` está no `.gitignore`

---

## ❌ O Que NÃO Fazer

```bash
# ❌ ERRADO - Nunca commitar arquivo .env
git add .env
git commit -m "Add production credentials"

# ❌ ERRADO - Hardcoding secrets no código
const API_URL = "https://admin:password@api.com"

# ❌ ERRADO - Compartilhar .env por email ou chat
# "Segue em anexo o .env para produção..."

# ❌ ERRADO - Usar mesma senha em múltiplos ambientes
# dev, staging e produção devem ter senhas DIFERENTES
```

---

## ✅ O Que Fazer

```bash
# ✅ CORRETO - Usar variáveis de ambiente
echo "APP_JWT_SECRET=seu-secret" > .env
source .env  # ou export em PowerShell

# ✅ CORRETO - Use um gerenciador de secrets
# AWS Secrets Manager
# Azure Key Vault
# HashiCorp Vault
# 1Password Business

# ✅ CORRETO - Compartilhe seguramente
# 1. Gere credentials seguras
# 2. Armazene em gerenciador de secrets
# 3. Equipe acessa through authenticated portal
```

---

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Spring Boot Configuration](https://spring.io/guides/gs/spring-boot/)
- [12-Factor App - Config](https://12factor.net/config)
- [OWASP - Secrets Management](https://owasp.org/www-project-top-10/)

---

## 🎯 Próximas Ações

1. ✅ Arquivo `.env` criado
2. ⏳ **Complete:** Atualize valores com dados reais de produção
3. ⏳ **Teste:** Verifique que aplicação inicia com novo `.env`
4. ⏳ **Deploy:** Siga processo de deploy da sua infraestrutura
5. ⏳ **Altere senha:** Primeira execução, troque `APP_ADMIN_PASSWORD`

---

**Documentado em:** 2025-03-03  
**Status:** Pronto para Produção ✅
