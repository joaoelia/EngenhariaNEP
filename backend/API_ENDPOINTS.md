# API Endpoints - AeroGestor Backend

Base URL: `http://localhost:8080/api`

## 📦 Consumíveis

### Listar todos
```http
GET /api/consumiveis
```

### Buscar por ID
```http
GET /api/consumiveis/{id}
```

### Criar novo
```http
POST /api/consumiveis
Content-Type: application/json

{
  "nome": "Parafuso Allen M6x20",
  "partNumber": "PN-001",
  "quantidade": 500,
  "fornecedor": "Fornecedor ABC",
  "localEstoque": "Estoque A - Prateleira 3"
}
```

### Atualizar
```http
PUT /api/consumiveis/{id}
Content-Type: application/json

{
  "nome": "Parafuso Allen M6x20",
  "partNumber": "PN-001",
  "quantidade": 450,
  "fornecedor": "Fornecedor ABC",
  "localEstoque": "Estoque A - Prateleira 3"
}
```

### Excluir
```http
DELETE /api/consumiveis/{id}
```

### Atualizar quantidade
```http
PATCH /api/consumiveis/{id}/quantidade?quantidade=450
```

---

## 🔩 Matéria-Prima

### Listar todos
```http
GET /api/materia-prima
```

### Buscar por ID
```http
GET /api/materia-prima/{id}
```

### Criar nova
```http
POST /api/materia-prima
Content-Type: application/json

{
  "codigo": "MP-001",
  "descricao": "Chapa de Alumínio 6061-T6",
  "tipoMaterial": "Alumínio",
  "densidade": 2.7,
  "especificacao": "AMS 4911",
  "quantidadeEstoque": 150.5,
  "unidadeMedida": "KG",
  "lote": "LOT-2024-001",
  "dataEntrada": "2024-01-10",
  "fornecedor": "Alumínio Brasil LTDA",
  "certificadoQualidade": "CERT-2024-001",
  "observacoes": "Material certificado para uso aeronáutico"
}
```

### Atualizar
```http
PUT /api/materia-prima/{id}
```

### Excluir
```http
DELETE /api/materia-prima/{id}
```

### Atualizar estoque
```http
PATCH /api/materia-prima/{id}/estoque?quantidade=140.5
```

---

## ⚙️ Peças

### Listar todas
```http
GET /api/pecas
```

### Buscar por ID
```http
GET /api/pecas/{id}
```

### Criar nova
```http
POST /api/pecas
Content-Type: application/json

{
  "codigoPeca": "PCA-001",
  "descricao": "Suporte de Fixação Asa",
  "numeroDesenho": "DWG-12345",
  "revisao": "B",
  "quantidadeProduzida": 10,
  "unidadeMedida": "UN",
  "dataFabricacao": "2024-03-10",
  "loteProducao": "LOT-PROD-001",
  "operadorResponsavel": "João Silva",
  "maquinaUtilizada": "CNC-01",
  "tempoFabricacaoHoras": 24.5,
  "statusQualidade": "Aprovada",
  "observacoes": "Peça conforme especificação"
}
```

### Atualizar
```http
PUT /api/pecas/{id}
```

### Excluir
```http
DELETE /api/pecas/{id}
```

### Atualizar quantidade
```http
PATCH /api/pecas/{id}/quantidade?quantidade=8
```

---

## 📋 Ordens

### Listar todas
```http
GET /api/ordens
```

### Buscar por ID
```http
GET /api/ordens/{id}
```

### Criar nova
```http
POST /api/ordens
Content-Type: application/json

{
  "numeroOrdem": "ORD-001",
  "tipoOrdem": "Fabricação",
  "projeto": "Projeto Asa Delta X100",
  "partNumber": "PN-ASA-001",
  "status": "Aberta",
  "dataCriacao": "2024-03-01",
  "descricao": "Ordem de fabricação para componentes da asa",
  "observacoes": "Prioridade alta"
}
```

### Atualizar
```http
PUT /api/ordens/{id}
```

### Excluir
```http
DELETE /api/ordens/{id}
```

### Atualizar status
```http
PATCH /api/ordens/{id}/status?status=Em%20Andamento
```

Status possíveis: `Aberta`, `Em Andamento`, `Pausada`, `Concluída`, `Cancelada`

---

## 📤 Retiradas

### Listar todas
```http
GET /api/retiradas
```

### Listar por tipo
```http
GET /api/retiradas/tipo/{tipoItem}
```
Tipos: `consumivel`, `materia-prima`, `peca`

### Listar por item
```http
GET /api/retiradas/item/{itemId}
```

### Buscar por ID
```http
GET /api/retiradas/{id}
```

### Criar nova
```http
POST /api/retiradas
Content-Type: application/json

{
  "tipoItem": "consumivel",
  "itemId": 1,
  "itemNome": "Parafuso Allen M6x20",
  "quantidade": 50.0,
  "pessoa": "João Silva",
  "data": "2024-03-15",
  "observacoes": "Retirada para ordem ORD-001"
}
```

### Excluir
```http
DELETE /api/retiradas/{id}
```

---

## 🚨 Respostas de Erro

### Formato de erro
```json
{
  "timestamp": "2024-03-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Part Number já cadastrado: PN-001",
  "path": "/api/consumiveis"
}
```

### Códigos HTTP
- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `204 No Content` - Exclusão bem-sucedida
- `400 Bad Request` - Erro de validação
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor
