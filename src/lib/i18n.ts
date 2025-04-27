import i18next from 'i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import jaZodTranslation from 'zod-i18n-map/locales/ja/zod.json';

i18next.init({
  lng: 'ja',
  resources: {
    ja: {
      zod: jaZodTranslation,
      custom: {
        invalid_snowflake: '無効な形式のIDです',
        invalid_prefixes: '無効なプレフィックスが含まれています',
        invalid_domains: '無効なドメインが含まれています',
        missing_channel: 'チャンネルが設定されていません',
        missing_role: 'ロールが設定されていません',
        same_start_end_time: '開始時間と終了時間を同じ値にすることはできません',
        duplicate_item: '重複した値が含まれています',
        embed_content_exceeded: '埋め込みの文字数が合計で6000文字を超えています',
        embed_content_required: '埋め込みの文字数は合計で1文字以上である必要があります',
      },
    },
  },
});

z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

export { z };
