# 🧪 Guia de Testes - Autenticação JWT

## ✅ Requisitos Implementados

### 1. **Animação de Clique no Botão de Login**
- ✓ Botão com efeito `scale-95` ao clicar
- ✓ Transição suave de 150ms
- ✓ Cursor muda para pointer
- ✓ Visual feedback durante o carregamento

### 2. **Usuário Administrador Padrão**
- **Email:** (configurado em `APP_ADMIN_EMAIL`)
- **Senha:** (configurada em `APP_ADMIN_PASSWORD`)
- **Role:** ADMIN
- ✓ Criado automaticamente na primeira execução
- ✓ Armazenado no MySQL com hash BCrypt

🔒 **SEGURANÇA**: Configure suas próprias credenciais no arquivo `.env`

### 3. **Segurança de Senhas**
- ✓ Criptografia BCrypt (impossível recuperar)
- ✓ Salt único por usuário
- ✓ Process computacionalmente caro para atacantes
- ✓ Verificação segura: `passwordEncoder.encode()`

### 4. **Persistência no MySQL**
- ✓ Banco de dados Docker: `aerogestor-mysql`
- ✓ Tabela `users` criada por Hibernate
- ✓ JPA `spring.jpa.hibernate.ddl-auto=update`
- ✓ Dados NÃO salvos localmente

---

## 🧪 Testes com Postman

### Pré-requisitos
- Backend rodando: `http://localhost:8080/api`
- Frontend rodando: `http://localhost:3000`
- Docker Compose ativo: `docker-compose up -d`

---

### 1️⃣ **Login Admin (Obter Token JWT)**

**URL:**
```
POST http://localhost:8080/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "your_configured_email",
  "password": "your_configured_password"
}
```

**🔒 Use as credenciais configuradas no arquivo `.env`**

**Resposta Esperada (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "admin",
  "role": "ADMIN"
}
```

**Testes:**
- [ ] Status 200 OK
- [ ] Campo `token` contém um JWT válido
- [ ] Campo `type` é "Bearer"
- [ ] Campo `username` é "admin"

---

### 2️⃣ **Teste: Senha Incorreta (Segurança)**

**URL:**
```
POST http://localhost:8080/api/auth/login
```

**Body:**
```json
{
  "username": "admin",
  "password": "senhaerrada"
}
```

**Resposta Esperada (401 Unauthorized):**
```json
{
  "timestamp": "2026-02-23...",
  "status": 401,
  "error": "Unauthorized",
  "message": "Bad credentials"
}
```

**Testes:**
- [ ] Status 401
- [ ] Sem token retornado
- [ ] Mensagem de erro clara

---

### 3️⃣ **Teste: Verificar Senha no Banco (Segurança)**

```bash
# Execute no terminal (substitua as credenciais):
docker exec aerogestor-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} aerogestor \
  -e "SELECT username, email, password FROM users WHERE email='seu_email_configurado';"
```

**Resposta Esperada:**
```
username    email                  password
admin       seu_email_configurado  $2a$10$xxxxxxxxxxx... (HASH, não texto puro!)
```

**Verificação:**
- [ ] Senha começa com `$2a$10$` (BCrypt)
- [ ] Senha NÃO é texto puro
- [ ] Hash é único (cada execução gera hash diferente)

---

### 4️⃣ **Listar Consumíveis (Endpoint Protegido)**

Primeiro, execute o teste `1️⃣` para obter o token.

**URL:**
```
GET http://localhost:8080/api/consumiveis
```

**Headers:**
```
Authorization: Bearer {TOKEN_DO_TESTE_ANTERIOR}
Content-Type: application/json
```

**Resposta Esperada (200 OK):**
```json
[]
```
(Array vazio ou com consumíveis já criados)

**Testes:**
- [ ] Status 200 OK
- [ ] Retorna array JSON
- [ ] Sem token retorna 401 Unauthorized

---

### 5️⃣ **Teste: Sem Token (Segurança)**

**URL:**
```
GET http://localhost:8080/api/consumiveis
```

**Headers:**
```
(SEM header Authorization)
```

**Resposta Esperada (403 Forbidden):**
```json
{
  "timestamp": "2026-02-23...",
  "status": 403,
  "error": "Forbidden"
}
```

**Testes:**
- [ ] Status 403
- [ ] Acesso negado sem token

---

### 6️⃣ **Criar Consumível (com Autenticação)**

**URL:**
```
POST http://localhost:8080/api/consumiveis
```

**Headers:**
```
Authorization: Bearer {TOKEN_DO_TESTE_1}
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Parafuso Allen M6x20",
  "partNumber": "PN-001",
  "quantidade": 500,
  "fornecedor": "Fornecedor ABC",
  "localEstoque": "Estoque A - Prateleira 3"
}
```

**Resposta Esperada (201 Created):**
```json
{
  "id": 1,
  "nome": "Parafuso Allen M6x20",
  "partNumber": "PN-001",
  "quantidade": 500,
  "fornecedor": "Fornecedor ABC",
  "localEstoque": "Estoque A - Prateleira 3"
}
```

**Testes:**
- [ ] Status 201 Created
- [ ] Campo `id` retornado
- [ ] Dados salvos no MySQL

---

### 7️⃣ **Verificar Dados no MySQL**

```bash
# Execute no terminal:
docker exec aerogestor-mysql mysql -u root -prootpassword aerogestor \
  -e "SELECT * FROM consumiveis;"
```

**Verificação:**
- [ ] Consumível criado no teste anterior está presente
- [ ] Dados correspondem exatamente aos enviados

---

## 📋 Cenários de Teste

### ✅ Teste de Segurança Completo

| Teste | Ação | Resultado | Status |
|-------|------|-----------|--------|
| Login Válido | POST /auth/login (credenciais corretas) | 200 + Token JWT | ✓ |
| Login Inválido | POST /auth/login (senha errada) | 401 Unauthorized | ✓ |
| Acesso Sem Token | GET /consumiveis (sem Authorization) | 403 Forbidden | ✓ |
| Acesso Com Token | GET /consumiveis (com Authorization) | 200 OK | ✓ |
| Hash Seguro | Verificar MySQL | Senha em BCrypt ($2a$10$...) | ✓ |
| Persistência | Criar consumível, verificar MySQL | Dados salvos | ✓ |

---

## 🔧 Troubleshooting

### Erro: "CORS policy blocked"
- Certifique-se que `APP_CORS_ALLOWED_ORIGINS=http://localhost:3000`
- Reinicie o container: `docker-compose restart backend`

### Erro: "Bad credentials"
- Verifique se o banco foi inicializado: `docker-compose up -d`
- Verifique se o usuário admin existe no MySQL

### Erro: "Cannot connect to MySQL"
- Certifique-se que o container MySQL está rodando: `docker ps`
- Verifique credenciais em `docker-compose.yml`

### Erro: "The application failed to start"
- Revise logs: `docker logs aerogestor-backend --tail 50`
- Verifique arquivo `application.properties`

---

## 📚 Referências

- [JWT (JSON Web Tokens)](https://jwt.io/)
- [BCrypt](https://en.wikipedia.org/wiki/Bcrypt)
- [Spring Security](https://spring.io/projects/spring-security)
- [Postman Documentation](https://learning.postman.com/)

---

**Última atualização:** 23/02/2026
