"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
const getconfig = require("./getconfig-Di4q5_Oe.js");
const SettingsPage = () => {
  const [data, setData] = react.useState({});
  react.useEffect(
    () => {
      getconfig.getConfigRequest().then((response) => {
        setData(response);
      });
    },
    []
  );
  reactIntl.useIntl();
  console.log(data);
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.DesignSystemProvider, { theme: designSystem.darkTheme, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Main, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { gap: {
    initial: 1,
    medium: 4,
    large: 8
  }, direction: {
    initial: "column",
    medium: "row"
  }, alignItems: {
    initial: "center",
    medium: "flex-start"
  }, children: "Settings page" }) }) });
};
exports.SettingsPage = SettingsPage;
//# sourceMappingURL=Settings-CN10mbui.js.map
