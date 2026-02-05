import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Main,
  Field,
  Box,
  Toggle,
  Button,
  SingleSelect,
  SingleSelectOption,
  Grid,
  Typography,
  Divider,
} from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';
import { getTranslation } from '../utils/getTranslation';
import { Check, Eye, EyeStriked } from '@strapi/icons';

import { getConfig, setConfig } from '../api';

type Configuration = {
  isActive: boolean;
  mercadoPagoToken: string;
  defaultCurrency: string;
  backUrls: string;
  webhookPass: string;
  notificationUrl: string;
  bussinessDescription: string;
  isActiveVerification: boolean;
};

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState<boolean>(false);

  const [data, setData] = useState<Configuration>({
    isActive: false,
    mercadoPagoToken: '',
    defaultCurrency: '',
    backUrls: '',
    webhookPass: '',
    notificationUrl: '',
    bussinessDescription: '',
    isActiveVerification: true,
  });

  useEffect(() => {
    getConfig().then((res) => {
      setIsLoading(false);
      setData((prev) => ({ ...prev, ...res.data }));
    });
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    setConfig(data).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <Main>
      <Layouts.Header
        title={formatMessage({ id: getTranslation('setting.header.title') })}
        subtitle={formatMessage({ id: getTranslation('setting.header.subtitle') })}
        primaryAction={
          <Button
            type="submit"
            loading={isLoading}
            onClick={handleSubmit}
            startIcon={<Check />}
            size="L"
          >
            {formatMessage({ id: getTranslation('setting.header.action') })}
          </Button>
        }
      />

      <Layouts.Content>
        {/* General */}
        <Box
          background="neutral0"
          shadow="filterShadow"
          hasRadius
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <Typography variant="delta" tag="h2">
            {formatMessage({ id: getTranslation('setting.section.general') })}
          </Typography>
          <Box paddingTop={4} paddingBottom={4}>
            <Divider />
          </Box>

          <Grid.Root gap={6}>
            <Grid.Item col={6} s={12}>
              <Field.Root>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.isActive.label') })}
                </Field.Label>
                <Toggle
                  onLabel={formatMessage({ id: getTranslation('setting.toggle.on') })}
                  offLabel={formatMessage({ id: getTranslation('setting.toggle.off') })}
                  checked={data.isActive}
                  onChange={() => setData({ ...data, isActive: !data.isActive })}
                />
                <Field.Hint>
                  {formatMessage({ id: getTranslation('setting.field.isActive.hint') })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>

            <Grid.Item col={6} s={12}>
              <Field.Root style={{ width: '100%' }}>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.currency.label') })}
                </Field.Label>
                <SingleSelect
                  value={data.defaultCurrency}
                  onChange={(value: string) => setData({ ...data, defaultCurrency: value })}
                >
                  <SingleSelectOption value="ARS">ARS - Peso argentino</SingleSelectOption>
                  <SingleSelectOption value="BRL">BRL - Real brasileño</SingleSelectOption>
                  <SingleSelectOption value="CLP">CLP - Peso chileno</SingleSelectOption>
                  <SingleSelectOption value="MXN">MXN - Peso mexicano</SingleSelectOption>
                  <SingleSelectOption value="COP">COP - Peso colombiano</SingleSelectOption>
                  <SingleSelectOption value="PEN">PEN - Sol peruano</SingleSelectOption>
                  <SingleSelectOption value="UYU">UYU - Peso uruguayo</SingleSelectOption>
                </SingleSelect>
              </Field.Root>
            </Grid.Item>

            <Grid.Item col={12} s={12}>
              <Field.Root style={{ width: '100%' }}>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.description.label') })}
                </Field.Label>
                <Field.Input
                  name="bussinessDescription"
                  type="text"
                  value={data.bussinessDescription}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, bussinessDescription: ev.target.value })
                  }
                />
                <Field.Hint>
                  {formatMessage({ id: getTranslation('setting.field.description.hint') })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>
          </Grid.Root>
        </Box>

        {/* Credentials */}
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
            {formatMessage({ id: getTranslation('setting.section.credentials') })}
          </Typography>
          <Box paddingTop={4} paddingBottom={4}>
            <Divider />
          </Box>

          <Grid.Root gap={6}>
            <Grid.Item col={12} s={12}>
              <Field.Root style={{ width: '100%' }}>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.token.label') })}
                </Field.Label>
                <Field.Input
                  name="mercadoPagoToken"
                  type={showToken ? 'text' : 'password'}
                  value={data.mercadoPagoToken}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, mercadoPagoToken: ev.target.value })
                  }
                  endAction={
                    showToken ? (
                      <Eye onClick={() => setShowToken(false)} />
                    ) : (
                      <EyeStriked onClick={() => setShowToken(true)} />
                    )
                  }
                />
                <Field.Hint>
                  {formatMessage({ id: getTranslation('setting.field.token.hint') })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>
          </Grid.Root>
        </Box>

        {/* URLs */}
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
            {formatMessage({ id: getTranslation('setting.section.urls') })}
          </Typography>
          <Box paddingTop={4} paddingBottom={4}>
            <Divider />
          </Box>

          <Grid.Root gap={6}>
            <Grid.Item col={6} s={12}>
              <Field.Root style={{ width: '100%' }}>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.backUrls.label') })}
                </Field.Label>
                <Field.Input
                  name="backUrls"
                  type="text"
                  value={data.backUrls}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, backUrls: ev.target.value })
                  }
                />
                <Field.Hint>
                  {formatMessage({ id: getTranslation('setting.field.backUrls.hint') })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>

            <Grid.Item col={6} s={12}>
              <Field.Root style={{ width: '100%' }}>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.notificationUrl.label') })}
                </Field.Label>
                <Field.Input
                  name="notificationUrl"
                  type="text"
                  value={data.notificationUrl}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, notificationUrl: ev.target.value })
                  }
                />
                <Field.Hint>
                  {formatMessage({ id: getTranslation('setting.field.notificationUrl.hint') })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>
          </Grid.Root>
        </Box>

        {/* Webhook Security */}
        <Box
          background="neutral0"
          shadow="filterShadow"
          hasRadius
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
          marginTop={6}
          marginBottom={6}
        >
          <Typography variant="delta" tag="h2">
            {formatMessage({ id: getTranslation('setting.section.webhook') })}
          </Typography>
          <Box paddingTop={4} paddingBottom={4}>
            <Divider />
          </Box>

          <Grid.Root gap={6}>
            <Grid.Item col={8} s={12}>
              <Field.Root style={{ width: '100%' }}>
                <Field.Label>
                  {formatMessage({ id: getTranslation('setting.field.webhookPass.label') })}
                </Field.Label>
                <Field.Input
                  name="webhookPass"
                  type={showWebhookSecret ? 'text' : 'password'}
                  value={data.webhookPass}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, webhookPass: ev.target.value })
                  }
                  endAction={
                    showWebhookSecret ? (
                      <Eye onClick={() => setShowWebhookSecret(false)} />
                    ) : (
                      <EyeStriked onClick={() => setShowWebhookSecret(true)} />
                    )
                  }
                />
                <Field.Hint>
                  {formatMessage({ id: getTranslation('setting.field.webhookPass.hint') })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>

            <Grid.Item col={4} s={12}>
              <Field.Root>
                <Field.Label>
                  {formatMessage({
                    id: getTranslation('setting.field.isActiveVerification.label'),
                  })}
                </Field.Label>
                <Toggle
                  onLabel={formatMessage({ id: getTranslation('setting.toggle.on') })}
                  offLabel={formatMessage({ id: getTranslation('setting.toggle.off') })}
                  checked={data.isActiveVerification}
                  onChange={() =>
                    setData({ ...data, isActiveVerification: !data.isActiveVerification })
                  }
                />
                <Field.Hint>
                  {formatMessage({
                    id: getTranslation('setting.field.isActiveVerification.hint'),
                  })}
                </Field.Hint>
              </Field.Root>
            </Grid.Item>
          </Grid.Root>
        </Box>
      </Layouts.Content>
    </Main>
  );
};

export { SettingsPage };
