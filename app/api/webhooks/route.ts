import Stripe from 'stripe';
import he from 'he';

import { NextResponse } from 'next/server';

import { headers } from 'next/headers';

import { stripe } from '@/libs/stripe';
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from '@/libs/supabaseAdmin';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('Stripe-Signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    // Validate webhook signature to ensure request authenticity
    if (!sig || !webhookSecret) {
      return new NextResponse('Missing signature or webhook secret', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    // Sanitize error message to prevent information disclosure
    const sanitizedMessage = he.encode(error.message || 'Unknown error');
    return new NextResponse(`Webhook Error: ${sanitizedMessage}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // Validate subscription data before processing to prevent security issues
          const subscription = event.data.object as Stripe.Subscription;
          if (!subscription.id || !subscription.customer) {
            throw new Error('Missing subscription ID or customer ID in webhook event');
          }
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer.toString(),
            event.type === 'customer.subscription.created'
          );
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            const customerId = checkoutSession.customer;

            // Validate subscription and customer IDs before proceeding
            if (
              !subscriptionId ||
              subscriptionId === 'undefined' ||
              !customerId ||
              customerId === 'undefined'
            ) {
              throw new Error('Missing subscription ID or customer ID in checkout session');
            }

            await manageSubscriptionStatusChange(
              subscriptionId as string,
              customerId as string,
              true
            );
          }
          break;
        default:
          throw new Error('Unhandled relevant event');
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      // Don't expose internal error details to prevent information disclosure
      return new NextResponse('Webhook processing failed', { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
