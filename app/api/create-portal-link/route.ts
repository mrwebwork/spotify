import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { getURL } from '@/libs/helpers';
import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';
import { log } from '@/libs/logger';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    // Enhanced validation before passing to createOrRetrieveCustomer
    if (!user.id) throw new Error('User ID is required');

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user?.email || '',
    });

    if (!customer) throw new Error('Customer not found');

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    log.error('Customer portal error', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
