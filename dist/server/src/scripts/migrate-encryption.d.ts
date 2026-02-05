/**
 * Migration script to encrypt existing plain-text secrets in plugin store
 * Run automatically on bootstrap
 */
import type { Core } from '@strapi/strapi';
export declare function migrateConfigEncryption(strapi: Core.Strapi): Promise<void>;
