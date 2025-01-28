import type { Core } from "@strapi/strapi";

import crypto from "crypto";
import { ConfigType } from "../types";


const verifySign = (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const { isActiveVerification = false } = ctx.state.config;
    try {
      if (!isActiveVerification) {
        strapi.log.warn("VERIFICATION SIGN: DEACTIVATED");
        return next();
      }
      const queryParams = ctx.request.query || {};
      const xSignature = ctx.request.headers["x-signature"] || "";
      const xRequestId = ctx.request.headers["x-request-id"] || "";
      const dataID = queryParams?.["data.id"] || "";

      const {
        config: { webhookPass },
      }: { config: ConfigType } = ctx.state;
      let ts = "";
      let hash = "";

      if (xSignature) {
        const parts = xSignature.split(",");
        parts.forEach((part) => {
          const [key, value] = part.split("=");
          if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === "ts") {
              ts = trimmedValue;
            } else if (trimmedKey === "v1") {
              hash = trimmedValue;
            }
          }
        });
      }

      console.debug({ ts, hash, dataID, xRequestId, webhookPass });

      if (ts && hash && dataID && xRequestId) {
        const secret = webhookPass;
        const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(manifest);

        const sha = hmac.digest("hex");
        console.log(sha);
        console.log(hash);

        if (sha === hash) {
          strapi.log.info("Webhook Auth Success");
          return next();
        } else {
          strapi.log.info("Webhook Auth Failed");
          return ctx.serviceUnavailable("Service Unavailable");
        }
      } else {
        strapi.log.warn("Missing required values:");
        if (!ts) strapi.log.warn("ts is missing");
        if (!hash) strapi.log.warn("hash is missing");
        if (!dataID) strapi.log.warn("dataID is missing");
        if (!xRequestId) strapi.log.warn("xRequestId is missing");
        return ctx.internalServerError()
      }
    } catch (error) {
      strapi.log.error("Error Sign Auth Middleware");
      return ctx.serviceUnavailable("Service Unavailable", { details: "Error Sign Auth" });
    }
  };
};

export { verifySign };
