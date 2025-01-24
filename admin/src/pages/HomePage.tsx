
import { useIntl } from 'react-intl';
import { Main, Flex, Typography, Box } from '@strapi/design-system';
import { getTranslation } from '../utils/getTranslation';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <Flex gap={{
        initial: 1,
        medium: 4,
        large: 8
      }} direction={{
        initial: 'column',
        medium: 'row'
      }} alignItems={{
        initial: 'center',
        medium: 'flex-start'
      }}>
        <Box padding={8}>

          <Typography variant="alpha" >Welcome to {formatMessage({ id: getTranslation('plugin.name') })}</Typography>

        </Box>

      </Flex>
    </Main>

  );
};

export { HomePage };
