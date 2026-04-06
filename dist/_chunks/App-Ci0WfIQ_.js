"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const React = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
require("react-dom/client");
require("@strapi/icons");
const index = require("./index-BlNzvlEs.js");
require("@strapi/icons/symbols");
require("yup");
require("styled-components");
const index$1 = require("./index-ki1V8Gf8.js");
const recharts = require("recharts");
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const useFetchClient = () => {
  const controller = React__namespace.useRef(null);
  if (controller.current === null) {
    controller.current = new AbortController();
  }
  React__namespace.useEffect(() => {
    return () => {
      controller.current.abort();
    };
  }, []);
  return React__namespace.useMemo(() => index.getFetchClient({
    signal: controller.current.signal
  }), []);
};
const ChartCard = ({ title, children }) => /* @__PURE__ */ jsxRuntime.jsxs(
  designSystem.Box,
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
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "delta", tag: "h2", children: title }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}) }),
      children
    ]
  }
);
const SalesTimelineChart = ({ data }) => /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.ComposedChart, { data, children: [
  /* @__PURE__ */ jsxRuntime.jsx(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
  /* @__PURE__ */ jsxRuntime.jsx(
    recharts.XAxis,
    {
      dataKey: "date",
      tickFormatter: (v) => v.slice(5),
      fontSize: 12
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.YAxis, { yAxisId: "left", fontSize: 12 }),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.YAxis, { yAxisId: "right", orientation: "right", fontSize: 12 }),
  /* @__PURE__ */ jsxRuntime.jsx(
    recharts.Tooltip,
    {
      formatter: (value, name) => [
        name === "revenue" ? `$${value.toLocaleString()}` : value,
        name === "revenue" ? "Revenue" : "Orders"
      ],
      labelFormatter: (label) => label
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.Legend, {}),
  /* @__PURE__ */ jsxRuntime.jsx(
    recharts.Area,
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
  /* @__PURE__ */ jsxRuntime.jsx(
    recharts.Line,
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
  return /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.PieChart, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Pie,
      {
        data: chartData,
        cx: "50%",
        cy: "50%",
        innerRadius: 60,
        outerRadius: 100,
        dataKey: "value",
        label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`,
        children: chartData.map((_, index2) => /* @__PURE__ */ jsxRuntime.jsx(recharts.Cell, { fill: COLORS[index2] }, index2))
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {}),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.Legend, {})
  ] }) });
};
const RejectionReasonsChart = ({ data }) => /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.BarChart, { data, layout: "vertical", margin: { left: 20 }, children: [
  /* @__PURE__ */ jsxRuntime.jsx(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.XAxis, { type: "number", fontSize: 12 }),
  /* @__PURE__ */ jsxRuntime.jsx(
    recharts.YAxis,
    {
      type: "category",
      dataKey: "reason",
      fontSize: 11,
      width: 140,
      tickFormatter: (v) => v.length > 20 ? `${v.slice(0, 20)}...` : v
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {}),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.Bar, { dataKey: "count", fill: "#ee5e52", radius: [0, 4, 4, 0] })
] }) });
const PaymentMethodsChart = ({ data }) => /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.BarChart, { data, children: [
  /* @__PURE__ */ jsxRuntime.jsx(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.XAxis, { dataKey: "method", fontSize: 12 }),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.YAxis, { fontSize: 12 }),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.Tooltip, {}),
  /* @__PURE__ */ jsxRuntime.jsx(recharts.Bar, { dataKey: "count", fill: "#4945ff", radius: [4, 4, 0, 0] })
] }) });
const TopProductsChart = ({ data }) => {
  const maxCount = data.length > 0 ? data[0].count : 1;
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", gap: 3, children: [
    data.map((product, i) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", alignItems: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { variant: "omega", fontWeight: "bold", children: [
          i + 1,
          ". ",
          product.name
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { variant: "pi", textColor: "neutral500", children: [
          product.count,
          " sold · $",
          product.revenue.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 1, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Box,
        {
          background: "primary200",
          hasRadius: true,
          style: { height: 8, width: "100%" },
          children: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Box,
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
    data.length === 0 && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral500", children: "No product data available" })
  ] });
};
const StatCard = ({
  label,
  value,
  badge
}) => /* @__PURE__ */ jsxRuntime.jsxs(
  designSystem.Box,
  {
    background: "neutral0",
    shadow: "filterShadow",
    hasRadius: true,
    padding: 5,
    style: { width: "100%" },
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: label }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, alignItems: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "alpha", children: value }),
        badge && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Badge, { backgroundColor: badge.color, textColor: "neutral0", children: badge.label })
      ] }) })
    ]
  }
);
const HomePage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const fetchClient = useFetchClient();
  const [days, setDays] = React.useState(30);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    index.getDashboardStats(fetchClient, days).then((data) => {
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
  const t = (id) => formatMessage({ id: index$1.getTranslation(id) });
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      index.Layouts.Header,
      {
        title: t("plugin.name"),
        subtitle: t("dashboard.subtitle"),
        primaryAction: /* @__PURE__ */ jsxRuntime.jsxs(
          designSystem.SingleSelect,
          {
            label: t("dashboard.period.label"),
            value: String(days),
            onChange: (v) => setDays(Number(v)),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "30", children: t("dashboard.period.30") }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "60", children: t("dashboard.period.60") }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "90", children: t("dashboard.period.90") })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(index.Layouts.Content, { children: [
      loading && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "center", paddingTop: 8, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Loader, {}) }),
      error && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 8, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { variant: "omega", textColor: "danger600", children: [
        t("dashboard.error"),
        ": ",
        error
      ] }) }),
      !loading && !error && stats && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 5, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            StatCard,
            {
              label: t("dashboard.stat.totalSales"),
              value: stats.summary.totalSales
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            StatCard,
            {
              label: t("dashboard.stat.revenue"),
              value: `$${stats.summary.revenue.toLocaleString()}`
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
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
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            StatCard,
            {
              label: t("dashboard.stat.rejected"),
              value: stats.summary.rejectedCount
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            StatCard,
            {
              label: t("dashboard.stat.avgTicket"),
              value: `$${stats.summary.avgTicket.toLocaleString()}`
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 2, s: 4, xs: 6, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(
            StatCard,
            {
              label: t("dashboard.stat.conversionRate"),
              value: `${stats.summary.conversionRate}%`
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 5, paddingTop: 6, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 8, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(ChartCard, { title: t("dashboard.chart.salesTimeline"), children: /* @__PURE__ */ jsxRuntime.jsx(SalesTimelineChart, { data: stats.salesTimeline }) }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(ChartCard, { title: t("dashboard.chart.orderRatio"), children: /* @__PURE__ */ jsxRuntime.jsx(
            OrderRatioChart,
            {
              data: stats.orderRatio,
              openLabel: t("dashboard.chart.orderRatio.open"),
              closedLabel: t("dashboard.chart.orderRatio.closed")
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 5, paddingTop: 6, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(ChartCard, { title: t("dashboard.chart.topProducts"), children: /* @__PURE__ */ jsxRuntime.jsx(TopProductsChart, { data: stats.topProducts }) }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(ChartCard, { title: t("dashboard.chart.rejectionReasons"), children: stats.rejectionReasons.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx(RejectionReasonsChart, { data: stats.rejectionReasons }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral500", children: t("dashboard.noData") }) }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 4, s: 12, xs: 12, direction: "column", alignItems: "stretch", children: /* @__PURE__ */ jsxRuntime.jsx(ChartCard, { title: t("dashboard.chart.paymentMethods"), children: stats.paymentMethods.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx(PaymentMethodsChart, { data: stats.paymentMethods }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral500", children: t("dashboard.noData") }) }) })
        ] })
      ] })
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
