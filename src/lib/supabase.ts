import { createClient } from '@supabase/supabase-js';
import { DealOffer, PlatformCredential, OfferStatus } from '../types';
import { initialDeals, initialCredentials } from '../data/mockDeals';

// Environment variables or fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key for fallback persistence
const LOCAL_STORAGE_DEALS_KEY = 'webstore360_deals_db';
const LOCAL_STORAGE_CREDS_KEY = 'webstore360_creds_db';

function getLocalDeals(): DealOffer[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_DEALS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erro ao ler deals do localStorage:', e);
  }
  return initialDeals;
}

function saveLocalDeals(deals: DealOffer[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_DEALS_KEY, JSON.stringify(deals));
  } catch (e) {
    console.error('Erro ao salvar deals no localStorage:', e);
  }
}

export async function getDeals(filter?: {
  status?: OfferStatus | 'all';
  platform?: string;
  category?: string;
  search?: string;
}): Promise<DealOffer[]> {
  // If Supabase is connected, attempt to fetch from Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('produtos_ofertas').select('*');

      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      if (filter?.platform && filter.platform !== 'todos') {
        query = query.eq('platform', filter.platform);
      }
      if (filter?.category && filter.category !== 'todas') {
        query = query.eq('category', filter.category);
      }
      if (filter?.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          description: d.description,
          imageUrl: d.image_url,
          originalPrice: Number(d.original_price),
          discountPrice: Number(d.discount_price),
          discountPercentage: d.discount_percentage,
          installments: d.installments,
          affiliateUrl: d.affiliate_url,
          platform: d.platform,
          category: d.category,
          status: d.status,
          isFeatured: Boolean(d.is_featured),
          isFlashDeal: Boolean(d.is_flash_deal),
          rating: Number(d.rating || 4.8),
          reviewsCount: Number(d.reviews_count || 0),
          couponCode: d.coupon_code,
          viewsCount: Number(d.views_count || 0),
          clicksCount: Number(d.clicks_count || 0),
          expiresAt: d.expires_at,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Falha na query do Supabase, usando armazenamento local sincronizado:', err);
    }
  }

  // Resilient fallback to local storage
  let items = getLocalDeals();

  if (filter?.status && filter.status !== 'all') {
    items = items.filter(i => i.status === filter.status);
  }
  if (filter?.platform && filter.platform !== 'todos') {
    items = items.filter(i => i.platform === filter.platform);
  }
  if (filter?.category && filter.category !== 'todas') {
    items = items.filter(i => i.category === filter.category);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.description.toLowerCase().includes(q) ||
      i.platform.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function toggleOfferStatus(id: string, newStatus: OfferStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('produtos_ofertas')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.error('Erro ao atualizar no Supabase:', e);
    }
  }

  const deals = getLocalDeals();
  const updated = deals.map(d => d.id === id ? { ...d, status: newStatus, updatedAt: new Date().toISOString() } : d);
  saveLocalDeals(updated);
  return true;
}

export async function registerDealClick(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc('increment_offer_click', { offer_id: id });
    } catch (e) {
      // Fallback
    }
  }

  const deals = getLocalDeals();
  const updated = deals.map(d => d.id === id ? { ...d, clicksCount: (d.clicksCount || 0) + 1 } : d);
  saveLocalDeals(updated);
}

export async function getCredentials(): Promise<PlatformCredential[]> {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CREDS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return initialCredentials;
}

export async function saveCredential(cred: PlatformCredential): Promise<void> {
  const current = await getCredentials();
  const index = current.findIndex(c => c.platform === cred.platform);
  let updated: PlatformCredential[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = cred;
  } else {
    updated = [...current, cred];
  }
  localStorage.setItem(LOCAL_STORAGE_CREDS_KEY, JSON.stringify(updated));
}
