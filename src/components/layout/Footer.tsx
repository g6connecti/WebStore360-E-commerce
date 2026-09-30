import React from 'react';
import { Sparkles, Shield, Database, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSqlModal: () => void;
  onOpenCredsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSqlModal, onOpenCredsModal }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#0f0f12] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#121214] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                </div>
              </div>
              <span className="text-base font-bold font-display text-white">
                WebStore<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">360</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              O WebStore360 é um agregador inteligente de ofertas e cupons de afiliados. Monitoramos 24 horas por dia os maiores e-commerces do Brasil (Shopee, Amazon e Mercado Livre) para trazer os menores preços verificados.
            </p>
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transparência total: Compras 100% finalizadas nos sites oficiais parceiros.</span>
            </div>
          </div>

          {/* Integration Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Arquitetura & Supabase
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenSqlModal}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Script SQL das Tabelas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCredsModal}
                  className="hover:text-pink-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Credenciais de APIs</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-500">PostgreSQL + RLS Security</span>
              </li>
              <li>
                <span className="text-zinc-500">Suporte a Rascunho / Publicado</span>
              </li>
            </ul>
          </div>

          {/* Legal / Affiliate Disclaimer */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Aviso de Afiliados
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Como participante dos Programas de Afiliados da Amazon e Shopee Brasil, o WebStore360 pode receber comissões por compras qualificadas, sem nenhum custo adicional para você. Preços e disponibilidade sujeitos a alterações pelo vendedor.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} WebStore360. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSqlModal} className="hover:text-zinc-300 transition-colors cursor-pointer">
              Supabase SQL
            </button>
            <span>·</span>
            <a href="#destaques" className="hover:text-zinc-300 transition-colors">
              Voltar ao topo ↑
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
