/**
 *  controller
 */
/// <reference types="koa" />
import type { Core } from '@strapi/strapi';
declare const _default: ({ strapi, }: {
    strapi: Core.Strapi;
}) => {
    findOne: (ctx: import("koa").Context) => Promise<import("koa").Context>;
} & Core.CoreAPI.Controller.Base;
export default _default;
