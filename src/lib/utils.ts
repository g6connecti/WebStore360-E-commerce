export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

export function calculateDiscount(original: number, current: number): number {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
}

export const platformMeta: Record<
  string,
  { name: string; color: string; badgeBg: string; textBadge: string; border: string }
> = {
  shopee: {
    name: 'Shopee',
    color: '#EE4D2D',
    badgeBg: 'bg-[#EE4D2D]/10',
    textBadge: 'text-[#EE4D2D]',
    border: 'border-[#EE4D2D]/30',
  },
  amazon: {
    name: 'Amazon',
    color: '#FF9900',
    badgeBg: 'bg-[#FF9900]/10',
    textBadge: 'text-[#FF9900]',
    border: 'border-[#FF9900]/30',
  },
  mercadolivre: {
    name: 'Mercado Livre',
    color: '#FFE600',
    badgeBg: 'bg-yellow-400/10',
    textBadge: 'text-yellow-400',
    border: 'border-yellow-400/30',
  },
  lojadomecanico: {
    name: 'Loja do Mecânico',
    color: '#FF5A00',
    badgeBg: 'bg-[#FF5A00]/10',
    textBadge: 'text-[#FF5A00]',
    border: 'border-[#FF5A00]/30',
  },
  temu: {
    name: 'Temu',
    color: '#FB7701',
    badgeBg: 'bg-[#FB7701]/10',
    textBadge: 'text-[#FB7701]',
    border: 'border-[#FB7701]/30',
  },
  aliexpress: {
    name: 'AliExpress',
    color: '#FF4747',
    badgeBg: 'bg-red-500/10',
    textBadge: 'text-red-400',
    border: 'border-red-500/30',
  },
  magalu: {
    name: 'Magalu',
    color: '#0086FF',
    badgeBg: 'bg-blue-500/10',
    textBadge: 'text-blue-400',
    border: 'border-blue-500/30',
  },
};

export const categoryLabels: Record<string, string> = {
  tecnologia: 'Tecnologia & Gadgets',
  gamer: 'Setup Gamer & Jogos',
  casa_inteligente: 'Casa Inteligente',
  audio_som: 'Áudio & Som Premium',
  eletrodomesticos: 'Eletroportáteis',
  ferramentas_oficina: 'Ferramentas & Oficina',
  utilidades: 'Utilidades & Inovações',
  moda_acessorios: 'Moda & Wearables',
};
