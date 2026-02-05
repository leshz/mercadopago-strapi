import paymentNotificationService from './payment-notification.service';
import paymentVerificationService from './payment-verification.service';
import stockReductionService from './stock-reduction.service';

export default {
  'payment-notification': paymentNotificationService,
  'payment-verification': paymentVerificationService,
  'stock-reduction': stockReductionService,
};
