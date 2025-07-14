'use client';

import { addToast } from '@heroui/react';
import { createFormHook } from '@tanstack/react-form';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import type { z } from 'zod';
import { FormCard } from '@/components/form';
import { ChannelSelectField } from '@/components/form/channel-select';
import { fieldContext, formContext } from '@/components/form/context';
import { FormChangeSubmitBanner } from '@/components/form/submit-button';
import { SwitchField } from '@/components/form/ui/switch';
import { updateSettingAction } from './action';
import { settingFormSchema } from './schema';

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  setting: z.infer<typeof settingFormSchema> | null;
};

export function SettingForm({ setting, channels }: Props) {
  const { guildId } = useParams<{ guildId: string }>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      SwitchField,
      ChannelSelectField,
    },
    formComponents: {
      FormChangeSubmitBanner,
    },
  });

  const form = useAppForm({
    validators: {
      onSubmit: settingFormSchema,
    },
    defaultValues: {
      enabled: setting?.enabled ?? false,
      channels: setting?.channels ?? [],
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await bindUpdateSettingAction(value);
      if (res.serverError || res.validationErrors) {
        return addToast({
          title: '送信中に問題が発生しました',
          description: '時間を置いてもう一度送信してください。',
          color: 'danger',
        });
      }
      formApi.reset(formApi.state.values);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='flex flex-col gap-6 pb-28'
    >
      <FormCard>
        <form.AppField name='enabled'>
          {(field) => (
            <field.SwitchField
              label='自動スレッド作成を有効にする'
              description='指定したチャンネルにメッセージが投稿された際、自動でスレッドを作成します。'
            />
          )}
        </form.AppField>
      </FormCard>
      <FormCard title='全般設定'>
        <form.Subscribe selector={(state) => state.values.enabled}>
          {(enabled) => (
            <form.AppField name='channels'>
              {(field) => (
                <field.ChannelSelectField
                  channels={channels}
                  channelTypeFilter={{ include: [ChannelType.GuildText] }}
                  label='スレッドを作成するチャンネル'
                  selectionMode='multiple'
                  isDisabled={!enabled}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </FormCard>
      <form.AppForm>
        <form.FormChangeSubmitBanner />
      </form.AppForm>
    </form>
  );
}
