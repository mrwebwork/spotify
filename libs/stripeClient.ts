import { loadStripe, Stripe } from '@stripe/stripe-js';

//* Declare variable to store Stripe instance promise.
let stripePromise: Promise<Stripe | null>;

//* Function to retrieve or initialize the Stripe instance
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');
  }

  return stripePromise;
};
