import { ProductWithPrice } from '@/types';
import { createClient } from '@/lib/supabase/server';

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
};
