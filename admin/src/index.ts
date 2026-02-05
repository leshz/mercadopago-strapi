import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Mercado Pago',
      },
      Component: async () => {
        const { App } = await import('./pages/App');
        return App;
      },
    });

    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: getTranslation('plugin.name'),
          defaultMessage: 'Mercado Pago',
        },
      },
      [
        {
          id: `${PLUGIN_ID}-configuration`,
          to: `plugins/${PLUGIN_ID}/configuration`,
          intlLabel: {
            id: getTranslation('setting.nav.label'),
            defaultMessage: 'Configuration',
          },
          Component: async () => {
            const { SettingsPage } = await import('./pages/Settings');
            return SettingsPage;
          },
        },
      ]
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  bootstrap(_app: any) {},

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
