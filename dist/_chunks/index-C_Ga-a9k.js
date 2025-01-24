"use strict";
const React = require("react");
const jsxRuntime = require("react/jsx-runtime");
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "mercadopago";
const Initializer = ({ setPlugin }) => {
  const ref = React.useRef(setPlugin);
  React.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const MeliLogo = () => {
  const color = "#FFF";
  const styleObject = { fill: color, strokeWidth: "0px" };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      id: "logos",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 700 500",
      width: 35,
      height: 35,
      "aria-labelledby": "logosTitle",
      preserveAspectRatio: "xMidYMid meet",
      children: /* @__PURE__ */ jsxRuntime.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("path", { style: styleObject, d: "m493.63,227.78c-.43-51.76-65.1-93.43-144.45-92.77-79.34.66-143.3,43.4-142.87,95.16.01,1.34.02,5.04.03,5.5.46,54.91,57.04,98.92,144.49,98.19,87.98-.73,143.3-45.67,142.84-100.59l-.05-5.51Zm-142.9,89.52c-76.29.64-138.46-38.41-138.87-87.21-.02-1.97.1-3.91.29-5.85l.88-5.97c.13-.64.34-1.26.49-1.9,3.14.91,5.42,1.54,6.52,1.79,35.1,8,49.05,16.32,53.19,19.29,2.71-2.42,6.27-3.79,9.87-3.79h.01c4.21,0,8.16,1.8,10.97,4.94,4.41-2.84,9.78-3.44,15.22-1.55,3.56,1.22,6.37,3.49,8.17,6.59,3.63-1.16,7.74-.89,11.85.88,7.91,3.4,9.06,10.72,8.9,15.36,9.4.2,16.98,7.91,16.97,17.35,0,2.25-.45,4.51-1.31,6.57,2.61,1.31,7.06,3.14,11,2.66,3.74-.47,4.86-1.67,5.12-2.03.03-.03.05-.07.07-.1l-10.59-11.7c-1.85-1.74-2.32-3.52-1.21-4.74.46-.52,1.11-.81,1.82-.81,1.23,0,2.28.89,3.05,1.54,5.74,4.79,12.62,11.89,12.69,11.96l.17.19c.15.18.59.54,2.05.8.49.09,1.03.14,1.59.14,1.07,0,3.78-.18,5.76-1.8.36-.31.75-.68,1.12-1.07l.41-.53c1.8-2.3.09-4.64-.27-5.09l-12.89-14.5s-.51-.48-.94-1.07c-1.4-1.87-.77-3.1-.27-3.67.48-.51,1.11-.77,1.77-.77,1.15,0,2.22.76,3.2,1.58,3.45,2.89,8.14,7.5,12.67,11.96l2.85,2.82c.35.23,2.06,1.28,4.44,1.29,1.9,0,3.85-.65,5.79-1.93,2.69-1.75,3.94-3.9,3.82-6.55-.2-2.32-2.13-4.17-2.15-4.19l-17.73-17.84c-1.83-1.56-2.37-3.45-1.32-4.75.45-.56,1.2-.85,1.86-.87,1.15,0,2.16.76,3.17,1.61,3.15,2.64,9.85,8.64,19.91,17.82.58.53.94.85.99.9,0,0,1.84,1.27,4.55,1.28,1.79,0,3.59-.56,5.34-1.67,1.92-1.22,3.03-2.98,3.13-4.94.18-3.57-2.32-5.78-2.34-5.8-4.73-4.14-45.19-39.53-54.6-46.61-5.44-4.1-8.46-5.17-11.58-5.57-.33-.05-.68-.05-1.05-.06-1.25,0-2.86.22-4.18.57-4.8,1.31-11.1,5.79-15.55,9.32-5.79,4.59-11.21,8.9-16.5,10.08-1.66.37-3.48.6-5.36.56-4.99-.01-10.38-1.39-13.41-3.44-1.69-1.14-2.91-2.5-3.52-3.94-1.57-3.66.78-6.6,1.86-7.7l12.17-13.14c.09-.09.17-.17.25-.25-1.75.42-3.47.89-5.31,1.41-4.42,1.23-8.89,2.48-13.43,2.48h-.02c-1.52,0-3.02-.13-4.48-.24l-1.46-.11c-6.38-.41-26.66-5.56-44.54-12.75.02-.02.04-.04.06-.05l4.94-3.79c25.13-18.18,61.67-29.79,102.44-30.13,42.11-.35,79.9,11.4,105.39,30.2l4.9,3.81c.33.27.62.56.94.83l-1.6.74c-14.13,6.46-27.32,9.61-40.33,9.61h-.06c-12.5-.02-24.94-3.02-36.96-8.9-1.37-.64-13.85-6.27-26.45-6.29-.32,0-.66,0-.98.02-20.08.44-28.83,9.18-38.1,18.42l-11.98,12.9c-.24.31-.35.5-.39.61,1.38,1.56,4.98,2.65,8.88,2.66,1.67,0,3.34-.19,4.97-.55,3.66-.81,8.67-4.79,13.52-8.63l.34-.27c5.38-4.27,10.94-8.68,16.62-10.47,2.5-.8,4.91-1.2,7.17-1.2h.03c2.44,0,4.34.47,5.71.89,3,.89,6.41,2.87,11.39,6.63,8.14,6.11,36.66,30.89,53.24,45.39,9.23-4.07,32.62-13.68,61.4-20.05,0,0,0-.04.02-.11.04.21.11.41.15.63l.85,5.95c.12,1.46.2,2.93.21,4.41.41,48.8-61.1,88.88-137.4,89.52Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { style: styleObject, d: "m338.02,266.3h0c-1.58,0-3.28.58-4.4.97-.77.26-1.23.43-1.6.43h-.24l-.33-.16c-.24-.16-.36-.39-.42-.66-.33-.48-.23-1.23.35-2.65.03-.07,1.78-4.98.27-9.22-.74-1.85-2.12-3.54-4.6-4.61-1.68-.73-3.31-1.08-4.83-1.09-3.34,0-5.48,1.7-6.45,2.73-.24.25-.57.53-1.01.53-.14,0-.72-.08-.95-.79-.12-.17-.21-.4-.24-.73-.05-.71-.2-1.78-.61-2.93-.77-1.95-2.32-4.06-5.47-5.03-1.29-.4-2.57-.6-3.81-.6-6.52,0-10.06,5.37-10.2,5.6l-1.29,2.01-.05-.37s-.06.04-.07.04c-.27-.07-.31-2.36-.31-2.36-.06-.51-.18-1.01-.33-1.49-1.21-3.44-4.46-5.86-8.2-5.86-4.83,0-8.77,3.93-8.78,8.79,0,1.1.23,2.15.6,3.12,1.34,3.12,4.44,5.3,8.04,5.31,2.26,0,4.04-1.38,6.06-2.45.55-.29,1.12-.33,1.29-.09.16.22.21.47.23.74.11.22.17.47.13.78-.2,1.2-.47,3.79.36,6.5.89,2.59,2.83,5.23,6.87,6.8,1.02.4,2.04.59,3.04.6,1.81,0,3.59-.62,5.45-1.93.45-.32.79-.47,1.11-.45.22.02.56.09.79.35.18.2.25.44.27.68.14.33.16.69.1,1.05-.1.67-.14,1.7.17,2.87.62,1.87,2.17,4,5.92,5.52,1.29.53,2.51.79,3.64.79,2.48,0,4.18-1.25,5.52-2.49.47-.43.89-.72,1.36-.72.7,0,.98.51,1.11,1.02.22.44.26.98.27,1.27.05,1.38.38,2.67.88,3.87,1.78,3.83,5.67,6.47,10.2,6.48,6.21,0,11.27-5.04,11.28-11.24,0-1.46-.3-2.85-.82-4.13-1.75-3.95-5.7-6.74-10.3-6.8Z" })
      ] })
    }
  );
};
const PluginIcon = () => /* @__PURE__ */ jsxRuntime.jsx(MeliLogo, {});
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: "Mercadopago"
      },
      Component: async () => {
        const { App } = await Promise.resolve().then(() => require("./App-BSSMWjHR.js"));
        return App;
      }
    });
    const settingsBaseName = `${PLUGIN_ID}-configuracion`;
    app.createSettingSection({
      id: settingsBaseName,
      intlLabel: {
        id: `${settingsBaseName}.links-header`,
        defaultMessage: "Mercadopago"
      }
    }, [
      {
        id: `${settingsBaseName}.links-header`,
        to: `plugins/${PLUGIN_ID}/configuracion`,
        intlLabel: {
          id: `${settingsBaseName}.links-header`,
          defaultMessage: "Configuracion"
        },
        Component: async () => {
          const { SettingsPage } = await Promise.resolve().then(() => require("./Settings-L_IhygPV.js"));
          return SettingsPage;
        }
      }
    ]);
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  boostrap(app) {
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("./en-BEQwJXQ-.js")), "./translations/es.json": () => Promise.resolve().then(() => require("./es-GUfQ_L5_.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
exports.PLUGIN_ID = PLUGIN_ID;
exports.index = index;
//# sourceMappingURL=index-C_Ga-a9k.js.map
