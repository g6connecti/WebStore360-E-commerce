export type OfferStatus = 'rascunho' | 'publicado';

export type PlatformType = 
  | 'shopee' 
  | 'amazon' 
  | 'mercadolivre' 
  | 'lojadomecanico' 
  | 'temu' 
  | 'aliexpress' 
  | 'magalu';

export type ProductCategory = 
  | 'tecnologia' 
  | 'gamer' 
  | 'casa_inteligente' 
  | 'audio_som' 
  | 'eletrodomesticos' 
  | 'ferramentas_oficina' 
  | 'utilidades' 
  | 'moda_acessorios';

export interface DealOffer {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  installments?: string;
  affiliateUrl: string;
  platform: PlatformType;
  category: ProductCategory;
  status: OfferStatus;
  isFeatured: boolean;
  isFlashDeal: boolean;
  rating: number;
  reviewsCount: number;
  couponCode?: string;
  viewsCount: number;
  clicksCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformCredential {
  id: string;
  platform: PlatformType;
  displayName: string;
  partnerId?: string;
  appId?: string;
  appSecret?: string;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  isActive: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}
