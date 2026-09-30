import React from 'react';
import { Search, Flame, ShieldCheck, Zap, X, ShoppingCart } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activePlatform: string;
  onPlatformSelect: (platform: string) => void;
  totalDealsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  activePlatform,
  onPlatformSelect,
  totalDealsCount,
}) => {
  return (
    <section className="relative pt-8 pb-10 overflow-hidden border-b border-zinc-800/60 bg-gradient-to-b from-[#18181c] via-[#141416] to-[#121214]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-[350px] h-[200px] bg-pink-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-purple-500/30 text-xs text-zinc-300 shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              WebStore360 Hub
            </span>
            <span className="text-zinc-500">·</span>
            <span>{totalDealsCount} ofertas ativas monitoradas hoje</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            As Melhores Ofertas de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#EC4899]">
              Grandes Lojas
            </span>{' '}
            em um Só Lugar
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 text-balance max-w-2xl mx-auto">
            Ofertas verificadas e cupons de Mercado Livre, Loja do Mecânico, Temu, Shopee e Amazon com links diretos oficiais.
          </p>
        </div>

        {/* Instant Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-focus-within:opacity-75 transition duration-300"></div>
            <div className="relative flex items-center bg-[#18181c] border border-zinc-700/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="pl-4 pr-2 text-zinc-400 flex items-center justify-center">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Busque por parafusadeira, celular, compressor, fone, air fryer..."
                className="w-full py-3.5 pr-10 bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="pr-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-zinc-400 text-xs mr-1 hidden sm:inline">Filtrar Loja:</span>
          
          <button
            onClick={() => onPlatformSelect('todos')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === 'todos'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-md shadow-purple-600/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            🔥 Todas as Lojas
          </button>

          <button
            onClick={() => onPlatformSelect('mercadolivre')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'mercadolivre'
                ? 'bg-yellow-400 border-yellow-400 text-zinc-950 font-semibold shadow-md shadow-yellow-400/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-yellow-300 hover:border-yellow-400/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            Mercado Livre
          </button>

          <button
            onClick={() => onPlatformSelect('lojadomecanico')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'lojadomecanico'
                ? 'bg-[#FF5A00] border-[#FF5A00] text-white font-semibold shadow-md shadow-orange-600/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-[#FF5A00] hover:border-[#FF5A00]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span>
            Loja do Mecânico
          </button>

          <button
            onClick={() => onPlatformSelect('temu')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'temu'
                ? 'bg-[#FB7701] border-[#FB7701] text-white font-semibold shadow-md shadow-orange-500/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-[#FB7701] hover:border-[#FB7701]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FB7701]"></span>
            Temu
          </button>

          <button
            onClick={() => onPlatformSelect('shopee')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'shopee'
                ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white shadow-md shadow-orange-500/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-orange-400 hover:border-[#EE4D2D]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EE4D2D]"></span>
            Shopee
          </button>

          <button
            onClick={() => onPlatformSelect('amazon')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activePlatform === 'amazon'
                ? 'bg-[#FF9900] border-[#FF9900] text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-[#FF9900]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF9900]"></span>
            Amazon
          </button>
        </div>

        {/* Benefits bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/40 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Links Verificados e Oficiais</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Cupons com Desconto Instantâneo</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 text-xs text-zinc-400">
            <ShoppingCart className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Redirecionamento Seguro</span>
          </div>
        </div>

      </div>
    </section>
  );
};
