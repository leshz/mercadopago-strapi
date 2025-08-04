import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { SettingsPage } from "./pages/Settings";

export default {
  register(app: any) {
    // TODO: next release create a dashboard
    // app.addMenuLink({
    //   to: `plugins/${PLUGIN_ID}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.plugin.name`,
    //     defaultMessage: "Mercadopago",
    //   },
    //   Component: async () => {
    //     const { App } = await import('./pages/App');
    //     return App;
    //   },
    // });

    const settingsBaseName = `${PLUGIN_ID}-configuracion`;

    app.createSettingSection({
      id: settingsBaseName,
      intlLabel: {
        id: `${settingsBaseName}.links-header`,
        defaultMessage: "Mercadopago",
      },

    }, [
      {
        id: `${settingsBaseName}.links-header`,
        to: `plugins/${PLUGIN_ID}/configuracion`,
        intlLabel: {
          id: `${settingsBaseName}.links-header`,
          defaultMessage: "Configuracion",
        },
        Component: async () => {
          return SettingsPage;
        }
      },
    ]);

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  boostrap(app: any) {
  },
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
