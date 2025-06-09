import i18next from 'i18next';
import { z as zod } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import jaZodTranslation from 'zod-i18n-map/locales/ja/zod.json';

const z = zod;

i18next.init({
  lng: 'ja',
  resources: {
    ja: {
      zod: jaZodTranslation,
    },
  },
});

z.setErrorMap(makeZodI18nMap({ ns: ['zod'] }));

export { z };
