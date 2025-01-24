"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const react = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
const getTranslation = require("./getTranslation-AfMkdgE3.js");
const HomePage = () => {
  const [data, setData] = react.useState({});
  react.useEffect(
    () => {
      getTranslation.getConfigRequest().then((response) => {
        setData(response);
      });
    },
    []
  );
  const { formatMessage } = reactIntl.useIntl();
  console.log(data);
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.DesignSystemProvider, { theme: designSystem.darkTheme, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Main, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: {
    initial: 1,
    medium: 4,
    large: 8
  }, direction: {
    initial: "column",
    medium: "row"
  }, alignItems: {
    initial: "center",
    medium: "flex-start"
  }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation.getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation.getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation.getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation.getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation.getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation.getTranslation("plugin.name") })
    ] })
  ] }) }) });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] });
};
exports.App = App;
//# sourceMappingURL=App-HD-5piSw.js.map
