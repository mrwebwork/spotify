import Stripe from 'stripe';

//* Initialize Stripe instance with secret key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'Spotify Clone Application',
    version: '0.1.0',
  },
});
