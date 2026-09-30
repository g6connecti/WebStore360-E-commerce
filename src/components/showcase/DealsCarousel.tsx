import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Users, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { DealOffer } from '../../types';
import { DealCard } from './DealCard';

interface DealsCarouselProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: 'pink' | 'orange' | 'amber' | 'purple';
  deals: DealOffer[];
  onToggleStatus?: (id: string, newStatus: 'rascunho' | 'publicado') => void;
  showAdminControls?: boolean;
  onViewAll?: () => void;
}

export const DealsCarousel: React.FC<DealsCarouselProps> = ({
  title,
  subtitle,
  badgeText,
  badgeColor = 'pink',
  deals,
  onToggleStatus,
  showAdminControls = false,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Live timer for pulsating countdown card at the end of each section
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });
  const [activeViewers, setActiveViewers] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);

    const viewerInterval = setInterval(() => {
      setActiveViewers(prev => Math.max(16, Math.min(48, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(viewerInterval);
    };
  }, []);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [deals]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 280; // Approximate card scroll step
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  const badgeStyles = {
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }[badgeColor];

  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 border-b border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {badgeText && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles}`}>
                  {badgeText}
                </span>
              )}
              <span className="text-xs text-zinc-400">
                {deals.length} itens disponíveis
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Controls: Left & Right Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-xl border border-zinc-800 transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                  : 'bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed'
              }`}
              title="Rolar para esquerda"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-xl border border-zinc-800 transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                  : 'bg-zinc-900/40 text-zinc-600 border-zinc-900 cursor-not-allowed'
              }`}
              title="Rolar para direita"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Container: Supports up to 6 cards visible on large displays */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
        >
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="snap-start w-[240px] sm:w-[260px] md:w-[270px] lg:w-[280px] xl:w-[260px] 2xl:w-[250px] shrink-0 flex"
            >
              <DealCard
                deal={deal}
                onToggleStatus={onToggleStatus}
                showAdminControls={showAdminControls}
              />
            </div>
          ))}

          {/* Pulsating Deal Counter & Explore More Card at the end of the carousel */}
          <div className="snap-start w-[260px] sm:w-[280px] shrink-0 flex">
            <div className="w-full flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-[#1c1326] via-[#16121f] to-[#121214] border-2 border-pink-500/40 hover:border-pink-500/80 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-pink-950/30 animate-pulse-glow">
              
              {/* Background ambient gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-2xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-2xl rounded-full pointer-events-none" />

              <div>
                {/* Top Pulsing Indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    Oferta Expira em Breve
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  Lote Promocional com Últimas Unidades
                </h3>

                <p className="text-xs text-zinc-400 mb-4">
                  Os estoques de cupons desta seleção estão sendo esgotados nas plataformas parceiras.
                </p>

                {/* Countdown Display */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tempo Restante da Promoção:</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono font-bold text-lg text-white tabular-nums">
                    <div className="bg-zinc-800 px-2 py-0.5 rounded text-pink-300">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </div>
                    <span>:</span>
                    <div className="bg-zinc-800 px-2 py-0.5 rounded text-pink-300">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </div>
                    <span>:</span>
                    <div className="bg-zinc-800 px-2 py-0.5 rounded text-pink-300">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </div>
                  </div>
                </div>

                {/* Live Viewers Indicator */}
                <div className="flex items-center gap-2 text-xs text-zinc-300 mb-4 bg-purple-950/40 border border-purple-800/40 px-3 py-2 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>
                    <strong className="text-white font-bold tabular-nums">{activeViewers} pessoas</strong> explorando esta seção agora
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onViewAll}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-pink-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:scale-[1.02]"
              >
                <span>Ver Todas as Ofertas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
