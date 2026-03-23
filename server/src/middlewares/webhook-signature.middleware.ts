import type { Core } from '@strapi/strapi';
import type { ConfigType } from '../types';
import crypto from 'crypto';

const verifySign = (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const { isActiveVerification = true } = ctx.state.config;

    try {
      if (!isActiveVerification) {
        strapi.log.warn('Webhook signature verification is DISABLED - this is a security risk');
        return next();
      }

      const queryParams = ctx.request.query || {};
      const xSignature = ctx.request.headers['x-signature'] || '';
      const xRequestId = ctx.request.headers['x-request-id'] || '';
      const dataID = queryParams?.['data.id'] || '';

      const {
        config: { webhookPass },
      }: { config: ConfigType } = ctx.state;

      let ts = '';
      let hash = '';

      if (xSignature) {
        const parts = xSignature.split(',');
        parts.forEach((part) => {
          const [key, value] = part.split('=');
          if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'ts') {
              ts = trimmedValue;
            } else if (trimmedKey === 'v1') {
              hash = trimmedValue;
            }
          }
        });
      }

      // Log sanitizado - NO exponer secretos ni hashes
      strapi.log.debug('Webhook verification attempt', {
        hasSignature: !!xSignature,
        hasRequestId: !!xRequestId,
        hasDataId: !!dataID,
        hasTimestamp: !!ts,
        hasHash: !!hash,
      });

      if (ts && hash && dataID && xRequestId) {
        const secret = webhookPass;
        const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(manifest);

        const sha = hmac.digest('hex');

        const shaBuffer = Buffer.from(sha, 'utf8');
        const hashBuffer = Buffer.from(hash, 'utf8');
        const isValid = shaBuffer.length === hashBuffer.length &&
          crypto.timingSafeEqual(shaBuffer, hashBuffer);

        if (isValid) {
          strapi.log.info('Webhook signature verified successfully');
          return next();
        } else {
          strapi.log.warn('Webhook signature verification failed', {
            dataId: dataID,
            requestId: xRequestId,
          });
          return ctx.unauthorized('Invalid signature');
        }
      } else {
        strapi.log.warn('Missing webhook signature parameters', {
          hasTs: !!ts,
          hasHash: !!hash,
          hasDataId: !!dataID,
          hasRequestId: !!xRequestId,
        });
        return ctx.badRequest('Missing signature parameters');
      }
    } catch (error) {
      strapi.log.error('Error in webhook signature verification', {
        error: error.message,
      });
      return ctx.internalServerError('Signature verification error');
    }
  };
};

export { verifySign };
