import config from './config';

const { Stripe } = window;
Stripe.setPublishableKey(config.publishableKey);
export default Stripe;
