import { Box, Flex, Typography } from '@strapi/design-system';
import type { TopProduct } from '../../types/dashboard';

interface TopProductsChartProps {
  data: TopProduct[];
}

const TopProductsChart = ({ data }: TopProductsChartProps) => {
  const maxCount = data.length > 0 ? data[0].count : 1;

  return (
    <Flex direction="column" gap={3}>
      {data.map((product, i) => (
        <Box key={product.name}>
          <Flex justifyContent="space-between" alignItems="center">
            <Typography variant="omega" fontWeight="bold">
              {i + 1}. {product.name}
            </Typography>
            <Typography variant="pi" textColor="neutral500">
              {product.count} sold &middot; ${product.revenue.toLocaleString()}
            </Typography>
          </Flex>
          <Box paddingTop={1}>
            <Box
              background="primary200"
              hasRadius
              style={{ height: 8, width: '100%' }}
            >
              <Box
                background="primary600"
                hasRadius
                style={{
                  height: 8,
                  width: `${(product.count / maxCount) * 100}%`,
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
      {data.length === 0 && (
        <Typography variant="pi" textColor="neutral500">
          No product data available
        </Typography>
      )}
    </Flex>
  );
};

export { TopProductsChart };
