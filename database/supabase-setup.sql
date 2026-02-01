-- ========================================
-- SCRIPT SQL PARA CRIAR TABELAS NO SUPABASE
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- (Dashboard > SQL Editor > New Query)
-- ========================================

-- Tabela de Viaturas
CREATE TABLE IF NOT EXISTS viaturas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    icone VARCHAR(10) DEFAULT '🚒',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(10) DEFAULT '📋',
    ordem INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Materiais
CREATE TABLE IF NOT EXISTS materiais (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES categorias(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    qtd_esperada INT DEFAULT 1,
    tipo VARCHAR(20) DEFAULT 'quantidade', -- 'quantidade', 'check', 'numero'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Checklists (histórico)
CREATE TABLE IF NOT EXISTS checklists (
    id VARCHAR(50) PRIMARY KEY, -- ID único gerado (CHK-xxx-xxx)
    responsavel VARCHAR(200) NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    viaturas_verificadas TEXT,
    total_viaturas INT,
    completo BOOLEAN DEFAULT false,
    hash VARCHAR(64), -- SHA-256 para verificação
    dados_checklist JSONB, -- Dados completos do checklist
    assinatura TEXT, -- Base64 da assinatura
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INSERIR DADOS INICIAIS
-- ========================================

-- Viaturas
INSERT INTO viaturas (codigo, nome, icone) VALUES
    ('ABTS 01', 'Auto Bomba Tanque Salvamento', '🚒'),
    ('ABTS 02', 'Auto Bomba Tanque Salvamento', '🚒'),
    ('UR 01', 'Unidade de Resgate', '🚑'),
    ('ASE 01', 'Auto Salvamento e Escada', '🚒')
ON CONFLICT (codigo) DO NOTHING;

-- Categorias
INSERT INTO categorias (id, nome, icone, ordem) VALUES
    (1, 'Viatura', '🚗', 1),
    (2, 'Material de Sapa', '🔧', 2),
    (3, 'Material Hidráulico', '💧', 3),
    (4, 'EPIs', '🦺', 4)
ON CONFLICT (id) DO NOTHING;

-- Materiais - Viatura (categoria 1)
INSERT INTO materiais (categoria_id, nome, qtd_esperada, tipo) VALUES
    (1, 'Pneus em bom estado', 6, 'check'),
    (1, 'Balão cheio', 1, 'check'),
    (1, 'Faróis funcionando', 4, 'check'),
    (1, 'Sirene funcionando', 1, 'check'),
    (1, 'Nível de óleo OK', 1, 'check'),
    (1, 'Tanque de água (litros)', 6000, 'numero')
ON CONFLICT DO NOTHING;

-- Materiais - Material de Sapa (categoria 2)
INSERT INTO materiais (categoria_id, nome, qtd_esperada, tipo) VALUES
    (2, 'Pás', 4, 'quantidade'),
    (2, 'Enxadas', 2, 'quantidade'),
    (2, 'Picaretas', 2, 'quantidade'),
    (2, 'Machados', 2, 'quantidade'),
    (2, 'Cavadeiras', 2, 'quantidade'),
    (2, 'Foices', 2, 'quantidade')
ON CONFLICT DO NOTHING;

-- Materiais - Material Hidráulico (categoria 3)
INSERT INTO materiais (categoria_id, nome, qtd_esperada, tipo) VALUES
    (3, 'Mangueiras 1.1/2" (15m)', 8, 'quantidade'),
    (3, 'Mangueiras 2.1/2" (15m)', 6, 'quantidade'),
    (3, 'Esguichos reguláveis', 4, 'quantidade'),
    (3, 'Divisores', 2, 'quantidade'),
    (3, 'Redutores', 2, 'quantidade'),
    (3, 'Chaves de mangueira', 4, 'quantidade')
ON CONFLICT DO NOTHING;

-- Materiais - EPIs (categoria 4)
INSERT INTO materiais (categoria_id, nome, qtd_esperada, tipo) VALUES
    (4, 'Capacetes', 6, 'quantidade'),
    (4, 'Capas de aproximação', 6, 'quantidade'),
    (4, 'Botas', 6, 'quantidade'),
    (4, 'Luvas', 6, 'quantidade'),
    (4, 'Lanternas', 4, 'quantidade'),
    (4, 'EPR (Equipamento Proteção Respiratória)', 4, 'quantidade')
ON CONFLICT DO NOTHING;

-- ========================================
-- CONFIGURAR POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Habilitar RLS nas tabelas
ALTER TABLE viaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (viaturas, categorias, materiais)
CREATE POLICY "Permitir leitura pública de viaturas" ON viaturas
    FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de categorias" ON categorias
    FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de materiais" ON materiais
    FOR SELECT USING (true);

-- Políticas para checklists (leitura e inserção pública)
CREATE POLICY "Permitir leitura pública de checklists" ON checklists
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de checklists" ON checklists
    FOR INSERT WITH CHECK (true);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_checklists_data ON checklists(data_hora);
CREATE INDEX IF NOT EXISTS idx_checklists_responsavel ON checklists(responsavel);
CREATE INDEX IF NOT EXISTS idx_materiais_categoria ON materiais(categoria_id);
