"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
require("react-dom/client");
require("react");
require("@strapi/icons");
const rulesEngine = require("./rulesEngine-DCUN-fEU.js");
require("@strapi/icons/symbols");
require("yup");
const index = require("./index-CJYgs0qB.js");
const DUMMY_STATS = {
  totalSales: 142,
  revenue: "$1,284,500",
  pending: 8,
  approved: 126,
  rejected: 8
};
const DUMMY_RECENT = [
  { id: "78432901", amount: "$12,500", status: "approved", date: "2026-02-04" },
  { id: "78432887", amount: "$3,200", status: "pending", date: "2026-02-04" },
  { id: "78432850", amount: "$45,000", status: "approved", date: "2026-02-03" },
  { id: "78432811", amount: "$8,750", status: "rejected", date: "2026-02-03" },
  { id: "78432790", amount: "$22,100", status: "approved", date: "2026-02-02" }
];
const statusColor = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "secondary";
    case "rejected":
      return "danger";
    default:
      return "neutral";
  }
};
const StatCard = ({
  label,
  value,
  badge
}) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { background: "neutral0", shadow: "filterShadow", hasRadius: true, padding: 5, children: [
  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: label }),
  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, alignItems: "center", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "alpha", children: value }),
    badge && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Badge, { backgroundColor: badge.color, textColor: "neutral0", children: badge.label })
  ] }) })
] });
const HomePage = () => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      rulesEngine.Layouts.Header,
      {
        title: formatMessage({ id: index.getTranslation("plugin.name") }),
        subtitle: formatMessage({ id: index.getTranslation("dashboard.subtitle") })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(rulesEngine.Layouts.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 5, children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
          StatCard,
          {
            label: formatMessage({ id: index.getTranslation("dashboard.stat.totalSales") }),
            value: DUMMY_STATS.totalSales
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
          StatCard,
          {
            label: formatMessage({ id: index.getTranslation("dashboard.stat.revenue") }),
            value: DUMMY_STATS.revenue
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
          StatCard,
          {
            label: formatMessage({ id: index.getTranslation("dashboard.stat.approved") }),
            value: DUMMY_STATS.approved,
            badge: { label: `${DUMMY_STATS.pending} pending`, color: "warning500" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsxRuntime.jsx(
          StatCard,
          {
            label: formatMessage({ id: index.getTranslation("dashboard.stat.rejected") }),
            value: DUMMY_STATS.rejected
          }
        ) })
      ] }),
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: index.getTranslation("dashboard.recentPayments") }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { direction: "column", gap: 4, children: DUMMY_RECENT.map((payment) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", alignItems: "center", children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 4, alignItems: "center", children: [
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { variant: "omega", fontWeight: "bold", children: [
                  "#",
                  payment.id
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", children: payment.amount })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 4, alignItems: "center", children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral500", children: payment.date }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Badge, { backgroundColor: `${statusColor(payment.status)}100`, children: payment.status })
              ] })
            ] }, payment.id)) })
          ]
        }
      )
    ] })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] });
};
exports.App = App;
