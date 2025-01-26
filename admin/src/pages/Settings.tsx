import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Main, Field, Box, Toggle, Button, SingleSelect,
  SingleSelectOption
} from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';
import { getTranslation } from '../utils/getTranslation';
import { Check, Eye, EyeStriked } from '@strapi/icons';

import { getConfig, setConfig } from '../api';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [showSignWh, setShowSignWh] = useState<boolean>(false);

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
        <Toggle
          onLabel="Encendido"
          offLabel="Apagado"
          checked={data.isActive}
          onChange={() => { setData({ ...data, isActive: !data.isActive }) }}
        />
        <Field.Root>
          <Field.Label>Mercadopago Token</Field.Label>
          <Field.Input
            name="token"
            type={showToken ? "text" : "password"}
            value={data.mercadoPagoToken}
            onChange={(ev: any) => {
              setData({ ...data, mercadoPagoToken: ev.target.value })
            }}
            endAction={showToken ? <Eye onClick={() => setShowToken(false)} /> : <EyeStriked onClick={() => setShowToken(true)} />}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Divisa</Field.Label>
          <SingleSelect
            value={data.defaultCurrency}
            onChange={(ev: any) => {
              setData({ ...data, defaultCurrency: ev })
            }}>
            <SingleSelectOption value="ARS">Peso argentino</SingleSelectOption>
            <SingleSelectOption value="BRL" >Real brasileño</SingleSelectOption>
            <SingleSelectOption value="CLP">Peso chileno</SingleSelectOption>
            <SingleSelectOption value="MXN">Peso mexicano</SingleSelectOption>
            <SingleSelectOption value="COP"> Peso colombiano </SingleSelectOption>
            <SingleSelectOption value="PEN"> Sol peruano </SingleSelectOption>
            <SingleSelectOption value="UYU" >Peso uruguayo</SingleSelectOption>
          </SingleSelect>
        </Field.Root>

        <Field.Root>
          <Field.Label>URLS de retorno</Field.Label>
          <Field.Input
            name="token"
            type="text"
            value={data.backUrls}
            onChange={(ev: any) => {
              setData({ ...data, backUrls: ev.target.value })
            }}

          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Firma Webhook</Field.Label>
          <Field.Input
            name="webhook"
            type={showSignWh ? "text" : "password"}
            value={data.webhookPass}
            onChange={(ev: any) => {
              setData({ ...data, webhookPass: ev.target.value })
            }}
            endAction={showToken ? <Eye onClick={() => setShowSignWh(false)} /> : <EyeStriked onClick={() => setShowSignWh(true)} />}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>URL de notificacion</Field.Label>
          <Field.Input
            name="webhook"
            type="text"
            value={data.notificationUrl}
            onChange={(ev: any) => {
              setData({ ...data, notificationUrl: ev.target.value })
            }}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Descripcion del negocio</Field.Label>
          <Field.Input
            name="bussinessDescription"
            type="text"
            value={data.bussinessDescription}
            onChange={(ev: any) => {
              setData({ ...data, bussinessDescription: ev.target.value })
            }}
          />
        </Field.Root>


      </Box >


    </Main >


  );
};

export { SettingsPage };
