import Stripe from 'stripe';

// initialise stripe
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});
