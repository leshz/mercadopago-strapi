import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Main, Flex, Box, Toggle, Button } from '@strapi/design-system';
import { Layouts, ContentBox } from '@strapi/admin/strapi-admin';
import { getTranslation } from '../utils/getTranslation';
import { Check } from '@strapi/icons';

import { getConfig, setConfig } from '../api/getconfig';

type Configuration = {
  isActive: boolean,
  mercadoPagoToken: string,
  defaultCurrency: string,
  backUrls: string,
  webhookPass: string,
  notificationUrl: string,
  bussinessDescription: string,
  canSendMails: boolean,
  adminEmail: string,
}

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<Configuration>({
    isActive: false,
    mercadoPagoToken: '',
    defaultCurrency: '',
    backUrls: '',
    webhookPass: '',
    notificationUrl: '',
    bussinessDescription: '',
    canSendMails: false,
    adminEmail: '',
  })

  useEffect(() => {
    getConfig().then((res) => {
      setIsLoading(false)
      setData({ ...data, ...res.data })
    })
  }, []
  )

  const handlerSubmit = () => {
    setIsLoading(true)
    setConfig(data).then(() => {
      setIsLoading(false)
    })

  }

  console.log(data)

  return (

    <Main>
      <Layouts.Header
        title={formatMessage({ id: getTranslation('setting.header.title') })}
        subtitle={formatMessage({ id: getTranslation('setting.header.subtitle') })}
        primaryAction={
          <Button
            type="submit"
            loading={isLoading}
            onClick={handlerSubmit}
            startIcon={<Check />}
            size="L"
          >
            {formatMessage({ id: getTranslation('setting.header.action') })}
          </Button>
        }
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

          <Toggle
            onLabel="Encendido"
            offLabel="Apagado"
            checked={data.isActive} onChange={() => { setData({ ...data, isActive: !data.isActive }) }} />
        </Flex>
      </Box>


    </Main>


  );
};

export { SettingsPage };
