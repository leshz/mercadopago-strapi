import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Box, Typography, Divider, Flex, Main, SingleSelect, SingleSelectOption, Loader, Grid, Badge } from "@strapi/design-system";
import "react-dom/client";
import "@strapi/icons";
import { g as getFetchClient, a as getDashboardStats, L as Layouts } from "./index-gu7lr1iy.mjs";
import "@strapi/icons/symbols";
import "yup";
import "styled-components";
import { g as getTranslation } from "./index-DyKKZ7zV.mjs";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Line, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
const useFetchClient = () => {
  const controller = React.useRef(null);
  if (controller.current === null) {
    controller.current = new AbortController();
  }
  React.useEffect(() => {
    return () => {
      controller.current.abort();
    };
  }, []);
  return React.useMemo(() => getFetchClient({
    signal: controller.current.signal
  }), []);
};
const ChartCard = ({ title, children }) => /* @__PURE__ */ jsxs(
  Box,
  {
    background: "neutral0",
    shadow: "filterShadow",
    hasRadius: true,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 7,
    paddingRight: 7,
    style: { width: "100%" },
    children: [
      /* @__PURE__ */ jsx(Typography, { variant: "delta", tag: "h2", children: title }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Divider, {}) }),
      children
    ]
  }
);
const SalesTimelineChart = ({ data }) => /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(ComposedChart, { data, children: [
  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
  /* @__PURE__ */ jsx(
    XAxis,
    {
      dataKey: "date",
      tickFormatter: (v) => v.slice(5),
      fontSize: 12
    }
  ),
  /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", fontSize: 12 }),
  /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", fontSize: 12 }),
  /* @__PURE__ */ jsx(
    Tooltip,
    {
      formatter: (value, name) => [
        name === "revenue" ? `$${value.toLocaleString()}` : value,
        name === "revenue" ? "Revenue" : "Orders"
      ],
      labelFormatter: (label) => label
    }
  ),
  /* @__PURE__ */ jsx(Legend, {}),
  /* @__PURE__ */ jsx(
    Area,
    {
      yAxisId: "left",
      type: "monotone",
      dataKey: "count",
      name: "Orders",
      fill: "#4945ff",
      fillOpacity: 0.15,
      stroke: "#4945ff"
    }
  ),
  /* @__PURE__ */ jsx(
    Line,
    {
      yAxisId: "right",
      type: "monotone",
      dataKey: "revenue",
      name: "Revenue",
      stroke: "#ee5e52",
      strokeWidth: 2,
      dot: false
    }
  )
] }) });
const COLORS = ["#f29d41", "#328048"];
const OrderRatioChart = ({ data, openLabel, closedLabel }) => {
  const chartData = [
    { name: openLabel, value: data.open },
    { name: closedLabel, value: data.closed }
  ];
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(PieChart, { children: [
    /* @__PURE__ */ jsx(
      Pie,
      {
        data: chartData,
        cx: "50%",
        cy: "50%",
        innerRadius: 60,
        outerRadius: 100,
        dataKey: "value",
        label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`,
        children: chartData.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[index] }, index))
      }
    ),
    /* @__PURE__ */ jsx(Tooltip, {}),
    /* @__PURE__ */ jsx(Legend, {})
  ] }) });
};
const RejectionReasonsChart = ({ data }) => /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data, layout: "vertical", margin: { left: 20 }, children: [
  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
  /* @__PURE__ */ jsx(XAxis, { type: "number", fontSize: 12 }),
  /* @__PURE__ */ jsx(
    YAxis,
    {
      type: "category",
      dataKey: "reason",
      fontSize: 11,
      width: 140,
      tickFormatter: (v) => v.length > 20 ? `${v.slice(0, 20)}...` : v
    }
  ),
  /* @__PURE__ */ jsx(Tooltip, {}),
  /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#ee5e52", radius: [0, 4, 4, 0] })
] }) });
const PaymentMethodsChart = ({ data }) => /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data, children: [
  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
  /* @__PURE__ */ jsx(XAxis, { dataKey: "method", fontSize: 12 }),
  /* @__PURE__ */ jsx(YAxis, { fontSize: 12 }),
  /* @__PURE__ */ jsx(Tooltip, {}),
  /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#4945ff", radius: [4, 4, 0, 0] })
] }) });
const TopProductsChart = ({ data }) => {
  const maxCount = data.length > 0 ? data[0].count : 1;
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 3, children: [
    data.map((product, i) => /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", alignItems: "center", children: [
        /* @__PURE__ */ jsxs(Typography, { variant: "omega", fontWeight: "bold", children: [
          i + 1,
          ". ",
          product.name
        ] }),
        /* @__PURE__ */ jsxs(Typography, { variant: "pi", textColor: "neutral500", children: [
          product.count,
          " sold · $",
          product.revenue.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 1, children: /* @__PURE__ */ jsx(
        Box,
        {
          background: "primary200",
          hasRadius: true,
          style: { height: 8, width: "100%" },
          children: /* @__PURE__ */ jsx(
            Box,
            {
              background: "primary600",
              hasRadius: true,
              style: {
                height: 8,
                width: `${product.count / maxCount * 100}%`
              }
            }
          )
        }
      ) })
    ] }, product.name)),
    data.length === 0 && /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral500", children: "No product data available" })
  ] });
};
const StatCard = ({
  label,
  value,
  badge
}) => /* @__PURE__ */ jsxs(
  Box,
  {
    background: "neutral0",
    shadow: "filterShadow",
    hasRadius: true,
    padding: 5,
    style: { width: "100%" },
    children: [
      /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: label }),
      /* @__PURE__ */ jsx(Box, { paddingTop: 2, children: /* @__PURE__ */ jsxs(Flex, { gap: 2, alignItems: "center", children: [
        /* @__PURE__ */ jsx(Typography, { variant: "alpha", children: value }),
        badge && /* @__PURE__ */ jsx(Badge, { backgroundColor: badge.color, textColor: "neutral0", children: badge.label })
      ] }) })
    ]
  }
);
const HomePage = () => {
  const { formatMessage } = useIntl();
  const fetchClient = useFetchClient();
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDashboardStats(fetchClient, days).then((data) => {
      if (!cancelled) setStats(data);
    }).catch((err) => {
      if (!cancelled) setError(err?.message || "Error loading stats");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [days]);
  const t = (id) => formatMessage({ id: getTranslation(id) });
  return /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        title: t("plugin.name"),
        subtitle: t("dashboard.subtitle"),
        primaryAction: /* @__PURE__ */ jsxs(
          SingleSelect,
          {
            label: t("dashboard.period.label"),
            value: String(days),
            onChange: (v) => setDays(Number(v)),
            children: [
              /* @__PURE__ */ jsx(SingleSelectOption, { value: "30", children: t("dashboard.period.30") }),
              /* @__PURE__ */ jsx(SingleSelectOption, { value: "60", children: t("dashboard.period.60") }),
              /* @__PURE__ */ jsx(SingleSelectOption, { value: "90", children: t("dashboard.period.90") })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs(Layouts.Content, { children: [
      loading && /* @__PURE__ */ jsx(Flex, { justifyContent: "center", paddingTop: 8, children: /* @__PURE__ */ jsx(Loader, {}) }),
      error && /* @__PURE__ */ jsx(Box, { padding: 8, children: /* @__PURE__ */ jsxs(Typography, { variant: "omega", textColor: "danger600", children: [
        t("dashboard.error"),
        ": ",
        error
      ] }) }),
      !loading && !error && stats && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Grid.Root, { gap: 5, children: [
          /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
            StatCard,
            {
              label: t("dashboard.stat.totalSales"),
              value: stats.summary.totalSales
            }
          ) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
            StatCard,
            {
              label: t("dashboard.stat.revenue"),
              value: `$${stats.summary.revenue.toLocaleString()}`
            }
          ) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
            StatCard,
            {
              label: t("dashboard.stat.approved"),
              value: stats.summary.approvedCount,
              badge: {
                label: `${stats.summary.pendingCount} pending`,
                color: "warning500"
              }
            }
          ) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
            StatCard,
            {
              label: t("dashboard.stat.rejected"),
              value: stats.summary.rejectedCount
            }
          ) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
            StatCard,
            {
              label: t("dashboard.stat.avgTicket"),
              value: `$${stats.summary.avgTicket.toLocaleString()}`
            }
          ) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(
            StatCard,
            {
              label: t("dashboard.stat.conversionRate"),
              value: `${stats.summary.conversionRate}%`
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(Grid.Root, { gap: 5, paddingTop: 6, children: [
          /* @__PURE__ */ jsx(Grid.Item, { col: 8, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(ChartCard, { title: t("dashboard.chart.salesTimeline"), children: /* @__PURE__ */ jsx(SalesTimelineChart, { data: stats.salesTimeline }) }) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(ChartCard, { title: t("dashboard.chart.orderRatio"), children: /* @__PURE__ */ jsx(
            OrderRatioChart,
            {
              data: stats.orderRatio,
              openLabel: t("dashboard.chart.orderRatio.open"),
              closedLabel: t("dashboard.chart.orderRatio.closed")
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs(Grid.Root, { gap: 5, paddingTop: 6, children: [
          /* @__PURE__ */ jsx(Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(ChartCard, { title: t("dashboard.chart.topProducts"), children: /* @__PURE__ */ jsx(TopProductsChart, { data: stats.topProducts }) }) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(ChartCard, { title: t("dashboard.chart.rejectionReasons"), children: stats.rejectionReasons.length > 0 ? /* @__PURE__ */ jsx(RejectionReasonsChart, { data: stats.rejectionReasons }) : /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral500", children: t("dashboard.noData") }) }) }),
          /* @__PURE__ */ jsx(Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsx(ChartCard, { title: t("dashboard.chart.paymentMethods"), children: stats.paymentMethods.length > 0 ? /* @__PURE__ */ jsx(PaymentMethodsChart, { data: stats.paymentMethods }) : /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral500", children: t("dashboard.noData") }) }) })
        ] })
      ] })
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
//# sourceMappingURL=App-CQB48PMq.mjs.map
