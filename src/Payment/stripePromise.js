// stripePromise.js
import { loadStripe } from '@stripe/stripe-js';

// Use environment variable correctly
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Log for debugging (remove in production)
if (!stripePublishableKey) {
  console.error('Stripe publishable key is missing!');
}

export const stripePromise = loadStripe(stripePublishableKey);