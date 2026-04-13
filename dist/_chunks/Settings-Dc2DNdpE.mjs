import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Main, Button, Box, Typography, Divider, Grid, Field, Toggle, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import "react-dom/client";
import { Check, Eye, EyeStriked } from "@strapi/icons";
import { b as getConfig, L as Layouts, s as setConfig } from "./index-BSjFQn-a.mjs";
import "react-router-dom";
import "@strapi/icons/symbols";
import "yup";
import "styled-components";
import { g as getTranslation } from "./index-C8UrJ5XS.mjs";
const NotificationsContext = /* @__PURE__ */ React.createContext({
  toggleNotification: () => {
  }
});
/**
* @preserve
* @description Returns an object to interact with the notification
* system. The callbacks are wrapped in `useCallback` for a stable
* identity.
*
* @example
* ```tsx
* import { useNotification } from '@strapi/strapi/admin';
*
* const MyComponent = () => {
*  const { toggleNotification } = useNotification();
*
*  return <button onClick={() => toggleNotification({ message: 'Hello world!' })}>Click me</button>;
*/
const useNotification = () => React.useContext(NotificationsContext);
const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [data, setData] = useState({
    isActive: false,
    mercadoPagoToken: "",
    defaultCurrency: "",
    backUrls: "",
    webhookPass: "",
    notificationUrl: "",
    bussinessDescription: "",
    isActiveVerification: true
  });
  useEffect(() => {
    getConfig().then((res) => {
      setIsLoading(false);
      setData((prev) => ({ ...prev, ...res.data }));
    });
  }, []);
  const validateClient = () => {
    const errors = {};
    if (!data.backUrls?.trim()) {
      errors.backUrls = "La URL de retorno es requerida";
    } else {
      try {
        new URL(data.backUrls);
      } catch {
        errors.backUrls = "Debe ser una URL válida (ej: https://mitienda.com/retorno)";
      }
    }
    if (!data.mercadoPagoToken?.trim()) {
      errors.mercadoPagoToken = "El token de MercadoPago es requerido";
    }
    if (!data.defaultCurrency) {
      errors.defaultCurrency = "Selecciona una moneda";
    }
    if (data.notificationUrl?.trim()) {
      try {
        new URL(data.notificationUrl);
      } catch {
        errors.notificationUrl = "Debe ser una URL válida";
      }
    }
    return errors;
  };
  const handleSubmit = async () => {
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      toggleNotification({ type: "warning", message: "Revisa los campos marcados en rojo" });
      return;
    }
    setIsLoading(true);
    setFieldErrors({});
    try {
      await setConfig(data);
      toggleNotification({ type: "success", message: "Configuración guardada correctamente" });
    } catch (err) {
      const strapiError = err?.response?.data?.error;
      const errors = {};
      if (Array.isArray(strapiError?.details?.errors)) {
        for (const e of strapiError.details.errors) {
          if (e.path) errors[e.path] = e.message;
        }
      }
      setFieldErrors(errors);
      toggleNotification({
        type: "danger",
        title: "Error al guardar",
        message: Object.keys(errors).length ? "Revisa los campos marcados en rojo" : strapiError?.message ?? "Error al guardar la configuración"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        title: formatMessage({ id: getTranslation("setting.header.title") }),
        subtitle: formatMessage({ id: getTranslation("setting.header.subtitle") }),
        primaryAction: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            loading: isLoading,
            onClick: handleSubmit,
            startIcon: /* @__PURE__ */ jsx(Check, {}),
            size: "L",
            children: formatMessage({ id: getTranslation("setting.header.action") })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs(Layouts.Content, { children: [
      /* @__PURE__ */ jsxs(
        Box,
        {
          background: "neutral0",
          shadow: "filterShadow",
          hasRadius: true,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: getTranslation("setting.section.general") }) }),
            /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Divider, {}) }),
            /* @__PURE__ */ jsxs(Grid.Root, { gap: 6, children: [
              /* @__PURE__ */ jsx(Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.isActive.label") }) }),
                /* @__PURE__ */ jsx(
                  Toggle,
                  {
                    onLabel: formatMessage({ id: getTranslation("setting.toggle.on") }),
                    offLabel: formatMessage({ id: getTranslation("setting.toggle.off") }),
                    checked: data.isActive,
                    onChange: () => setData({ ...data, isActive: !data.isActive })
                  }
                ),
                /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({ id: getTranslation("setting.field.isActive.hint") }) })
              ] }) }),
              /* @__PURE__ */ jsx(Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { style: { width: "100%" }, error: fieldErrors.defaultCurrency, children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.currency.label") }) }),
                /* @__PURE__ */ jsxs(
                  SingleSelect,
                  {
                    value: data.defaultCurrency,
                    onChange: (value) => setData({ ...data, defaultCurrency: value }),
                    error: fieldErrors.defaultCurrency,
                    children: [
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "ARS", children: "ARS - Peso argentino" }),
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "BRL", children: "BRL - Real brasileño" }),
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "CLP", children: "CLP - Peso chileno" }),
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "MXN", children: "MXN - Peso mexicano" }),
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "COP", children: "COP - Peso colombiano" }),
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "PEN", children: "PEN - Sol peruano" }),
                      /* @__PURE__ */ jsx(SingleSelectOption, { value: "UYU", children: "UYU - Peso uruguayo" })
                    ]
                  }
                ),
                fieldErrors.defaultCurrency && /* @__PURE__ */ jsx(Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsx(Grid.Item, { col: 12, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { style: { width: "100%" }, error: fieldErrors.bussinessDescription, children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.description.label") }) }),
                /* @__PURE__ */ jsx(
                  Field.Input,
                  {
                    name: "bussinessDescription",
                    type: "text",
                    value: data.bussinessDescription,
                    onChange: (ev) => setData({ ...data, bussinessDescription: ev.target.value })
                  }
                ),
                /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({ id: getTranslation("setting.field.description.hint") }) }),
                fieldErrors.bussinessDescription && /* @__PURE__ */ jsx(Field.Error, {})
              ] }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Box,
        {
          background: "neutral0",
          shadow: "filterShadow",
          hasRadius: true,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          marginTop: 6,
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: getTranslation("setting.section.credentials") }) }),
            /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Divider, {}) }),
            /* @__PURE__ */ jsx(Grid.Root, { gap: 6, children: /* @__PURE__ */ jsx(Grid.Item, { col: 12, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { style: { width: "100%" }, error: fieldErrors.mercadoPagoToken, children: [
              /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.token.label") }) }),
              /* @__PURE__ */ jsx(
                Field.Input,
                {
                  name: "mercadoPagoToken",
                  type: showToken ? "text" : "password",
                  value: data.mercadoPagoToken,
                  onChange: (ev) => setData({ ...data, mercadoPagoToken: ev.target.value }),
                  endAction: showToken ? /* @__PURE__ */ jsx(Eye, { onClick: () => setShowToken(false) }) : /* @__PURE__ */ jsx(EyeStriked, { onClick: () => setShowToken(true) })
                }
              ),
              /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({ id: getTranslation("setting.field.token.hint") }) }),
              fieldErrors.mercadoPagoToken && /* @__PURE__ */ jsx(Field.Error, {})
            ] }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Box,
        {
          background: "neutral0",
          shadow: "filterShadow",
          hasRadius: true,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          marginTop: 6,
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: getTranslation("setting.section.urls") }) }),
            /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Divider, {}) }),
            /* @__PURE__ */ jsxs(Grid.Root, { gap: 6, children: [
              /* @__PURE__ */ jsx(Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { style: { width: "100%" }, error: fieldErrors.backUrls, children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.backUrls.label") }) }),
                /* @__PURE__ */ jsx(
                  Field.Input,
                  {
                    name: "backUrls",
                    type: "text",
                    value: data.backUrls,
                    onChange: (ev) => setData({ ...data, backUrls: ev.target.value })
                  }
                ),
                /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({ id: getTranslation("setting.field.backUrls.hint") }) }),
                fieldErrors.backUrls && /* @__PURE__ */ jsx(Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsx(Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { style: { width: "100%" }, error: fieldErrors.notificationUrl, children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.notificationUrl.label") }) }),
                /* @__PURE__ */ jsx(
                  Field.Input,
                  {
                    name: "notificationUrl",
                    type: "text",
                    value: data.notificationUrl,
                    onChange: (ev) => setData({ ...data, notificationUrl: ev.target.value })
                  }
                ),
                /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({ id: getTranslation("setting.field.notificationUrl.hint") }) }),
                fieldErrors.notificationUrl && /* @__PURE__ */ jsx(Field.Error, {})
              ] }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Box,
        {
          background: "neutral0",
          shadow: "filterShadow",
          hasRadius: true,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          marginTop: 6,
          marginBottom: 6,
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: getTranslation("setting.section.webhook") }) }),
            /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Divider, {}) }),
            /* @__PURE__ */ jsxs(Grid.Root, { gap: 6, children: [
              /* @__PURE__ */ jsx(Grid.Item, { col: 8, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { style: { width: "100%" }, error: fieldErrors.webhookPass, children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({ id: getTranslation("setting.field.webhookPass.label") }) }),
                /* @__PURE__ */ jsx(
                  Field.Input,
                  {
                    name: "webhookPass",
                    type: showWebhookSecret ? "text" : "password",
                    value: data.webhookPass,
                    onChange: (ev) => setData({ ...data, webhookPass: ev.target.value }),
                    endAction: showWebhookSecret ? /* @__PURE__ */ jsx(Eye, { onClick: () => setShowWebhookSecret(false) }) : /* @__PURE__ */ jsx(EyeStriked, { onClick: () => setShowWebhookSecret(true) })
                  }
                ),
                /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({ id: getTranslation("setting.field.webhookPass.hint") }) }),
                fieldErrors.webhookPass && /* @__PURE__ */ jsx(Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsx(Grid.Item, { col: 4, s: 12, children: /* @__PURE__ */ jsxs(Field.Root, { children: [
                /* @__PURE__ */ jsx(Field.Label, { children: formatMessage({
                  id: getTranslation("setting.field.isActiveVerification.label")
                }) }),
                /* @__PURE__ */ jsx(
                  Toggle,
                  {
                    onLabel: formatMessage({ id: getTranslation("setting.toggle.on") }),
                    offLabel: formatMessage({ id: getTranslation("setting.toggle.off") }),
                    checked: data.isActiveVerification,
                    onChange: () => setData({ ...data, isActiveVerification: !data.isActiveVerification })
                  }
                ),
                /* @__PURE__ */ jsx(Field.Hint, { children: formatMessage({
                  id: getTranslation("setting.field.isActiveVerification.hint")
                }) })
              ] }) })
            ] })
          ]
        }
      )
    ] })
  ] });
};
export {
  SettingsPage
};
