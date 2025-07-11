'use client';

import { addToast, cn, Radio, type RadioProps } from '@heroui/react';
import { createFormHook } from '@tanstack/react-form';
import {
  type APIGuildChannel,
  ChannelType,
  type GuildChannelType,
  GuildVerificationLevel,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import type { z } from 'zod';
import { FormCard } from '@/components/form';
import { ChannelSelectField } from '@/components/form/channel-select';
import { fieldContext, formContext } from '@/components/form/context';
import { FormChangeSubmitBanner } from '@/components/form/submit-button';
import { NumberRadioGroupField } from '@/components/form/ui/radio';
import { SwitchField } from '@/components/form/ui/switch';
import { updateSettingAction } from './action';
import { HourInputField } from './hour-input';
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
      HourInputField,
      NumberRadioGroupField,
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
      level: setting?.level ?? GuildVerificationLevel.Low,
      startHour: setting?.startHour ?? 0,
      endHour: setting?.endHour ?? 6,
      enableLog: setting?.enableLog ?? false,
      logChannel: setting?.logChannel ?? null,
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
              label='自動認証レベル変更を有効にする'
              description='サーバーの認証レベルを特定の時間帯だけ変更します。'
            />
          )}
        </form.AppField>
      </FormCard>
      <FormCard>
        <form.Subscribe selector={(state) => state.values.enabled}>
          {(enabled) => (
            <>
              <div className='w-full flex gap-6'>
                <form.AppField name='startHour'>
                  {(field) => (
                    <field.HourInputField
                      label='開始時間（0～23）'
                      isDisabled={!enabled}
                      isRequired
                    />
                  )}
                </form.AppField>
                <form.AppField name='endHour'>
                  {(field) => (
                    <field.HourInputField
                      label='終了時間（0～23）'
                      isDisabled={!enabled}
                      isRequired
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField name='level'>
                {(field) => (
                  <field.NumberRadioGroupField
                    name='level'
                    label='期間内に設定する認証レベル'
                    isDisabled={!enabled}
                    isRequired
                  >
                    <Radio
                      classNames={CustomRadioClassName(GuildVerificationLevel.Low)}
                      value={String(GuildVerificationLevel.Low)}
                      description='メール認証がされているアカウントのみ'
                    >
                      低
                    </Radio>
                    <Radio
                      classNames={CustomRadioClassName(GuildVerificationLevel.Medium)}
                      value={String(GuildVerificationLevel.Medium)}
                      description='Discordに登録してから5分以上経過したアカウントのみ'
                    >
                      中
                    </Radio>
                    <Radio
                      classNames={CustomRadioClassName(GuildVerificationLevel.High)}
                      value={String(GuildVerificationLevel.High)}
                      description='このサーバーのメンバーとなってから10分以上経過したアカウントのみ'
                    >
                      高
                    </Radio>
                    <Radio
                      classNames={CustomRadioClassName(GuildVerificationLevel.VeryHigh)}
                      value={String(GuildVerificationLevel.VeryHigh)}
                      description='電話認証がされているアカウントのみ'
                    >
                      最高
                    </Radio>
                  </field.NumberRadioGroupField>
                )}
              </form.AppField>
            </>
          )}
        </form.Subscribe>
      </FormCard>
      <FormCard title='ログ設定'>
        <form.Subscribe selector={(state) => state.values.enabled}>
          {(enabled) => (
            <form.AppField name='enableLog'>
              {(field) => (
                <field.SwitchField
                  label='ログを有効にする'
                  description='自動変更の開始・終了時にログを送信します。'
                  isDisabled={!enabled}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.Subscribe selector={({ values }) => values.enabled && values.enableLog}>
          {(enabled) => (
            <form.AppField name='logChannel'>
              {(field) => (
                <field.ChannelSelectField
                  channels={channels}
                  channelTypeFilter={{ include: [ChannelType.GuildText] }}
                  label='ログを送信するチャンネル'
                  isRequired
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

function CustomRadioClassName(
  color: Omit<GuildVerificationLevel, 'None'>,
): RadioProps['classNames'] {
  return {
    base: cn(
      'inline-flex m-0 bg-default-100 data-[hover=true]:bg-default-200 transition-background items-center justify-between w-full max-w-none',
      'w-full cursor-pointer rounded-lg gap-2 px-4 py-3 text-sm',
    ),
    label: cn(
      'shrink-0',
      { 'text-green-500': color === GuildVerificationLevel.Low },
      { 'text-yellow-500': color === GuildVerificationLevel.Medium },
      { 'text-orange-500': color === GuildVerificationLevel.High },
      { 'text-red-500': color === GuildVerificationLevel.VeryHigh },
    ),
    description: 'text-sm text-default-500 max-sm:text-xs',
    labelWrapper: 'flex-row flex-1 items-center gap-3 flex',
  };
}
