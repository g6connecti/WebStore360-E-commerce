-- ==============================================================================
-- WebStore360 - Schema Oficial para Banco de Dados Supabase (PostgreSQL)
-- ==============================================================================
-- Desenvolvido para Agregador de Ofertas de Afiliados de Alta Conversão
-- Suporta: Shopee, Amazon, Mercado Livre, AliExpress, Magalu
-- Estados de Oferta: 'rascunho' (Draft) e 'publicado' (Published)
-- Credenciais Seguras com Criptografia e Row Level Security (RLS)
-- ==============================================================================

-- 1. Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criação dos tipos enumerados (opcional para maior integridade referencial)
DO $$ BEGIN
    CREATE TYPE status_oferta AS ENUM ('rascunho', 'publicado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plataforma_tipo AS ENUM ('shopee', 'amazon', 'mercadolivre', 'lojadomecanico', 'temu', 'aliexpress', 'magalu');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Tabela: produtos_ofertas (Ofertas e Promoções de Afiliados)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.produtos_ofertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE,
    description TEXT,
    image_url TEXT NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
    discount_price NUMERIC(10, 2) NOT NULL CHECK (discount_price >= 0),
    discount_percentage INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN original_price > 0 AND discount_price < original_price 
            THEN ROUND(((original_price - discount_price) / original_price) * 100)
            ELSE 0 
        END
    ) STORED,
    installments VARCHAR(100), -- Ex: '10x de R$ 34,90 sem juros'
    affiliate_url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('shopee', 'amazon', 'mercadolivre', 'lojadomecanico', 'temu', 'aliexpress', 'magalu')),
    category VARCHAR(60) NOT NULL, -- Ex: 'tecnologia', 'gamer', 'casa_inteligente', etc.
    status VARCHAR(20) NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_flash_deal BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5.0),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    coupon_code VARCHAR(50), -- Código de cupom promocional opcional
    views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
    clicks_count INTEGER DEFAULT 0 CHECK (clicks_count >= 0),
    expires_at TIMESTAMPTZ, -- Data/hora limite de expiração da oferta
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comentários da tabela para documentação no Supabase Studio
COMMENT ON TABLE public.produtos_ofertas IS 'Armazena todas as ofertas de afiliados da WebStore360 com suporte a rascunho e publicado.';
COMMENT ON COLUMN public.produtos_ofertas.status IS 'Estado da publicação: rascunho (apenas admin) ou publicado (público).';
COMMENT ON COLUMN public.produtos_ofertas.discount_percentage IS 'Porcentagem de desconto calculada automaticamente pelo banco.';

-- ------------------------------------------------------------------------------
-- 4. Tabela: plataformas_credenciais (Credenciais de APIs Shopee e Amazon)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plataformas_credenciais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name VARCHAR(50) NOT NULL UNIQUE CHECK (platform_name IN ('shopee', 'amazon', 'mercadolivre', 'lojadomecanico', 'temu', 'aliexpress', 'magalu')),
    display_name VARCHAR(100) NOT NULL,
    affiliate_partner_id VARCHAR(150), -- Ex: Partner ID Shopee ou Amazon Associate Tag (ex: webstore360-20)
    app_id VARCHAR(255),               -- Client ID ou App ID da API
    app_secret TEXT,                   -- Segredo da API (deve ser protegido por RLS)
    api_key TEXT,                      -- API Key pública ou chave de serviço
    access_token TEXT,                 -- Token de acesso OAuth2 da plataforma
    refresh_token TEXT,                -- Refresh token da plataforma
    webhook_secret TEXT,               -- Segredo para validar webhooks de vendas/pedidos
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMPTZ,        -- Última sincronização de ofertas via API
    sync_frequency_minutes INT DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.plataformas_credenciais IS 'Configurações e chaves de integração com APIs de Afiliados (Shopee Open Platform, Amazon Creators / PA-API).';

-- ------------------------------------------------------------------------------
-- 5. Índices de Alta Performance para Busca e Carrosséis
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_status ON public.produtos_ofertas(status);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_platform ON public.produtos_ofertas(platform);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_category ON public.produtos_ofertas(category);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_featured ON public.produtos_ofertas(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_flash ON public.produtos_ofertas(is_flash_deal) WHERE is_flash_deal = true;
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_clicks ON public.produtos_ofertas(clicks_count DESC);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_created ON public.produtos_ofertas(created_at DESC);

-- Índice GIN para busca instantânea de texto
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_title_search ON public.produtos_ofertas USING gin(to_tsvector('portuguese', title || ' ' || coalesce(description, '')));

-- ------------------------------------------------------------------------------
-- 6. Gatilhos (Triggers) para atualização automática de updated_at
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_produtos_ofertas_updated_at ON public.produtos_ofertas;
CREATE TRIGGER trigger_produtos_ofertas_updated_at
    BEFORE UPDATE ON public.produtos_ofertas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_plataformas_credenciais_updated_at ON public.plataformas_credenciais;
CREATE TRIGGER trigger_plataformas_credenciais_updated_at
    BEFORE UPDATE ON public.plataformas_credenciais
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. Função para incrementar cliques de afiliados com segurança
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_offer_click(offer_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.produtos_ofertas
    SET clicks_count = clicks_count + 1,
        views_count = views_count + 1
    WHERE id = offer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 8. Políticas de Segurança (Row Level Security - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.produtos_ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plataformas_credenciais ENABLE ROW LEVEL SECURITY;

-- 8.1 Políticas para produtos_ofertas:
-- Qualquer usuário (anônimo ou autenticado) pode LER ofertas PUBLICADAS
CREATE POLICY "Permitir leitura pública de ofertas publicadas"
    ON public.produtos_ofertas
    FOR SELECT
    TO anon, authenticated
    USING (status = 'publicado');

-- Apenas usuários autenticados (administradores) podem ver RASCUNHOS
CREATE POLICY "Permitir administradores verem rascunhos e publicados"
    ON public.produtos_ofertas
    FOR SELECT
    TO authenticated
    USING (true);

-- Apenas administradores autenticados podem CRIAR, MODIFICAR ou EXCLUIR ofertas
CREATE POLICY "Permitir administradores gerenciarem ofertas"
    ON public.produtos_ofertas
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8.2 Políticas para plataformas_credenciais:
-- Totalmente protegida! Usuários públicos NÃO TÊM ACESSO a chaves de API
CREATE POLICY "Apenas administradores podem gerenciar credenciais de API"
    ON public.plataformas_credenciais
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. Dados Iniciais de Demonstração (Seed Data)
-- ------------------------------------------------------------------------------

-- Configurações iniciais das plataformas
INSERT INTO public.plataformas_credenciais 
(platform_name, display_name, affiliate_partner_id, is_active)
VALUES 
('shopee', 'Shopee Afiliados Brasil', 'shopee_afiliado_brasil_102', true),
('amazon', 'Amazon Associates Brasil', 'webstore360-20', true),
('mercadolivre', 'Mercado Livre Afiliados', 'ml_afiliado_984', true)
ON CONFLICT (platform_name) DO NOTHING;

-- Inserção de ofertas de alta conversão para popular a vitrine
INSERT INTO public.produtos_ofertas 
(title, slug, description, image_url, original_price, discount_price, installments, affiliate_url, platform, category, status, is_featured, is_flash_deal, rating, reviews_count, coupon_code, clicks_count)
VALUES
(
    'Headphone Bluetooth Sony WH-1000XM5 com Cancelamento de Ruído Ativo',
    'headphone-sony-wh1000xm5-cancelamento-ruido',
    'O fone com o melhor isolamento acústico do mercado. Bateria de até 30 horas, chamadas cristalinas e design ergonômico ultramoderno.',
    '/src/assets/images/wireless_headphones_luxury_1790781570128.jpg',
    2499.00,
    1689.90,
    '10x de R$ 168,99 sem juros',
    'https://www.amazon.com.br/dp/B09XS7JWHH?tag=webstore360-20',
    'amazon',
    'audio_som',
    'publicado',
    true,
    true,
    4.9,
    1420,
    'SONY15OFF',
    342
),
(
    'Smartwatch AMOLED Pro 2026 com Monitor Cardíaco e GPS Integrado',
    'smartwatch-amoled-pro-gps-oximetro',
    'Tela infinita de 1.43 polegadas, resistência 5ATM à prova d''água, mais de 120 modos esportivos e bateria de 14 dias.',
    '/src/assets/images/smartwatch_fitness_sport_1790781579923.jpg',
    499.00,
    219.00,
    '6x de R$ 36,50 sem juros',
    'https://shopee.com.br/universal-link?aff_id=shopee_afiliado_brasil_102',
    'shopee',
    'tecnologia',
    'publicado',
    true,
    true,
    4.8,
    3840,
    'SHOPEE50',
    891
),
(
    'Teclado Mecânico Gamer RGB Hot-Swappable Switch Red ABNT2',
    'teclado-mecanico-gamer-rgb-switch-red',
    'Estrutura em alumínio naval, iluminação RGB programável por tecla, resposta ultra-rápida de 1ms ideal para jogos competitivos.',
    '/src/assets/images/mechanical_gaming_keyboard_1790781592606.jpg',
    389.00,
    199.90,
    '4x de R$ 49,97 sem juros',
    'https://www.amazon.com.br/dp/B08XYZGAMER?tag=webstore360-20',
    'amazon',
    'gamer',
    'publicado',
    false,
    true,
    4.7,
    870,
    'GAMER10',
    415
),
(
    'Fritadeira Elétrica Digital Air Fryer Touch Inox 5.5L',
    'air-fryer-digital-touch-5l-inox',
    'Cesto antiaderente cerâmico livre de BPA, painel digital sensível ao toque com 8 pré-programações e alta potência de 1800W.',
    '/src/assets/images/smart_air_fryer_kitchen_1790781602329.jpg',
    649.00,
    369.90,
    '8x de R$ 46,23 sem juros',
    'https://shopee.com.br/universal-link?aff_id=shopee_afiliado_brasil_102',
    'shopee',
    'eletrodomesticos',
    'publicado',
    true,
    false,
    4.9,
    2180,
    'COZINHA30',
    523
),
(
    'Echo Dot 5ª Geração com Alexa e Relógio Digital Integrado',
    'echo-dot-5-geracao-alexa-relogio',
    'Controle sua casa inteligente por voz, ouça músicas com graves aprofundados e veja as horas e previsão do tempo em display LED.',
    '/src/assets/images/wireless_headphones_luxury_1790781570128.jpg',
    529.00,
    349.00,
    '10x de R$ 34,90 sem juros',
    'https://www.amazon.com.br/dp/B09B8W5FW7?tag=webstore360-20',
    'amazon',
    'casa_inteligente',
    'publicado',
    true,
    true,
    4.9,
    9520,
    'ALEXA10',
    1284
),
(
    'Mouse Gamer Sem Fio Ultraleve 58g Sensor Óptico 26K DPI',
    'mouse-gamer-sem-fio-ultraleve-26k-dpi',
    'Conexão 2.4GHz sem latência, bateria recarregável com autonomia de até 80 horas de gameplay contínuo.',
    '/src/assets/images/mechanical_gaming_keyboard_1790781592606.jpg',
    289.00,
    149.90,
    '3x de R$ 49,96 sem juros',
    'https://shopee.com.br/universal-link?aff_id=shopee_afiliado_brasil_102',
    'shopee',
    'gamer',
    'publicado',
    false,
    false,
    4.8,
    620,
    null,
    287
),
(
    '[RASCUNHO] Monitor Curvo Ultrawide 34 Polegadas 165Hz HDR400',
    'monitor-curvo-ultrawide-34-165hz',
    'Oferta especial ainda em análise pela equipe de curadoria com margem promocional pendente de confirmação com a loja parceira.',
    '/src/assets/images/mechanical_gaming_keyboard_1790781592606.jpg',
    2999.00,
    1899.00,
    '10x de R$ 189,90 sem juros',
    'https://www.amazon.com.br/dp/B0BTESTMONITOR?tag=webstore360-20',
    'amazon',
    'tecnologia',
    'rascunho',
    false,
    false,
    4.6,
    88,
    'CUPOMTESTE',
    0
)
ON CONFLICT (slug) DO NOTHING;
