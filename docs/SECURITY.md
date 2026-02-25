# 🔒 Guia de Segurança - AeroGestor

## 1. Proteção de Credenciais

### Armazenamento Seguro de Senhas

✅ **Implementado:**
- Todas as senhas são criptografadas usando **BCrypt** antes de serem salvas no banco de dados
- BCrypt usa salt aleatório e é resistente a ataques de força bruta
- Mesmo se o banco de dados for comprometido, as senhas não podem ser revertidas

```java
// A senha é sempre criptografada antes de salvar
String hashedPassword = passwordEncoder.encode(plainPassword);
```

### Usuário Administrador Padrão

O sistema cria automaticamente um usuário administrador na primeira inicialização:

- **Email:** `admin@aviationpartsinc.com.br`
- **Senha:** `1170Avion@#`
- **Função:** ADMIN

⚠️ **IMPORTANTE:** A senha é armazenada com hash BCrypt no banco de dados, não em texto puro.

## 2. Proteção Contra Invasões

### Camadas de Segurança Implementadas:

1. **Senhas com Hash Bcrypt**
   - Impossível reverter a senha original
   - Cada senha tem um salt único
   - Processo computacionalmente caro para atacantes

2. **JWT (JSON Web Tokens)**
   - Tokens assinados com chave secreta
   - Expiração automática (24 horas)
   - Validação em cada requisição

3. **Variáveis de Ambiente**
   - Credenciais sensíveis nunca no código-fonte
   - Arquivo `.env` no `.gitignore`
   - Valores padrão apenas para desenvolvimento

4. **Banco de Dados MySQL**
   - Todos os dados persistidos no MySQL, não em memória
   - Tabelas criadas automaticamente via JPA/Hibernate
   - Conexão protegida por usuário/senha

## 3. Configuração em Produção

### ⚠️ OBRIGATÓRIO para Produção:

1. **Alterar JWT Secret:**
```env
APP_JWT_SECRET=sua-chave-super-secreta-com-no-minimo-32-caracteres
```

2. **Alterar Senha do Admin:**
```env
APP_ADMIN_PASSWORD=SuaSenhaForte@123!
```

3. **Alterar Credenciais do MySQL:**
```env
SPRING_DATASOURCE_PASSWORD=senha-mysql-forte
MYSQL_ROOT_PASSWORD=senha-mysql-forte
```

4. **Habilitar HTTPS:**
   - Configure SSL/TLS no servidor
   - Tokens JWT devem trafegar apenas por HTTPS

5. **Configurar Firewall:**
   - Bloqueie acesso direto ao MySQL (porta 3306)
   - Exponha apenas a API (porta 8080) via gateway/proxy

## 4. Arquivos Sensíveis

### ❌ NUNCA faça commit de:
- `.env` (configurações reais)
- `application-prod.properties` (se houver)
- Arquivos com credenciais reais
- Backups de banco de dados

### ✅ SEMPRE no `.gitignore`:
```
.env
*.env
application-prod.properties
*.log
/target/
/node_modules/
```

## 5. Verificação da Configuração

### Como verificar se está seguro:

1. **Senha no banco de dados:**
```sql
SELECT password FROM users WHERE email = 'admin@aviationpartsinc.com.br';
-- Deve retornar algo como: $2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-- NUNCA a senha em texto puro
```

2. **Variáveis de ambiente carregadas:**
```bash
# No container Docker
docker exec aerogestor-backend env | grep APP_ADMIN
```

3. **Teste de autenticação:**
```bash
# Login deve funcionar com as credenciais
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"1170Avion@#"}'
```

## 6. Persistência de Dados

### MySQL - Não Local

✅ **Configuração Verificada:**
- Hibernate DDL: `spring.jpa.hibernate.ddl-auto=update`
- Todas as tabelas são criadas automaticamente no MySQL
- Dados NÃO são armazenados em H2 ou banco em memória
- Volume Docker persiste os dados: `mysql_data:/var/lib/mysql`

### Tabelas Criadas Automaticamente:
- `users` - Usuários do sistema
- `consumiveis` - Consumíveis
- `materia_prima` - Matéria-prima
- `pecas` - Peças
- `ordens_producao` - Ordens de produção
- `retiradas` - Retiradas de material

## 7. Recuperação de Desastres

### Backup do Banco de Dados:
```bash
# Exportar dados
docker exec aerogestor-mysql mysqldump -u root -prootpassword aerogestor > backup.sql

# Restaurar dados
docker exec -i aerogestor-mysql mysql -u root -prootpassword aerogestor < backup.sql
```

## 8. Auditoria e Monitoramento

### Logs de Segurança:
- Login bem-sucedido/falho
- Criação de usuários
- Alterações em dados sensíveis

### Recomendado implementar:
- [ ] Rate limiting para prevenir força bruta
- [ ] Log de tentativas de login falhadas
- [ ] Bloqueio temporário após N tentativas falhas
- [ ] Autenticação de dois fatores (2FA)

---

## ✅ Checklist de Segurança

- [x] Senhas criptografadas com BCrypt
- [x] JWT implementado
- [x] Variáveis de ambiente configuradas
- [x] Banco de dados MySQL (não local)
- [x] Arquivo .env.example criado
- [x] Credenciais fora do código-fonte
- [ ] SSL/TLS configurado (produção)
- [ ] Firewall configurado (produção)
- [ ] Backup automatizado (produção)

---

**Última atualização:** 23/02/2026
