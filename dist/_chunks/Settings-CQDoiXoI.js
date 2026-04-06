"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
require("react-dom/client");
const icons = require("@strapi/icons");
const index = require("./index-DSBznOnD.js");
require("react-router-dom");
require("@strapi/icons/symbols");
require("yup");
const index$1 = require("./index-C-ZpclRf.js");
const SettingsPage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const [isLoading, setIsLoading] = React.useState(true);
  const [showToken, setShowToken] = React.useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = React.useState(false);
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
  const handleSubmit = () => {
    setIsLoading(true);
    index.setConfig(data).then(() => {
      setIsLoading(false);
    });
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { children: formatMessage({ id: index$1.getTranslation("setting.field.currency.label") }) }),
                /* @__PURE__ */ jsxRuntime.jsxs(
                  designSystem.SingleSelect,
                  {
                    value: data.defaultCurrency,
                    onChange: (value) => setData({ ...data, defaultCurrency: value }),
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
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 12, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, children: [
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
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.description.hint") }) })
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Root, { gap: 6, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 12, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, children: [
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.token.hint") }) })
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, children: [
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
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.backUrls.hint") }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 6, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, children: [
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
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.notificationUrl.hint") }) })
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
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 8, s: 12, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Field.Root, { style: { width: "100%" }, children: [
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
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, { children: formatMessage({ id: index$1.getTranslation("setting.field.webhookPass.hint") }) })
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
