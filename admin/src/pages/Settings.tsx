import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Main, darkTheme, DesignSystemProvider, Flex, Box, Toggle } from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';
import { getTranslation } from '../utils/getTranslation';

// import getConfig from '../api/getconfig';

const SettingsPage = () => {
  const { formatMessage } = useIntl();

  // const [data, setData] = useState({})

  // useEffect(() => {
  //     getConfig().then((response) => {
  //         setData(response)
  //     })
  // }, []
  // )

  return (

    <Main>
      <Layouts.Header
        title={formatMessage({ id: getTranslation('setting.header.title') })}
        subtitle={formatMessage({ id: getTranslation('setting.header.subtitle') })}
      />
      <Box padding={8}>
        <Flex gap={{
          initial: 1,
          medium: 2,
          large: 2
        }} direction={{
          initial: 'column',
          medium: 'row'
        }} alignItems={{
          initial: 'center',
          medium: 'flex-start'
        }}>

          <Toggle label="Enabled" onLabel="True" offLabel="False" hint="Enable your SSO provider for users" />
        </Flex>
      </Box>

    </Main>


  );
};

export { SettingsPage };
