import React from 'react';
import { Sparkles, Database, KeyRound, Eye, ShieldAlert, ShoppingBag } from 'lucide-react';
import { OfferStatus } from '../../types';

interface NavbarProps {
  currentStatusView: OfferStatus | 'all';
  onStatusChange: (status: OfferStatus | 'all') => void;
  draftsCount: number;
  publishedCount: number;
  onOpenSqlModal: () => void;
  onOpenCredsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStatusView,
  onStatusChange,
  draftsCount,
  publishedCount,
  onOpenSqlModal,
  onOpenCredsModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#121214]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark (Clean single-element) */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-pink-500/30 transition-shadow">
              <div className="w-full h-full bg-[#121214] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-pink-300 transition-colors">
              WebStore<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">360</span>
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Clean text) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-zinc-300">
          <a href="#destaques" className="hover:text-white transition-colors">
            🔥 Em Alta
          </a>
          <a href="#mercadolivre-deals" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            Mercado Livre
          </a>
          <a href="#lojadomecanico-deals" className="hover:text-[#FF5A00] transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span>
            Loja do Mecânico
          </a>
          <a href="#temu-deals" className="hover:text-[#FB7701] transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FB7701]"></span>
            Temu
          </a>
          <a href="#shopee-deals" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EE4D2D]"></span>
            Shopee
          </a>
          <a href="#amazon-deals" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF9900]"></span>
            Amazon
          </a>
          <button
            onClick={onOpenSqlModal}
            className="hover:text-purple-300 transition-colors flex items-center gap-1 text-zinc-400 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Script SQL</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Filter Status & Modals) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status View Selector (Publicado vs Rascunho) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => onStatusChange('publicado')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                currentStatusView === 'publicado'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Exibir apenas ofertas ativas para o público"
            >
              Publicados ({publishedCount})
            </button>
            <button
              onClick={() => onStatusChange('rascunho')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentStatusView === 'rascunho'
                  ? 'bg-amber-950/70 border border-amber-600/50 text-amber-300'
                  : 'text-zinc-400 hover:text-amber-300'
              }`}
              title="Visualizar ofertas em moderação/rascunho"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Rascunhos ({draftsCount})</span>
            </button>
          </div>

          {/* API Credentials Button */}
          <button
            onClick={onOpenCredsModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Credenciais de APIs Shopee e Amazon"
          >
            <KeyRound className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">APIs Shopee / Amazon</span>
          </button>
        </div>

      </div>
    </header>
  );
};
