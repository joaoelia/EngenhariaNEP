# 🔐 Configuração de Segurança - Infrastructure

## Variáveis de Ambiente

Este projeto usa variáveis de ambiente para proteger informações sensíveis como credenciais e chaves secretas.

### Configuração Inicial

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env` com suas credenciais:**
   ```bash
   nano .env
   # ou
   code .env
   ```

3. **Configure as seguintes variáveis OBRIGATÓRIAS:**

   ```bash
   # Database
   MYSQL_ROOT_PASSWORD=sua_senha_mysql_forte
   MYSQL_DATABASE=aerogestor

   # Admin User - ALTERE ESTAS CREDENCIAIS!
   APP_ADMIN_EMAIL=seu_email@empresa.com.br
   APP_ADMIN_PASSWORD=SuaSenhaForte123!@#

   # JWT Secret - Use uma chave longa e aleatória
   APP_JWT_SECRET=sua_chave_secreta_jwt_com_pelo_menos_32_caracteres
   ```

### ⚠️ IMPORTANTE - Segurança

- ✅ O arquivo `.env` está no `.gitignore` e **NUNCA** será commitado
- ✅ Use senhas fortes e únicas para produção
- ✅ Nunca compartilhe seu arquivo `.env` com outras pessoas
- ✅ Para cada ambiente (dev/staging/prod), use credenciais diferentes
- ❌ NUNCA commit credenciais reais no repositório Git

### Iniciando os Serviços

```bash
# Com as variáveis configuradas no arquivo .env:
docker-compose up -d

# Verificar se os containers estão rodando:
docker-compose ps

# Ver logs:
docker-compose logs -f
```

### Verificação de Segurança

Para verificar se as credenciais estão corretas:

```bash
# Ver variáveis de ambiente do backend (sem mostrar valores sensíveis):
docker exec aerogestor-backend env | grep APP_ADMIN_EMAIL

# Testar login (use suas credenciais):
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@empresa.com.br","password":"SuaSenhaForte123!@#"}'
```

### Produção

Para ambientes de produção, considere usar:
- **AWS Secrets Manager**
- **Azure Key Vault**
- **HashiCorp Vault**
- **Kubernetes Secrets**

Nunca use valores default ou de exemplo em produção!

## Suporte

Para dúvidas sobre configuração de segurança, consulte:
- [docs/SECURITY.md](../docs/SECURITY.md)
- [TESTING-MANUAL.md](../TESTING-MANUAL.md)
