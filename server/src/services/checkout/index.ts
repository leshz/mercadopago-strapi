import checkoutService from './checkout.service';
import preferenceService from './preference.service';
import orderCreationService from './order-creation.service';

export default {
  checkout: checkoutService,
  preference: preferenceService,
  'order-creation': orderCreationService,
};
