import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  Main,
  Typography,
  Box,
  Grid,
  Flex,
  Badge,
  Loader,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { Layouts, useFetchClient } from '@strapi/admin/strapi-admin';
import { getTranslation } from '../utils/getTranslation';
import { getDashboardStats } from '../api';
import type { DashboardStats } from '../types/dashboard';
import { ChartCard } from '../components/charts/ChartCard';
import { SalesTimelineChart } from '../components/charts/SalesTimelineChart';
import { OrderRatioChart } from '../components/charts/OrderRatioChart';
import { RejectionReasonsChart } from '../components/charts/RejectionReasonsChart';
import { PaymentMethodsChart } from '../components/charts/PaymentMethodsChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';

const StatCard = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number;
  badge?: { label: string; color: string };
}) => (
  <Box
    background="neutral0"
    shadow="filterShadow"
    hasRadius
    padding={5}
    style={{ width: '100%' }}
  >
    <Typography variant="sigma" textColor="neutral600">
      {label}
    </Typography>
    <Box paddingTop={2}>
      <Flex gap={2} alignItems="center">
        <Typography variant="alpha">{value}</Typography>
        {badge && (
          <Badge backgroundColor={badge.color} textColor="neutral0">
            {badge.label}
          </Badge>
        )}
      </Flex>
    </Box>
  </Box>
);

const HomePage = () => {
  const { formatMessage } = useIntl();
  const fetchClient = useFetchClient();
  const [days, setDays] = useState<number>(30);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getDashboardStats(fetchClient, days)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Error loading stats');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [days]);

  const t = (id: string) => formatMessage({ id: getTranslation(id) });

  return (
    <Main>
      <Layouts.Header
        title={t('plugin.name')}
        subtitle={t('dashboard.subtitle')}
        primaryAction={
          <SingleSelect
            label={t('dashboard.period.label')}
            value={String(days)}
            onChange={(v: string) => setDays(Number(v))}
          >
            <SingleSelectOption value="30">{t('dashboard.period.30')}</SingleSelectOption>
            <SingleSelectOption value="60">{t('dashboard.period.60')}</SingleSelectOption>
            <SingleSelectOption value="90">{t('dashboard.period.90')}</SingleSelectOption>
          </SingleSelect>
        }
      />

      <Layouts.Content>
        {loading && (
          <Flex justifyContent="center" paddingTop={8}>
            <Loader />
          </Flex>
        )}

        {error && (
          <Box padding={8}>
            <Typography variant="omega" textColor="danger600">
              {t('dashboard.error')}: {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && stats && (
          <>
            {/* Row 1: Stats */}
            <Grid.Root gap={5}>
              <Grid.Item col={2} s={4} xs={6} direction="column" alignItems="stretch">
                <StatCard
                  label={t('dashboard.stat.totalSales')}
                  value={stats.summary.totalSales}
                />
              </Grid.Item>
              <Grid.Item col={2} s={4} xs={6} direction="column" alignItems="stretch">
                <StatCard
                  label={t('dashboard.stat.revenue')}
                  value={`$${stats.summary.revenue.toLocaleString()}`}
                />
              </Grid.Item>
              <Grid.Item col={2} s={4} xs={6} direction="column" alignItems="stretch">
                <StatCard
                  label={t('dashboard.stat.approved')}
                  value={stats.summary.approvedCount}
                  badge={{
                    label: `${stats.summary.pendingCount} pending`,
                    color: 'warning500',
                  }}
                />
              </Grid.Item>
              <Grid.Item col={2} s={4} xs={6} direction="column" alignItems="stretch">
                <StatCard
                  label={t('dashboard.stat.rejected')}
                  value={stats.summary.rejectedCount}
                />
              </Grid.Item>
              <Grid.Item col={2} s={4} xs={6} direction="column" alignItems="stretch">
                <StatCard
                  label={t('dashboard.stat.avgTicket')}
                  value={`$${stats.summary.avgTicket.toLocaleString()}`}
                />
              </Grid.Item>
              <Grid.Item col={2} s={4} xs={6} direction="column" alignItems="stretch">
                <StatCard
                  label={t('dashboard.stat.conversionRate')}
                  value={`${stats.summary.conversionRate}%`}
                />
              </Grid.Item>
            </Grid.Root>

            {/* Row 2: Timeline + Order Ratio */}
            <Grid.Root gap={5} paddingTop={6}>
              <Grid.Item col={8} s={12} xs={12} direction="column" alignItems="stretch">
                <ChartCard title={t('dashboard.chart.salesTimeline')}>
                  <SalesTimelineChart data={stats.salesTimeline} />
                </ChartCard>
              </Grid.Item>
              <Grid.Item col={4} s={12} xs={12} direction="column" alignItems="stretch">
                <ChartCard title={t('dashboard.chart.orderRatio')}>
                  <OrderRatioChart
                    data={stats.orderRatio}
                    openLabel={t('dashboard.chart.orderRatio.open')}
                    closedLabel={t('dashboard.chart.orderRatio.closed')}
                  />
                </ChartCard>
              </Grid.Item>
            </Grid.Root>

            {/* Row 3: Products + Rejections + Payment Methods */}
            <Grid.Root gap={5} paddingTop={6}>
              <Grid.Item col={4} s={12} xs={12} direction="column" alignItems="stretch">
                <ChartCard title={t('dashboard.chart.topProducts')}>
                  <TopProductsChart data={stats.topProducts} />
                </ChartCard>
              </Grid.Item>
              <Grid.Item col={4} s={12} xs={12} direction="column" alignItems="stretch">
                <ChartCard title={t('dashboard.chart.rejectionReasons')}>
                  {stats.rejectionReasons.length > 0 ? (
                    <RejectionReasonsChart data={stats.rejectionReasons} />
                  ) : (
                    <Typography variant="pi" textColor="neutral500">
                      {t('dashboard.noData')}
                    </Typography>
                  )}
                </ChartCard>
              </Grid.Item>
              <Grid.Item col={4} s={12} xs={12} direction="column" alignItems="stretch">
                <ChartCard title={t('dashboard.chart.paymentMethods')}>
                  {stats.paymentMethods.length > 0 ? (
                    <PaymentMethodsChart data={stats.paymentMethods} />
                  ) : (
                    <Typography variant="pi" textColor="neutral500">
                      {t('dashboard.noData')}
                    </Typography>
                  )}
                </ChartCard>
              </Grid.Item>
            </Grid.Root>
          </>
        )}
      </Layouts.Content>
    </Main>
  );
};

export { HomePage };
