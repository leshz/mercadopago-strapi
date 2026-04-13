"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
require("react-dom/client");
const icons = require("@strapi/icons");
const index = require("./index-Cdpa_RqF.js");
require("react-router-dom");
require("@strapi/icons/symbols");
require("yup");
require("styled-components");
const index$1 = require("./index-lVwVgdyK.js");
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const NotificationsContext = /* @__PURE__ */ React__namespace.createContext({
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
const useNotification = () => React__namespace.useContext(NotificationsContext);
const SettingsPage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { toggleNotification } = useNotification();
  const [isLoading, setIsLoading] = React.useState(true);
  const [showToken, setShowToken] = React.useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [data, setData] = React.useState({
    isActive: false,
    mercadoPagoToken: "",
    defaultCurrency: "",
    backUrls: "",
    webhookPass: "",
    notificationUrl: "",
    bussinessDescription: "",
    isActiveVerification: true
  });
  React.useEffect(() => {
    index.getConfig().then((res) => {
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
      await index.setConfig(data);
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
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      index.Layouts.Header,
      {
        title: formatMessage({ id: index$1.getTranslation("setting.header.title") }),
        subtitle: formatMessage({ id: index$1.getTranslation("setting.header.subtitle") }),
        primaryAction: /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            type: "submit",
            loading: isLoading,
            onClick: handleSubmit,
            startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Check, {}),
            size: "L",
            children: formatMessage({ id: index$1.getTranslation("setting.header.action") })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(index.Layouts.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Box,
        {
          background: "neutral0",
          shadow: "filterShadow",
          hasRadius: true,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 7,
          paddingRight: 7,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: index$1.getTranslation("setting.section.general") }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}) }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 6, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.isActive.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Toggle,
                  {
                    onLabel: formatMessage({ id: index$1.getTranslation("setting.toggle.on") }),
                    offLabel: formatMessage({ id: index$1.getTranslation("setting.toggle.off") }),
                    checked: data.isActive,
                    onChange: () => setData({ ...data, isActive: !data.isActive })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.isActive.hint") }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, error: fieldErrors.defaultCurrency, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.currency.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsxs(
                  designSystem.SingleSelect,
                  {
                    value: data.defaultCurrency,
                    onChange: (value) => setData({ ...data, defaultCurrency: value }),
                    error: fieldErrors.defaultCurrency,
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "ARS", children: "ARS - Peso argentino" }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "BRL", children: "BRL - Real brasileño" }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "CLP", children: "CLP - Peso chileno" }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "MXN", children: "MXN - Peso mexicano" }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "COP", children: "COP - Peso colombiano" }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "PEN", children: "PEN - Sol peruano" }),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "UYU", children: "UYU - Peso uruguayo" })
                    ]
                  }
                ),
                fieldErrors.defaultCurrency && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 12, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, error: fieldErrors.bussinessDescription, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.description.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Field.Input,
                  {
                    name: "bussinessDescription",
                    type: "text",
                    value: data.bussinessDescription,
                    onChange: (ev) => setData({ ...data, bussinessDescription: ev.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.description.hint") }) }),
                fieldErrors.bussinessDescription && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
              ] }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Box,
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: index$1.getTranslation("setting.section.credentials") }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 6, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 12, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, error: fieldErrors.mercadoPagoToken, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.token.label") }) }),
              /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.Field.Input,
                {
                  name: "mercadoPagoToken",
                  type: showToken ? "text" : "password",
                  value: data.mercadoPagoToken,
                  onChange: (ev) => setData({ ...data, mercadoPagoToken: ev.target.value }),
                  endAction: showToken ? /* @__PURE__ */ jsxRuntime.jsx(icons.Eye, { onClick: () => setShowToken(false) }) : /* @__PURE__ */ jsxRuntime.jsx(icons.EyeStriked, { onClick: () => setShowToken(true) })
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.token.hint") }) }),
              fieldErrors.mercadoPagoToken && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
            ] }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Box,
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: index$1.getTranslation("setting.section.urls") }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}) }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 6, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, error: fieldErrors.backUrls, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.backUrls.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Field.Input,
                  {
                    name: "backUrls",
                    type: "text",
                    value: data.backUrls,
                    onChange: (ev) => setData({ ...data, backUrls: ev.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.backUrls.hint") }) }),
                fieldErrors.backUrls && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, error: fieldErrors.notificationUrl, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.notificationUrl.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Field.Input,
                  {
                    name: "notificationUrl",
                    type: "text",
                    value: data.notificationUrl,
                    onChange: (ev) => setData({ ...data, notificationUrl: ev.target.value })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.notificationUrl.hint") }) }),
                fieldErrors.notificationUrl && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
              ] }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Box,
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: index$1.getTranslation("setting.section.webhook") }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}) }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 6, children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 8, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, error: fieldErrors.webhookPass, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.webhookPass.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Field.Input,
                  {
                    name: "webhookPass",
                    type: showWebhookSecret ? "text" : "password",
                    value: data.webhookPass,
                    onChange: (ev) => setData({ ...data, webhookPass: ev.target.value }),
                    endAction: showWebhookSecret ? /* @__PURE__ */ jsxRuntime.jsx(icons.Eye, { onClick: () => setShowWebhookSecret(false) }) : /* @__PURE__ */ jsxRuntime.jsx(icons.EyeStriked, { onClick: () => setShowWebhookSecret(true) })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.webhookPass.hint") }) }),
                fieldErrors.webhookPass && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({
                  id: index$1.getTranslation("setting.field.isActiveVerification.label")
                }) }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Toggle,
                  {
                    onLabel: formatMessage({ id: index$1.getTranslation("setting.toggle.on") }),
                    offLabel: formatMessage({ id: index$1.getTranslation("setting.toggle.off") }),
                    checked: data.isActiveVerification,
                    onChange: () => setData({ ...data, isActiveVerification: !data.isActiveVerification })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({
                  id: index$1.getTranslation("setting.field.isActiveVerification.hint")
                }) })
              ] }) })
            ] })
          ]
        }
      )
    ] })
  ] });
};
exports.SettingsPage = SettingsPage;
//# sourceMappingURL=Settings-CbSYV-Fs.js.map
