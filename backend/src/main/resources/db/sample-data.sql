-- AeroGestor Sample Data
-- MySQL Sample Data for Testing

-- Sample Ordens
INSERT INTO ordens (numero_ordem, tipo_ordem, projeto, part_number, status, data_criacao, descricao, observacoes) VALUES
('ORD-2024-001', 'fabricacao', 'Projeto Alpha', 'PN-001-A', 'Em Andamento', '2024-01-15', 'Ordem de fabricação de componentes estruturais', 'Prioridade alta'),
('ORD-2024-002', 'producao', 'Projeto Beta', 'PN-002-B', 'Concluída', '2024-01-20', 'Produção de peças de sustentação', 'Concluído dentro do prazo'),
('ORD-2024-003', 'projeto', 'Projeto Gamma', 'PN-003-C', 'Planejamento', '2024-02-01', 'Desenvolvimento de novo sistema hidráulico', NULL);

-- Sample Pecas
INSERT INTO pecas (codigo_peca, descricao, numero_desenho, revisao, quantidade_produzida, unidade_medida, data_fabricacao, lote_producao, operador_responsavel, maquina_utilizada, tempo_fabricacao_horas, status_qualidade, observacoes) VALUES
('PEC-001', 'Suporte de Asa Principal', 'DES-2024-001', 'Rev A', 10, 'UN', '2024-01-25', 'LOTE-001', 'João Silva', 'CNC-01', 8.5, 'Aprovado', 'Todas as peças dentro das especificações'),
('PEC-002', 'Braço de Controle', 'DES-2024-002', 'Rev B', 20, 'UN', '2024-01-28', 'LOTE-002', 'Maria Santos', 'CNC-02', 6.2, 'Aprovado', NULL),
('PEC-003', 'Flange de Fixação', 'DES-2024-003', 'Rev A', 15, 'UN', '2024-02-02', 'LOTE-001', 'Pedro Costa', 'CNC-01', 4.8, 'Em Inspeção', 'Aguardando verificação dimensional');

-- Sample Materia Prima
INSERT INTO materia_prima (codigo, descricao, tipo_material, densidade, especificacao, quantidade_estoque, unidade_medida, lote, data_entrada, fornecedor, certificado_qualidade, observacoes) VALUES
('MAT-001', 'Alumínio 7075-T6', 'Alumínio', 2.81, 'AMS 4045', 500.50, 'KG', 'L-2024-001', '2024-01-10', 'Metalúrgica XYZ Ltda', 'CERT-2024-001', 'Material de alta resistência'),
('MAT-002', 'Aço Inoxidável 304', 'Aço', 8.00, 'ASTM A240', 350.75, 'KG', 'L-2024-002', '2024-01-15', 'Aços Especiais S.A.', 'CERT-2024-002', NULL),
('MAT-003', 'Titânio Grade 5', 'Titânio', 4.43, 'AMS 4928', 120.25, 'KG', 'L-2024-003', '2024-01-20', 'Importadora Titânio Brasil', 'CERT-2024-003', 'Armazenar em local seco'),
('MAT-004', 'Compósito Fibra de Carbono', 'Compósito', 1.60, 'AMS 3865', 80.00, 'M2', 'L-2024-004', '2024-01-25', 'Composites Tech', 'CERT-2024-004', 'Manter temperatura controlada');

-- Sample Consumiveis
INSERT INTO consumiveis (nome, part_number, quantidade, fornecedor, local_estoque) VALUES
('Rebites de Alumínio 3/16"', 'RIV-AL-316', 5000, 'Rebites Industriais Ltda', 'Almoxarifado A - Prateleira 3'),
('Parafusos AN3-5A', 'PAR-AN3-5A', 2500, 'Parafusos Aeronáuticos', 'Almoxarifado A - Prateleira 5'),
('Arruelas AN960-416', 'ARR-AN960-416', 3000, 'Parafusos Aeronáuticos', 'Almoxarifado A - Prateleira 5'),
('Graxa Aeronáutica MIL-G-21164', 'GRX-MIL-21164', 50, 'Lubrificantes Aviation', 'Almoxarifado B - Armário 2'),
('Selante PR-1440', 'SEL-PR-1440', 30, 'Químicos Aeroespaciais', 'Almoxarifado B - Refrigerador'),
('Lixa d\'Água Grão 320', 'LIX-320', 200, 'Abrasivos Industriais', 'Almoxarifado C - Gaveta 1');

-- Sample Retiradas
INSERT INTO retiradas (tipo_item, item_id, item_nome, quantidade, pessoa, data, observacoes) VALUES
('materia-prima', 1, 'Alumínio 7075-T6', 25.5, 'João Silva', '2024-01-26', 'Retirada para ordem ORD-2024-001'),
('consumivel', 1, 'Rebites de Alumínio 3/16"', 150, 'Maria Santos', '2024-01-29', 'Montagem de estrutura'),
('materia-prima', 2, 'Aço Inoxidável 304', 15.0, 'Pedro Costa', '2024-02-02', 'Fabricação de suportes'),
('consumivel', 4, 'Graxa Aeronáutica MIL-G-21164', 2, 'Ana Oliveira', '2024-02-02', 'Manutenção de máquinas');
