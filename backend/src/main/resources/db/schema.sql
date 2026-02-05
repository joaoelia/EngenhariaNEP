-- AeroGestor Database Schema
-- MySQL Database Setup

-- Create database (if not using createDatabaseIfNotExist parameter)
-- CREATE DATABASE IF NOT EXISTS aerogestor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE aerogestor;

-- Table: ordens (Ordem de Fabricação/Produção/Projeto)
CREATE TABLE IF NOT EXISTS ordens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_ordem VARCHAR(100) NOT NULL UNIQUE,
    tipo_ordem VARCHAR(50) NOT NULL,
    projeto VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    data_criacao DATE NOT NULL,
    data_conclusao DATE,
    descricao TEXT,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_numero_ordem (numero_ordem),
    INDEX idx_tipo_ordem (tipo_ordem),
    INDEX idx_status (status),
    INDEX idx_projeto (projeto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pecas (Peças Produzidas)
CREATE TABLE IF NOT EXISTS pecas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_peca VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(500) NOT NULL,
    numero_desenho VARCHAR(100) NOT NULL,
    revisao VARCHAR(50),
    quantidade_produzida INT NOT NULL,
    unidade_medida VARCHAR(20),
    data_fabricacao DATE NOT NULL,
    lote_producao VARCHAR(100),
    operador_responsavel VARCHAR(200),
    maquina_utilizada VARCHAR(200),
    tempo_fabricacao_horas DOUBLE,
    status_qualidade VARCHAR(50) NOT NULL,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo_peca (codigo_peca),
    INDEX idx_numero_desenho (numero_desenho),
    INDEX idx_lote_producao (lote_producao),
    INDEX idx_status_qualidade (status_qualidade),
    INDEX idx_data_fabricacao (data_fabricacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: materia_prima (Matéria Prima)
CREATE TABLE IF NOT EXISTS materia_prima (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(500) NOT NULL,
    tipo_material VARCHAR(100) NOT NULL,
    densidade DOUBLE,
    especificacao VARCHAR(255),
    quantidade_estoque DOUBLE NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL,
    lote VARCHAR(100),
    data_entrada DATE,
    fornecedor VARCHAR(255) NOT NULL,
    certificado_qualidade VARCHAR(255),
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_tipo_material (tipo_material),
    INDEX idx_fornecedor (fornecedor),
    INDEX idx_lote (lote)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: consumiveis (Consumíveis)
CREATE TABLE IF NOT EXISTS consumiveis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) NOT NULL UNIQUE,
    quantidade INT NOT NULL,
    fornecedor VARCHAR(255) NOT NULL,
    local_estoque VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_part_number (part_number),
    INDEX idx_nome (nome),
    INDEX idx_fornecedor (fornecedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: retiradas (Retiradas de Itens)
CREATE TABLE IF NOT EXISTS retiradas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_item VARCHAR(50) NOT NULL,
    item_id BIGINT NOT NULL,
    item_nome VARCHAR(500) NOT NULL,
    quantidade DOUBLE NOT NULL,
    pessoa VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    observacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo_item (tipo_item),
    INDEX idx_item_id (item_id),
    INDEX idx_pessoa (pessoa),
    INDEX idx_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
