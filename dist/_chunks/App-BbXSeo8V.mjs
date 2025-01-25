import { jsx, jsxs } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { useIntl } from "react-intl";
import { Main, Flex, Box, Typography } from "@strapi/design-system";
import { g as getTranslation } from "./index-pfFwFD0n.mjs";
const HomePage = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Main, { children: /* @__PURE__ */ jsx(Flex, { gap: {
    initial: 1,
    medium: 4,
    large: 8
  }, direction: {
    initial: "column",
    medium: "row"
  }, alignItems: {
    initial: "center",
    medium: "flex-start"
  }, children: /* @__PURE__ */ jsx(Box, { padding: 8, children: /* @__PURE__ */ jsxs(Typography, { variant: "alpha", children: [
    "Welcome to ",
    formatMessage({ id: getTranslation("plugin.name") })
  ] }) }) }) });
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
//# sourceMappingURL=App-BbXSeo8V.mjs.map
