"use strict";
const react = require("react");
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
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const PluginIcon = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("svg", { id: "logos", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 700 700", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("g", { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m570.03,391.07c-5.21-6.54-13.13-9.8-23.75-9.8s-18.53,3.27-23.74,9.8c-5.22,6.53-7.83,14.25-7.83,23.16s2.61,16.81,7.83,23.26c5.21,6.43,13.13,9.65,23.74,9.65s18.54-3.22,23.75-9.65c5.22-6.45,7.82-14.19,7.82-23.26s-2.6-16.63-7.82-23.16Zm-12.92,37.48c-2.53,3.35-6.15,5.04-10.89,5.04s-8.36-1.69-10.91-5.04c-2.55-3.35-3.82-8.13-3.82-14.32s1.27-10.95,3.82-14.29c2.55-3.34,6.19-5.01,10.91-5.01s8.35,1.67,10.89,5.01c2.53,3.34,3.8,8.11,3.8,14.29s-1.27,10.97-3.8,14.32Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m436.75,385.6c-5.29-2.68-11.34-4.03-18.15-4.03-10.47,0-17.86,2.73-22.17,8.18-2.71,3.49-4.22,7.95-4.58,13.37h15.65c.38-2.4,1.15-4.29,2.31-5.69,1.61-1.89,4.36-2.84,8.23-2.84,3.46,0,6.08.48,7.88,1.45,1.78.96,2.68,2.72,2.68,5.26,0,2.09-1.16,3.61-3.49,4.61-1.3.57-3.46,1.04-6.48,1.42l-5.55.68c-6.3.8-11.08,2.13-14.32,3.99-5.92,3.41-8.88,8.93-8.88,16.55,0,5.87,1.83,10.41,5.52,13.61,3.67,3.21,8.34,4.55,13.98,4.81,35.38,1.58,34.98-18.64,35.3-22.84v-23.27c0-7.47-2.65-12.55-7.93-15.25Zm-8.22,35.32c-.11,5.42-1.66,9.15-4.64,11.2-2.99,2.05-6.24,3.07-9.78,3.07-2.24,0-4.14-.63-5.7-1.85-1.56-1.23-2.34-3.24-2.34-6.01,0-3.1,1.28-5.39,3.83-6.88,1.51-.87,3.99-1.61,7.45-2.2l3.69-.69c1.84-.35,3.28-.73,4.34-1.13,1.07-.38,2.1-.9,3.13-1.56v6.03Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m356.09,395.43c4.05,0,7.01,1.25,8.94,3.75,1.31,1.84,2.13,3.93,2.45,6.24h17.45c-.95-8.81-4.03-14.95-9.24-18.43-5.22-3.47-11.9-5.21-20.07-5.21-9.61,0-17.15,2.95-22.61,8.84-5.46,5.9-8.2,14.15-8.2,24.75,0,9.38,2.47,17.04,7.42,22.93,4.95,5.89,12.66,8.84,23.14,8.84s18.42-3.53,23.76-10.61c3.35-4.38,5.23-9.03,5.62-13.94h-17.39c-.36,3.25-1.37,5.9-3.06,7.94-1.67,2.03-4.5,3.06-8.5,3.06-5.63,0-9.47-2.57-11.5-7.72-1.12-2.75-1.69-6.38-1.69-10.91s.57-8.54,1.69-11.43c2.12-5.39,6.05-8.1,11.79-8.1Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m320.13,381.77c-35.85,0-33.72,31.73-33.72,31.73v32.23h16.27v-30.23c0-4.96.63-8.62,1.86-11.01,2.23-4.23,6.6-6.35,13.1-6.35.49,0,1.13.03,1.92.07.79.04,1.69.11,2.73.23v-16.55c-.72-.05-1.19-.07-1.39-.1-.21-.02-.46-.03-.77-.03Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m273.37,393.8c-2.81-4.16-6.38-7.21-10.68-9.15-4.31-1.92-9.15-2.88-14.52-2.88-9.06,0-16.42,2.85-22.1,8.56-5.67,5.72-8.52,13.92-8.52,24.63,0,11.43,3.15,19.67,9.44,24.74,6.28,5.06,13.54,7.61,21.76,7.61,9.96,0,17.71-3.01,23.24-9.02,2.99-3.16,4.86-6.29,5.65-9.38h-17.26c-.68.98-1.41,1.81-2.22,2.46-2.3,1.89-5.42,2.47-9.09,2.47-3.47,0-6.2-.52-8.66-2.07-4.06-2.5-6.35-6.72-6.59-12.91h45.01c.06-5.34-.11-9.43-.54-12.27-.74-4.84-2.4-9.1-4.92-12.77Zm-39.15,14.38c.58-4.02,2.03-7.2,4.3-9.56,2.29-2.35,5.5-3.53,9.65-3.53,3.81,0,7.01,1.11,9.59,3.34,2.57,2.22,4,5.48,4.3,9.75h-27.83Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m185.23,381.56c-7.55,0-14.08,3.31-18.47,8.61-4.17-5.3-10.59-8.61-18.48-8.61-15.89,0-26.13,11.67-26.13,27.12v37.06h14.87v-37.41c0-6.83,4.62-11.55,11.27-11.55,9.8,0,10.81,8.13,10.81,11.55v37.41h14.87v-37.41c0-6.83,4.73-11.55,11.26-11.55,9.8,0,10.93,8.13,10.93,11.55v37.41h14.85v-37.06c0-15.93-9.56-27.12-25.79-27.12Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m493.48,373.65l-.02,17.43c-1.81-2.92-4.17-5.2-7.08-6.83-2.9-1.64-6.23-2.47-9.98-2.47-8.13,0-14.6,3.03-19.46,9.06-4.86,6.05-7.29,14.77-7.29,25.31,0,9.15,2.47,16.65,7.4,22.49,4.93,5.83,14.6,8.39,23.19,8.39,29.95,0,29.6-25.68,29.6-25.68v-59.11s-16.37-1.75-16.37,11.41Zm-3.13,55.04c-2.37,3.4-5.86,5.1-10.43,5.1s-7.98-1.72-10.23-5.13c-2.25-3.43-3.37-8.41-3.37-14.11,0-5.3,1.1-9.72,3.31-13.29,2.21-3.57,5.67-5.36,10.4-5.36,3.1,0,5.82.98,8.17,2.94,3.81,3.25,5.73,9.09,5.73,16.64,0,5.4-1.2,9.81-3.58,13.21Z" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m257.85,474.51c-13.4-.63-20.16,2.56-24.57,5.93-6.09,4.65-9.8,11.53-9.8,22.52v56.51h7.88c2.11,0,4.22-.73,5.77-2.16,1.74-1.6,2.61-3.56,2.61-5.86v-21.12c1.92,3.31,4.45,5.74,7.65,7.32,3.03,1.41,6.53,2.12,10.51,2.12,7.49,0,13.64-2.98,18.41-8.97,4.78-6.15,7.17-14.15,7.17-24.06s-2.26-16.97-7.68-23.57c-4.38-5.34-11.04-8.35-17.94-8.66Zm5.55,46.38c-2.39,3.31-5.66,4.96-9.8,4.96-4.46,0-7.89-1.64-10.28-4.96-2.39-2.99-3.59-7.45-3.59-13.45,0-6.43,1.11-11.16,3.34-14.15,2.4-3.29,5.75-4.96,10.05-4.96s7.89,1.66,10.28,4.96c2.4,3.31,3.59,8.02,3.59,14.15,0,5.68-1.19,10.14-3.59,13.45Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m397.57,480.34c-5.53-4.19-11.18-6.38-20.89-6.12-9.86.27-17.03,3.03-21.49,9.07-4.46,6.05-6.68,13.95-6.68,23.68,0,8.33,1.68,15.04,5.04,20.17,3.37,5.1,7.4,8.6,12.1,10.47,4.68,1.89,9.42,2.28,14.2,1.19,4.77-1.11,8.57-3.84,11.39-8.24v3.99c-.32,5.03-1.53,8.8-3.63,11.32-2.13,2.5-4.47,4.04-7.06,4.59-2.56.54-5.16.24-7.73-.95-2.59-1.17-4.5-2.87-5.75-5.06h-17.14c4.44,13.34,12.41,19.23,26.77,20.27,23.16,1.67,30.54-17.94,30.52-28.52v-33.25c0-10.99-3.58-18.03-9.63-22.62Zm-6.81,32.66c-.63,3.68-1.64,6.4-3.06,8.12-2.97,4.08-7.6,5.53-13.84,4.37-6.27-1.19-9.4-7.2-9.4-18.03,0-5.03.93-9.51,2.82-13.45,1.88-3.91,5.47-5.89,10.79-5.89,3.91,0,6.89,1.42,8.92,4.24,2.04,2.83,3.34,6.05,3.88,9.67.55,3.61.5,7.27-.12,10.96Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m334.59,478.69c-5.29-2.67-11.34-4.03-18.15-4.03-10.47,0-17.85,2.73-22.15,8.19-2.7,3.48-4.22,7.94-4.58,13.36h15.65c.38-2.39,1.15-4.29,2.3-5.68,1.61-1.89,4.36-2.85,8.23-2.85,3.47,0,6.09.48,7.88,1.45,1.78.96,2.67,2.72,2.67,5.26,0,2.09-1.16,3.62-3.49,4.6-1.3.57-3.46,1.04-6.48,1.42l-5.54.67c-6.3.8-11.09,2.13-14.31,3.99-5.93,3.41-8.88,8.92-8.88,16.54,0,5.87,1.83,10.41,5.52,13.61,3.67,3.21,8.34,4.55,13.99,4.81,35.36,1.58,34.96-18.64,35.28-22.84v-23.27c0-7.46-2.63-12.54-7.92-15.24Zm-8.22,35.31c-.1,5.43-1.66,9.15-4.63,11.2-2.98,2.05-6.24,3.07-9.78,3.07-2.24,0-4.13-.63-5.7-1.85-1.56-1.23-2.34-3.23-2.34-6,0-3.1,1.28-5.39,3.83-6.87,1.52-.87,3.99-1.61,7.45-2.2l3.7-.69c1.84-.35,3.29-.72,4.33-1.12,1.07-.39,2.11-.91,3.14-1.56v6.03Z" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m468.71,483.83c-5.22-6.54-13.14-9.81-23.76-9.81s-18.52,3.26-23.73,9.81c-5.22,6.53-7.83,14.24-7.83,23.15s2.61,16.8,7.83,23.25c5.21,6.42,13.13,9.64,23.73,9.64s18.53-3.22,23.76-9.64c5.21-6.45,7.81-14.19,7.81-23.25s-2.6-16.62-7.81-23.15Zm-12.93,37.46c-2.53,3.36-6.15,5.05-10.87,5.05s-8.36-1.69-10.91-5.05c-2.56-3.35-3.83-8.12-3.83-14.31s1.27-10.95,3.83-14.29c2.54-3.34,6.18-5.01,10.91-5.01s8.35,1.67,10.87,5.01c2.53,3.34,3.79,8.1,3.79,14.29s-1.26,10.96-3.79,14.31Z" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("g", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m493.63,227.94c-.43-51.76-65.1-93.43-144.45-92.77-79.34.66-143.3,43.4-142.87,95.16.01,1.34.02,5.04.03,5.5.46,54.91,57.04,98.92,144.49,98.19,87.98-.73,143.3-45.67,142.84-100.59l-.05-5.51Zm-142.9,89.52c-76.29.64-138.46-38.41-138.87-87.21-.02-1.97.1-3.91.29-5.85l.88-5.97c.13-.64.34-1.26.49-1.9,3.14.91,5.42,1.54,6.52,1.79,35.1,8,49.05,16.32,53.19,19.29,2.71-2.42,6.27-3.79,9.87-3.79h.01c4.21,0,8.16,1.8,10.97,4.94,4.41-2.84,9.78-3.44,15.22-1.55,3.56,1.22,6.37,3.49,8.17,6.59,3.63-1.16,7.74-.89,11.85.88,7.91,3.4,9.06,10.72,8.9,15.36,9.4.2,16.98,7.91,16.97,17.35,0,2.25-.45,4.51-1.31,6.57,2.61,1.31,7.06,3.14,11,2.66,3.74-.47,4.86-1.67,5.12-2.03.03-.03.05-.07.07-.1l-10.59-11.7c-1.85-1.74-2.32-3.52-1.21-4.74.46-.52,1.11-.81,1.82-.81,1.23,0,2.28.89,3.05,1.54,5.74,4.79,12.62,11.89,12.69,11.96l.17.19c.15.18.59.54,2.05.8.49.09,1.03.14,1.59.14,1.07,0,3.78-.18,5.76-1.8.36-.31.75-.68,1.12-1.07l.41-.53c1.8-2.3.09-4.64-.27-5.09l-12.89-14.5s-.51-.48-.94-1.07c-1.4-1.87-.77-3.1-.27-3.67.48-.51,1.11-.77,1.77-.77,1.15,0,2.22.76,3.2,1.58,3.45,2.89,8.14,7.5,12.67,11.96l2.85,2.82c.35.23,2.06,1.28,4.44,1.29,1.9,0,3.85-.65,5.79-1.93,2.69-1.75,3.94-3.9,3.82-6.55-.2-2.32-2.13-4.17-2.15-4.19l-17.73-17.84c-1.83-1.56-2.37-3.45-1.32-4.75.45-.56,1.2-.85,1.86-.87,1.15,0,2.16.76,3.17,1.61,3.15,2.64,9.85,8.64,19.91,17.82.58.53.94.85.99.9,0,0,1.84,1.27,4.55,1.28,1.79,0,3.59-.56,5.34-1.67,1.92-1.22,3.03-2.98,3.13-4.94.18-3.57-2.32-5.78-2.34-5.8-4.73-4.14-45.19-39.53-54.6-46.61-5.44-4.1-8.46-5.17-11.58-5.57-.33-.05-.68-.05-1.05-.06-1.25,0-2.86.22-4.18.57-4.8,1.31-11.1,5.79-15.55,9.32-5.79,4.59-11.21,8.9-16.5,10.08-1.66.37-3.48.6-5.36.56-4.99-.01-10.38-1.39-13.41-3.44-1.69-1.14-2.91-2.5-3.52-3.94-1.57-3.66.78-6.6,1.86-7.7l12.17-13.14c.09-.09.17-.17.25-.25-1.75.42-3.47.89-5.31,1.41-4.42,1.23-8.89,2.48-13.43,2.48h-.02c-1.52,0-3.02-.13-4.48-.24l-1.46-.11c-6.38-.41-26.66-5.56-44.54-12.75.02-.02.04-.04.06-.05l4.94-3.79c25.13-18.18,61.67-29.79,102.44-30.13,42.11-.35,79.9,11.4,105.39,30.2l4.9,3.81c.33.27.62.56.94.83l-1.6.74c-14.13,6.46-27.32,9.61-40.33,9.61h-.06c-12.5-.02-24.94-3.02-36.96-8.9-1.37-.64-13.85-6.27-26.45-6.29-.32,0-.66,0-.98.02-20.08.44-28.83,9.18-38.1,18.42l-11.98,12.9c-.24.31-.35.5-.39.61,1.38,1.56,4.98,2.65,8.88,2.66,1.67,0,3.34-.19,4.97-.55,3.66-.81,8.67-4.79,13.52-8.63l.34-.27c5.38-4.27,10.94-8.68,16.62-10.47,2.5-.8,4.91-1.2,7.17-1.2h.03c2.44,0,4.34.47,5.71.89,3,.89,6.41,2.87,11.39,6.63,8.14,6.11,36.66,30.89,53.24,45.39,9.23-4.07,32.62-13.68,61.4-20.05,0,0,0-.04.02-.11.04.21.11.41.15.63l.85,5.95c.12,1.46.2,2.93.21,4.41.41,48.8-61.1,88.88-137.4,89.52Z" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { className: "cls-1", d: "m338.02,266.45h0c-1.58,0-3.28.58-4.4.97-.77.26-1.23.43-1.6.43h-.24l-.33-.16c-.24-.16-.36-.39-.42-.66-.33-.48-.23-1.23.35-2.65.03-.07,1.78-4.98.27-9.22-.74-1.85-2.12-3.54-4.6-4.61-1.68-.73-3.31-1.08-4.83-1.09-3.34,0-5.48,1.7-6.45,2.73-.24.25-.57.53-1.01.53-.14,0-.72-.08-.95-.79-.12-.17-.21-.4-.24-.73-.05-.71-.2-1.78-.61-2.93-.77-1.95-2.32-4.06-5.47-5.03-1.29-.4-2.57-.6-3.81-.6-6.52,0-10.06,5.37-10.2,5.6l-1.29,2.01-.05-.37s-.06.04-.07.04c-.27-.07-.31-2.36-.31-2.36-.06-.51-.18-1.01-.33-1.49-1.21-3.44-4.46-5.86-8.2-5.86-4.83,0-8.77,3.93-8.78,8.79,0,1.1.23,2.15.6,3.12,1.34,3.12,4.44,5.3,8.04,5.31,2.26,0,4.04-1.38,6.06-2.45.55-.29,1.12-.33,1.29-.09.16.22.21.47.23.74.11.22.17.47.13.78-.2,1.2-.47,3.79.36,6.5.89,2.59,2.83,5.23,6.87,6.8,1.02.4,2.04.59,3.04.6,1.81,0,3.59-.62,5.45-1.93.45-.32.79-.47,1.11-.45.22.02.56.09.79.35.18.2.25.44.27.68.14.33.16.69.1,1.05-.1.67-.14,1.7.17,2.87.62,1.87,2.17,4,5.92,5.52,1.29.53,2.51.79,3.64.79,2.48,0,4.18-1.25,5.52-2.49.47-.43.89-.72,1.36-.72.7,0,.98.51,1.11,1.02.22.44.26.98.27,1.27.05,1.38.38,2.67.88,3.87,1.78,3.83,5.67,6.47,10.2,6.48,6.21,0,11.27-5.04,11.28-11.24,0-1.46-.3-2.85-.82-4.13-1.75-3.95-5.7-6.74-10.3-6.8Z" })
    ] })
  ] });
};
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID
      },
      Component: async () => {
        const { App } = await Promise.resolve().then(() => require("./App-D8WEflYO.js"));
        return App;
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("./en-B4KWt_jN.js")) }), `./translations/${locale}.json`, 3);
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
//# sourceMappingURL=index-XtCGNktu.js.map
