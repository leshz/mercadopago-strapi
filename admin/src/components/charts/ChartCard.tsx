import { Box, Typography, Divider } from '@strapi/design-system';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <Box
    background="neutral0"
    shadow="filterShadow"
    hasRadius
    paddingTop={6}
    paddingBottom={6}
    paddingLeft={7}
    paddingRight={7}
    style={{ width: '100%' }}
  >
    <Typography variant="delta" tag="h2">
      {title}
    </Typography>
    <Box paddingTop={4} paddingBottom={4}>
      <Divider />
    </Box>
    {children}
  </Box>
);

export { ChartCard };
