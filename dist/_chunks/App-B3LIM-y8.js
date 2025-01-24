"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const React = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
const getconfig = require("./getconfig-Di4q5_Oe.js");
const index = require("./index-FI0wCjy8.js");
const getTranslation = (id) => `${index.PLUGIN_ID}.${id}`;
const HomePage = () => {
  const [data, setData] = React.useState({});
  React.useEffect(
    () => {
      getconfig.getConfigRequest().then((response) => {
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
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
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
//# sourceMappingURL=App-B3LIM-y8.js.map
