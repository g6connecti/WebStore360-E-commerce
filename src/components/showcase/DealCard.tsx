import React, { useState } from 'react';
import { ExternalLink, Star, Copy, Check, Flame, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { DealOffer } from '../../types';
import { formatBRL, platformMeta, categoryLabels } from '../../lib/utils';
import { registerDealClick } from '../../lib/supabase';

interface DealCardProps {
  deal: DealOffer;
  onToggleStatus?: (id: string, newStatus: 'rascunho' | 'publicado') => void;
  showAdminControls?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onToggleStatus,
  showAdminControls = false,
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [imageError, setImageError] = useState(false);

  const platform = platformMeta[deal.platform] || {
    name: deal.platform,
    color: '#A855F7',
    badgeBg: 'bg-purple-500/10',
    textBadge: 'text-purple-400',
    border: 'border-purple-500/30',
  };

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.couponCode) return;
    navigator.clipboard.writeText(deal.couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2200);
  };

  const handleAffiliateClick = () => {
    registerDealClick(deal.id);
    window.open(deal.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative flex flex-col bg-[#17171a] hover:bg-[#1a1a1f] border border-zinc-800/80 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/20 hover:-translate-y-1 w-full flex-shrink-0">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
        {!imageError ? (
          <img
            src={deal.imageUrl}
            alt={deal.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-zinc-950 text-center">
            <span className="text-2xl mb-1">🎁</span>
            <span className="text-xs text-zinc-400 font-medium line-clamp-2">{deal.title}</span>
          </div>
        )}

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#17171a] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges (Discount + Platform) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {/* Discount Tag */}
          <div className="px-2.5 py-1 rounded-lg bg-pink-600 font-extrabold text-white text-xs tracking-wider shadow-md shadow-pink-600/40">
            -{deal.discountPercentage}% OFF
          </div>

          {/* Platform Tag */}
          <div className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border backdrop-blur-sm ${platform.badgeBg} ${platform.textBadge} ${platform.border}`}>
            {platform.name}
          </div>
        </div>

        {/* Flash Deal Ribbon (if applicable) */}
        {deal.isFlashDeal && (
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Relâmpago</span>
            {deal.expiresAt && <span className="text-zinc-400">· {deal.expiresAt}</span>}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        <div>
          {/* Category & Status */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
            <span className="uppercase tracking-wider font-medium text-zinc-400">
              {categoryLabels[deal.category] || deal.category}
            </span>

            {/* Rating */}
            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-xs tabular-nums">{deal.rating.toFixed(1)}</span>
              <span className="text-[10px] text-zinc-400">({deal.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={handleAffiliateClick}
            className="text-sm font-semibold text-zinc-100 hover:text-pink-300 transition-colors line-clamp-2 leading-snug cursor-pointer"
            title={deal.title}
          >
            {deal.title}
          </h3>
        </div>

        {/* Pricing Area */}
        <div className="pt-2 border-t border-zinc-800/60">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-zinc-400 line-through tabular-nums">
              {formatBRL(deal.originalPrice)}
            </span>
            <span className="text-xs font-bold text-pink-400">
              Economize {formatBRL(deal.originalPrice - deal.discountPrice)}
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">
              {formatBRL(deal.discountPrice)}
            </span>
          </div>

          {deal.installments && (
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
              {deal.installments}
            </p>
          )}
        </div>

        {/* Coupon Box (if exists) */}
        {deal.couponCode && (
          <div 
            onClick={handleCopyCoupon}
            className="flex items-center justify-between px-2.5 py-1.5 bg-purple-950/30 border border-dashed border-purple-500/40 rounded-lg text-xs cursor-pointer hover:bg-purple-900/40 transition-colors"
            title="Clique para copiar o cupom"
          >
            <div className="flex items-center gap-1.5 text-purple-300 font-mono font-medium">
              <span>Cupom:</span>
              <span className="font-bold tracking-wider text-pink-300">{deal.couponCode}</span>
            </div>
            <button className="text-[11px] flex items-center gap-1 text-purple-300 hover:text-pink-200">
              {copiedCoupon ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Main CTA Button: Electric Purple to Neon Pink Gradient */}
        <div className="pt-1 flex flex-col gap-2">
          <button
            onClick={handleAffiliateClick}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#EC4899] hover:from-[#6D28D9] hover:via-[#8B5CF6] hover:to-[#DB2777] shadow-lg shadow-purple-900/30 hover:shadow-pink-600/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group/btn"
          >
            <span>Pegar Promoção</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          {/* Admin Control Bar (if in moderation mode) */}
          {showAdminControls && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px]">
              <span className={`flex items-center gap-1 font-semibold ${deal.status === 'publicado' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {deal.status === 'publicado' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {deal.status === 'publicado' ? 'Publicado' : 'Rascunho'}
              </span>

              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(deal.id, deal.status === 'publicado' ? 'rascunho' : 'publicado')}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium transition-colors cursor-pointer"
                >
                  {deal.status === 'publicado' ? 'Mover p/ Rascunho' : 'Publicar Agora'}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
