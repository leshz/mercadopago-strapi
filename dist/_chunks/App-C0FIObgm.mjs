import { jsxs, jsx } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { useIntl } from "react-intl";
import { Main, Grid, Box, Typography, Divider, Flex, Badge } from "@strapi/design-system";
import "react-dom/client";
import "react";
import "@strapi/icons";
import { L as Layouts } from "./rulesEngine-B89gjlkb.mjs";
import "@strapi/icons/symbols";
import "yup";
import { g as getTranslation } from "./index-DgagI5oC.mjs";
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
}) => /* @__PURE__ */ jsxs(Box, { background: "neutral0", shadow: "filterShadow", hasRadius: true, padding: 5, children: [
  /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: label }),
  /* @__PURE__ */ jsx(Box, { paddingTop: 2, children: /* @__PURE__ */ jsxs(Flex, { gap: 2, alignItems: "center", children: [
    /* @__PURE__ */ jsx(Typography, { variant: "alpha", children: value }),
    badge && /* @__PURE__ */ jsx(Badge, { backgroundColor: badge.color, textColor: "neutral0", children: badge.label })
  ] }) })
] });
const HomePage = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        title: formatMessage({ id: getTranslation("plugin.name") }),
        subtitle: formatMessage({ id: getTranslation("dashboard.subtitle") })
      }
    ),
    /* @__PURE__ */ jsxs(Layouts.Content, { children: [
      /* @__PURE__ */ jsxs(Grid.Root, { gap: 5, children: [
        /* @__PURE__ */ jsx(Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsx(
          StatCard,
          {
            label: formatMessage({ id: getTranslation("dashboard.stat.totalSales") }),
            value: DUMMY_STATS.totalSales
          }
        ) }),
        /* @__PURE__ */ jsx(Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsx(
          StatCard,
          {
            label: formatMessage({ id: getTranslation("dashboard.stat.revenue") }),
            value: DUMMY_STATS.revenue
          }
        ) }),
        /* @__PURE__ */ jsx(Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsx(
          StatCard,
          {
            label: formatMessage({ id: getTranslation("dashboard.stat.approved") }),
            value: DUMMY_STATS.approved,
            badge: { label: `${DUMMY_STATS.pending} pending`, color: "warning500" }
          }
        ) }),
        /* @__PURE__ */ jsx(Grid.Item, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsx(
          StatCard,
          {
            label: formatMessage({ id: getTranslation("dashboard.stat.rejected") }),
            value: DUMMY_STATS.rejected
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs(
        Box,
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
            /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: formatMessage({ id: getTranslation("dashboard.recentPayments") }) }),
            /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Divider, {}) }),
            /* @__PURE__ */ jsx(Flex, { direction: "column", gap: 4, children: DUMMY_RECENT.map((payment) => /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", alignItems: "center", children: [
              /* @__PURE__ */ jsxs(Flex, { gap: 4, alignItems: "center", children: [
                /* @__PURE__ */ jsxs(Typography, { variant: "omega", fontWeight: "bold", children: [
                  "#",
                  payment.id
                ] }),
                /* @__PURE__ */ jsx(Typography, { variant: "omega", children: payment.amount })
              ] }),
              /* @__PURE__ */ jsxs(Flex, { gap: 4, alignItems: "center", children: [
                /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral500", children: payment.date }),
                /* @__PURE__ */ jsx(Badge, { backgroundColor: `${statusColor(payment.status)}100`, children: payment.status })
              ] })
            ] }, payment.id)) })
          ]
        }
      )
    ] })
  ] });
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
