'use client';

import { addToast, Chip, SelectItem } from '@heroui/react';
import { createFormHook } from '@tanstack/react-form';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import type { z } from 'zod';
import { FormCard } from '@/components/form';
import { ChannelSelectField } from '@/components/form/channel-select';
import { fieldContext, formContext } from '@/components/form/context';
import { FormChangeSubmitBanner } from '@/components/form/submit-button';
import { NumberCheckboxGroupField } from '@/components/form/ui/checkbox';
import { StringSelectField } from '@/components/form/ui/select';
import { SwitchField } from '@/components/form/ui/switch';
import { updateSettingAction } from './action';
import { CustomCheckbox } from './custom-checkbox';
import { ignorePrefixes, settingFormSchema } from './schema';

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
      StringSelectField,
      ChannelSelectField,
      NumberCheckboxGroupField,
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
      allowExternalGuild: setting?.allowExternalGuild ?? false,
      ignorePrefixes: setting?.ignorePrefixes ?? [],
      ignoreChannels: setting?.ignoreChannels ?? [],
      ignoreChannelTypes: setting?.ignoreChannelTypes ?? [],
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
              label='メッセージURL展開を有効にする'
              description='DiscordのメッセージURLが送信された際に、そのメッセージの内容を追加で送信します。'
            />
          )}
        </form.AppField>
      </FormCard>
      <FormCard title='全般設定'>
        <form.Subscribe selector={(state) => state.values.enabled}>
          {(enabled) => (
            <form.AppField name='allowExternalGuild'>
              {(field) => (
                <field.SwitchField
                  label='このサーバーのメッセージを他のサーバーで展開することを許可する'
                  description='有効にすると、このサーバーのメッセージURLが他のサーバーでも展開されるようになります。'
                  isDisabled={!enabled}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </FormCard>
      <FormCard title='例外設定'>
        <form.Subscribe selector={(state) => state.values.enabled}>
          {(enabled) => (
            <>
              <form.AppField name='ignoreChannelTypes'>
                {(field) => (
                  <field.NumberCheckboxGroupField
                    label='URLを展開しないチャンネルの種類'
                    description='特定の種類のチャンネルでURLが展開されないようにします。'
                    isDisabled={!enabled}
                  >
                    <CustomCheckbox
                      icon='solar:mailbox-bold'
                      value={String(ChannelType.GuildAnnouncement)}
                    >
                      アナウンスチャンネル
                    </CustomCheckbox>
                    <CustomCheckbox
                      icon='solar:volume-loud-bold'
                      value={String(ChannelType.GuildVoice)}
                    >
                      ボイスチャンネル
                    </CustomCheckbox>
                    <CustomCheckbox
                      icon='solar:hashtag-chat-bold'
                      value={String(ChannelType.PublicThread)}
                    >
                      公開スレッド
                    </CustomCheckbox>
                    <CustomCheckbox
                      icon='solar:hashtag-chat-bold'
                      value={String(ChannelType.PrivateThread)}
                    >
                      プライベートスレッド
                    </CustomCheckbox>
                  </field.NumberCheckboxGroupField>
                )}
              </form.AppField>
              <form.AppField name='ignoreChannels'>
                {(field) => (
                  <field.ChannelSelectField
                    channels={channels}
                    channelTypeFilter={{ exclude: [ChannelType.GuildCategory] }}
                    label='URLを展開しないチャンネル'
                    description='この設定は指定したチャンネルのスレッドにも適用されます。'
                    isDisabled={!enabled}
                  />
                )}
              </form.AppField>
              <form.AppField name='ignorePrefixes'>
                {(field) => (
                  <field.StringSelectField
                    label='プレフィックスを選択'
                    description='URLの前にこれらの記号がある場合に展開が行われないようにします。（5つまで選択可）'
                    items={ignorePrefixes.map((prefix) => ({ value: prefix }))}
                    renderValue={(items) => (
                      <div className='flex flex-wrap items-center gap-1'>
                        {items.map((item) => (
                          <Chip key={item.key}>
                            <span className='px-0.5'>{item.data?.value}</span>
                          </Chip>
                        ))}
                      </div>
                    )}
                    placeholder='プレフィックスを選択'
                    selectionMode='multiple'
                    isDisabled={!enabled}
                  >
                    {(prefix) => <SelectItem key={prefix.value}>{prefix.value}</SelectItem>}
                  </field.StringSelectField>
                )}
              </form.AppField>
            </>
          )}
        </form.Subscribe>
      </FormCard>
      <form.AppForm>
        <form.FormChangeSubmitBanner />
      </form.AppForm>
    </form>
  );
}
