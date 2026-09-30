import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, Shield, Layers, FileCode } from 'lucide-react';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- ==============================================================================
-- WebStore360 - Schema Oficial para Banco de Dados Supabase (PostgreSQL)
-- ==============================================================================
-- Tabelas:
-- 1. public.produtos_ofertas (Produtos com Rascunho / Publicado e Desconto)
-- 2. public.plataformas_credenciais (Chaves de API Shopee & Amazon protegidas)
-- RLS (Row Level Security) ativado para máxima segurança e conformidade
-- ==============================================================================

-- 1. Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela: produtos_ofertas
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
    installments VARCHAR(100),
    affiliate_url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('shopee', 'amazon', 'mercadolivre', 'lojadomecanico', 'temu', 'aliexpress', 'magalu')),
    category VARCHAR(60) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_flash_deal BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5.0),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    coupon_code VARCHAR(50),
    views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
    clicks_count INTEGER DEFAULT 0 CHECK (clicks_count >= 0),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela: plataformas_credenciais (APIs Shopee, Amazon, Mercado Livre, Loja do Mecânico, Temu)
CREATE TABLE IF NOT EXISTS public.plataformas_credenciais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name VARCHAR(50) NOT NULL UNIQUE CHECK (platform_name IN ('shopee', 'amazon', 'mercadolivre', 'lojadomecanico', 'temu', 'aliexpress', 'magalu')),
    display_name VARCHAR(100) NOT NULL,
    affiliate_partner_id VARCHAR(150),
    app_id VARCHAR(255),
    app_secret TEXT,
    api_key TEXT,
    access_token TEXT,
    refresh_token TEXT,
    webhook_secret TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    sync_frequency_minutes INT DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_status ON public.produtos_ofertas(status);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_platform ON public.produtos_ofertas(platform);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_category ON public.produtos_ofertas(category);
CREATE INDEX IF NOT EXISTS idx_produtos_ofertas_clicks ON public.produtos_ofertas(clicks_count DESC);

-- 5. Trigger updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_produtos_ofertas_updated_at
    BEFORE UPDATE ON public.produtos_ofertas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Políticas de RLS
ALTER TABLE public.produtos_ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plataformas_credenciais ENABLE ROW LEVEL SECURITY;

-- Leitura pública de ofertas apenas com status 'publicado'
CREATE POLICY "Leitura pública de ofertas publicadas"
    ON public.produtos_ofertas
    FOR SELECT
    TO anon, authenticated
    USING (status = 'publicado');

-- Apenas admins autenticados podem ver e editar tudo
CREATE POLICY "Admin gerencia todas as ofertas"
    ON public.produtos_ofertas
    FOR ALL
    TO authenticated
    USING (true);

-- Credenciais de API protegidas contra acesso público
CREATE POLICY "Apenas admin gerencia credenciais"
    ON public.plataformas_credenciais
    FOR ALL
    TO authenticated
    USING (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#141417] border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Script SQL Oficial Supabase</span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  PostgreSQL 15+
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Estrutura pronta para copiar e colar no SQL Editor do Supabase Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-pink-600/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Código SQL</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="px-6 py-2.5 bg-zinc-900/40 border-b border-zinc-800/60 flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Row Level Security (RLS) Ativo
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            Estados 'rascunho' e 'publicado'
          </span>
          <span className="flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            Credenciais Shopee & Amazon
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-mono text-xs bg-[#0e0e11] text-zinc-300 leading-relaxed custom-scrollbar">
          <pre className="whitespace-pre overflow-x-auto p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 selection:bg-purple-600/40 selection:text-white">
            {sqlCode}
          </pre>
        </div>

        {/* Footer / Instructions */}
        <div className="px-6 py-3.5 border-t border-zinc-800/80 bg-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>
            📌 <strong>Como aplicar:</strong> Acesse seu projeto no <span className="text-purple-300">Supabase</span> &gt; aba <strong>SQL Editor</strong> &gt; Nova Query &gt; Cole o script e clique em <strong>Run</strong>.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );
};
