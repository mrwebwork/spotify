import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { getURL } from '@/libs/helpers';
import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Validate user and user ID before proceeding
    if (!user || !user.id) {
      return new NextResponse('User not authenticated or invalid user ID', { status: 401 });
    }

    const customer = await createOrRetrieveCustomer({
      uuid: user.id, // No fallback to empty string
      email: user.email || '',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getURL()}account`,
      cancel_url: `${getURL()}`,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.log('Checkout session error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
