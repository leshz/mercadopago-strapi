import { jsx, jsxs } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { DesignSystemProvider, darkTheme, Main, Flex } from "@strapi/design-system";
import { g as getConfigRequest } from "./getconfig-BIJM0uHM.mjs";
import { P as PLUGIN_ID } from "./index-vgerK3Xk.mjs";
const getTranslation = (id) => `${PLUGIN_ID}.${id}`;
const HomePage = () => {
  const [data, setData] = useState({});
  useEffect(
    () => {
      getConfigRequest().then((response) => {
        setData(response);
      });
    },
    []
  );
  const { formatMessage } = useIntl();
  console.log(data);
  return /* @__PURE__ */ jsx(DesignSystemProvider, { theme: darkTheme, children: /* @__PURE__ */ jsx(Main, { children: /* @__PURE__ */ jsxs(Flex, { gap: {
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
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] }),
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to ",
      formatMessage({ id: getTranslation("plugin.name") })
    ] })
  ] }) }) });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] });
};
export {
  App
};
//# sourceMappingURL=App-CwWAWSl0.mjs.map
