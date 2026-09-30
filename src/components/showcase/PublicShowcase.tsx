import React, { useState, useMemo } from 'react';
import { DealOffer, OfferStatus } from '../../types';
import { HeroBanner } from './HeroBanner';
import { DealsCarousel } from './DealsCarousel';
import { DealCard } from './DealCard';
import { categoryLabels } from '../../lib/utils';
import { Sparkles, Layers, SlidersHorizontal, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PublicShowcaseProps {
  deals: DealOffer[];
  currentStatusView: OfferStatus | 'all';
  onToggleStatus: (id: string, newStatus: OfferStatus) => void;
  onOpenSqlModal: () => void;
}

export const PublicShowcase: React.FC<PublicShowcaseProps> = ({
  deals,
  currentStatusView,
  onToggleStatus,
  onOpenSqlModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState<string>('todos');
  const [activeCategory, setActiveCategory] = useState<string>('todas');

  // Filter deals based on current filters
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Status filter
      if (currentStatusView !== 'all' && deal.status !== currentStatusView) {
        return false;
      }
      // Platform filter
      if (activePlatform !== 'todos' && deal.platform !== activePlatform) {
        return false;
      }
      // Category filter
      if (activeCategory !== 'todas' && deal.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = deal.title.toLowerCase().includes(query);
        const matchesDesc = deal.description.toLowerCase().includes(query);
        const matchesPlatform = deal.platform.toLowerCase().includes(query);
        const matchesCategory = (categoryLabels[deal.category] || deal.category).toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesPlatform && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [deals, currentStatusView, activePlatform, activeCategory, searchQuery]);

  // Section collections
  const flashDeals = useMemo(() => {
    return filteredDeals.filter(d => d.isFlashDeal || d.discountPercentage >= 40);
  }, [filteredDeals]);

  const shopeeDeals = useMemo(() => {
    return filteredDeals.filter(d => d.platform === 'shopee');
  }, [filteredDeals]);

  const amazonDeals = useMemo(() => {
    return filteredDeals.filter(d => d.platform === 'amazon');
  }, [filteredDeals]);

  const mercadolivreDeals = useMemo(() => {
    return filteredDeals.filter(d => d.platform === 'mercadolivre');
  }, [filteredDeals]);

  const lojaDoMecanicoDeals = useMemo(() => {
    return filteredDeals.filter(d => d.platform === 'lojadomecanico');
  }, [filteredDeals]);

  const temuDeals = useMemo(() => {
    return filteredDeals.filter(d => d.platform === 'temu');
  }, [filteredDeals]);

  const techAndGamerDeals = useMemo(() => {
    return filteredDeals.filter(d => d.category === 'gamer' || d.category === 'audio_som' || d.category === 'tecnologia');
  }, [filteredDeals]);

  const homeAndAppliancesDeals = useMemo(() => {
    return filteredDeals.filter(d => d.category === 'eletrodomesticos' || d.category === 'casa_inteligente');
  }, [filteredDeals]);

  const resetFilters = () => {
    setSearchQuery('');
    setActivePlatform('todos');
    setActiveCategory('todas');
  };

  const isFiltering = searchQuery.trim() !== '' || activePlatform !== 'todos' || activeCategory !== 'todas';

  return (
    <main className="min-h-screen bg-[#121214] text-slate-100 flex flex-col">
      
      {/* Hero Banner with Instant Search and Platform Selectors */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activePlatform={activePlatform}
        onPlatformSelect={setActivePlatform}
        totalDealsCount={deals.filter(d => d.status === 'publicado').length}
      />

      {/* Category Pills Bar */}
      <div className="border-b border-zinc-800/60 bg-[#141417]/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-zinc-400 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Categorias:</span>
            </span>

            <button
              onClick={() => setActiveCategory('todas')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'todas'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              Todas
            </button>

            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === key
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active status indicator pill */}
          {currentStatusView === 'rascunho' && (
            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-[11px] text-amber-300">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Modo Moderação: Exibindo Rascunhos</span>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Area: Carousels and Deal Grids */}
      <div className="flex-1 max-w-7xl w-full mx-auto pb-16">
        
        {/* If user is performing an active search or strict filtering, show filtered unified grid */}
        {isFiltering ? (
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Resultados da Busca ({filteredDeals.length})
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Exibindo ofertas para: {searchQuery ? `"${searchQuery}"` : 'filtros selecionados'}
                </p>
              </div>

              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Limpar Filtros</span>
              </button>
            </div>

            {filteredDeals.length === 0 ? (
              <div className="py-16 text-center bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="text-lg font-bold text-white mb-1">Nenhuma oferta encontrada</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
                  Tente buscar por termos mais genéricos (ex: fone, teclado, alexa, relógio) ou selecione "Todas as Lojas".
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 cursor-pointer"
                >
                  Restaurar Catálogo Completo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                {filteredDeals.map((deal) => (
                  <div key={deal.id} className="flex">
                    <DealCard
                      deal={deal}
                      onToggleStatus={onToggleStatus}
                      showAdminControls={currentStatusView === 'rascunho'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Normal Showcase View with Horizontal Carousels */
          <div id="destaques">
            
            {/* Carousel 1: Flash Deals & Super Descontos */}
            <div id="ofertas-relampago">
              <DealsCarousel
                title="⚡ Ofertas Relâmpago com Até 70% OFF"
                subtitle="Preços promocionais históricos com cupons ativos por tempo limitado"
                badgeText="🔥 Super Descontos"
                badgeColor="pink"
                deals={flashDeals}
                onToggleStatus={onToggleStatus}
                showAdminControls={currentStatusView === 'rascunho'}
                onViewAll={() => setActiveCategory('todas')}
              />
            </div>

            {/* Carousel 2: Mercado Livre Highlights */}
            {mercadolivreDeals.length > 0 && (
              <div id="mercadolivre-deals">
                <DealsCarousel
                  title="🟡 Destaques Mercado Livre (Envio Full & Líder)"
                  subtitle="Eletrônicos, smartphones e produtos com entrega rápida e garantia"
                  badgeText="Mercado Livre"
                  badgeColor="amber"
                  deals={mercadolivreDeals}
                  onToggleStatus={onToggleStatus}
                  showAdminControls={currentStatusView === 'rascunho'}
                  onViewAll={() => setActivePlatform('mercadolivre')}
                />
              </div>
            )}

            {/* Carousel 3: Loja do Mecânico */}
            {lojaDoMecanicoDeals.length > 0 && (
              <div id="lojadomecanico-deals">
                <DealsCarousel
                  title="🔧 Ferramentas & Equipamentos - Loja do Mecânico"
                  subtitle="Parafusadeiras, kits de chaves e maquinários profissionais com preço de parceiro"
                  badgeText="Loja do Mecânico"
                  badgeColor="orange"
                  deals={lojaDoMecanicoDeals}
                  onToggleStatus={onToggleStatus}
                  showAdminControls={currentStatusView === 'rascunho'}
                  onViewAll={() => setActivePlatform('lojadomecanico')}
                />
              </div>
            )}

            {/* Carousel 4: Temu Highlights */}
            {temuDeals.length > 0 && (
              <div id="temu-deals">
                <DealsCarousel
                  title="🔥 Achadinhos & Tendências Temu"
                  subtitle="Inovações para o dia a dia, compressores digitais e gadgets com descontos de até 75%"
                  badgeText="Temu Brasil"
                  badgeColor="orange"
                  deals={temuDeals}
                  onToggleStatus={onToggleStatus}
                  showAdminControls={currentStatusView === 'rascunho'}
                  onViewAll={() => setActivePlatform('temu')}
                />
              </div>
            )}

            {/* Carousel 5: Shopee Highlights */}
            <div id="shopee-deals">
              <DealsCarousel
                title="🛍️ Achadinhos & Top Ofertas Shopee"
                subtitle="Itens com frete grátis e cupons de loja selecionados para hoje"
                badgeText="Shopee Brasil"
                badgeColor="orange"
                deals={shopeeDeals}
                onToggleStatus={onToggleStatus}
                showAdminControls={currentStatusView === 'rascunho'}
                onViewAll={() => setActivePlatform('shopee')}
              />
            </div>

            {/* Carousel 6: Amazon Prime & Deals */}
            <div id="amazon-deals">
              <DealsCarousel
                title="📦 Melhores Oportunidades Amazon Prime"
                subtitle="Entrega rápida, garantia oficial e parcelamento sem juros"
                badgeText="Amazon Associates"
                badgeColor="amber"
                deals={amazonDeals}
                onToggleStatus={onToggleStatus}
                showAdminControls={currentStatusView === 'rascunho'}
                onViewAll={() => setActivePlatform('amazon')}
              />
            </div>

            {/* Carousel 4: Tech & Gamer Gear */}
            <div id="tech-deals">
              <DealsCarousel
                title="🎧 Setup Gamer, Áudio & Gadgets"
                subtitle="Periféricos de alta performance e tecnologia de ponta"
                badgeText="Gamer & Audio"
                badgeColor="purple"
                deals={techAndGamerDeals}
                onToggleStatus={onToggleStatus}
                showAdminControls={currentStatusView === 'rascunho'}
                onViewAll={() => setActiveCategory('gamer')}
              />
            </div>

            {/* Carousel 5: Home & Smart Appliances */}
            {homeAndAppliancesDeals.length > 0 && (
              <div id="home-deals">
                <DealsCarousel
                  title="🏠 Casa Inteligente & Eletroportáteis"
                  subtitle="Automação residencial, air fryers e cafeteiras com grandes descontos"
                  badgeText="Casa & Cozinha"
                  badgeColor="pink"
                  deals={homeAndAppliancesDeals}
                  onToggleStatus={onToggleStatus}
                  showAdminControls={currentStatusView === 'rascunho'}
                  onViewAll={() => setActiveCategory('casa_inteligente')}
                />
              </div>
            )}

          </div>
        )}

      </div>

    </main>
  );
};
