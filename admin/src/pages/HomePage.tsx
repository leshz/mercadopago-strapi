import { useIntl } from 'react-intl';
import {
  Main,
  Typography,
  Box,
  Grid,
  Flex,
  Badge,
  Divider,
} from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';
import { getTranslation } from '../utils/getTranslation';

const DUMMY_STATS = {
  totalSales: 142,
  revenue: '$1,284,500',
  pending: 8,
  approved: 126,
  rejected: 8,
};

const DUMMY_RECENT = [
  { id: '78432901', amount: '$12,500', status: 'approved', date: '2026-02-04' },
  { id: '78432887', amount: '$3,200', status: 'pending', date: '2026-02-04' },
  { id: '78432850', amount: '$45,000', status: 'approved', date: '2026-02-03' },
  { id: '78432811', amount: '$8,750', status: 'rejected', date: '2026-02-03' },
  { id: '78432790', amount: '$22,100', status: 'approved', date: '2026-02-02' },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'danger';
    default:
      return 'neutral';
  }
};

const StatCard = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number;
  badge?: { label: string; color: string };
}) => (
  <Box background="neutral0" shadow="filterShadow" hasRadius padding={5}>
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

  return (
    <Main>
      <Layouts.Header
        title={formatMessage({ id: getTranslation('plugin.name') })}
        subtitle={formatMessage({ id: getTranslation('dashboard.subtitle') })}
      />

      <Layouts.Content>
        {/* Stats */}
        <Grid.Root gap={5}>
          <Grid.Item col={3} s={6} xs={12}>
            <StatCard
              label={formatMessage({ id: getTranslation('dashboard.stat.totalSales') })}
              value={DUMMY_STATS.totalSales}
            />
          </Grid.Item>
          <Grid.Item col={3} s={6} xs={12}>
            <StatCard
              label={formatMessage({ id: getTranslation('dashboard.stat.revenue') })}
              value={DUMMY_STATS.revenue}
            />
          </Grid.Item>
          <Grid.Item col={3} s={6} xs={12}>
            <StatCard
              label={formatMessage({ id: getTranslation('dashboard.stat.approved') })}
              value={DUMMY_STATS.approved}
              badge={{ label: `${DUMMY_STATS.pending} pending`, color: 'warning500' }}
            />
          </Grid.Item>
          <Grid.Item col={3} s={6} xs={12}>
            <StatCard
              label={formatMessage({ id: getTranslation('dashboard.stat.rejected') })}
              value={DUMMY_STATS.rejected}
            />
          </Grid.Item>
        </Grid.Root>

        {/* Recent payments */}
        <Box
          background="neutral0"
          shadow="filterShadow"
          hasRadius
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
          marginTop={6}
        >
          <Typography variant="delta" tag="h2">
            {formatMessage({ id: getTranslation('dashboard.recentPayments') })}
          </Typography>
          <Box paddingTop={4} paddingBottom={4}>
            <Divider />
          </Box>

          <Flex direction="column" gap={4}>
            {DUMMY_RECENT.map((payment) => (
              <Flex key={payment.id} justifyContent="space-between" alignItems="center">
                <Flex gap={4} alignItems="center">
                  <Typography variant="omega" fontWeight="bold">
                    #{payment.id}
                  </Typography>
                  <Typography variant="omega">{payment.amount}</Typography>
                </Flex>
                <Flex gap={4} alignItems="center">
                  <Typography variant="pi" textColor="neutral500">
                    {payment.date}
                  </Typography>
                  <Badge backgroundColor={`${statusColor(payment.status)}100`}>
                    {payment.status}
                  </Badge>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Layouts.Content>
    </Main>
  );
};

export { HomePage };
