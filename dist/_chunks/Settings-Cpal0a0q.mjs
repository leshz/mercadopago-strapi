import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { DesignSystemProvider, darkTheme, Main, Flex, HeaderLayout } from "@strapi/design-system";
import { g as getConfigRequest } from "./getconfig-BIJM0uHM.mjs";
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
  useIntl();
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
    /* @__PURE__ */ jsx(
      HeaderLayout,
      {
        title: "Settings",
        subtitle: "Settings page"
      }
    ),
    "Settings page"
  ] }) }) });
};
export {
  SettingsPage
};
//# sourceMappingURL=Settings-Cpal0a0q.mjs.map
