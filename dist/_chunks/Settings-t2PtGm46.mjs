import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { DesignSystemProvider, darkTheme, Main, Flex } from "@strapi/design-system";
import { g as getConfigRequest, a as getTranslation } from "./getTranslation-CvhOJEIf.mjs";
const SettingsPage = () => {
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
export {
  SettingsPage
};
//# sourceMappingURL=Settings-t2PtGm46.mjs.map
