import { ProductWithPrice } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { log } from '@/libs/logger';

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    log.error('Failed to fetch active products with prices', error);
  }

  return (data as any) || [];
};
