'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledRadioGroup } from '@/components/react-hook-form/ui/radio';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { Radio, type RadioProps, addToast, cn } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type APIGuildChannel,
  ChannelType,
  type GuildChannelType,
  GuildVerificationLevel,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateSettingAction } from './action';
import { ControlledHourInput } from './hour-input';
import { settingFormSchema } from './schema';

type InputSetting = z.input<typeof settingFormSchema>;
type OutputSetting = z.output<typeof settingFormSchema>;

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  setting: OutputSetting | null;
};

const PropsContext = createContext<Omit<Props, 'setting'>>({
  channels: [],
});

export function SettingForm({ setting, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      enabled: setting?.enabled ?? false,
      level: String(setting?.level ? setting.level : GuildVerificationLevel.Low),
      startHour: String(setting?.startHour ?? 0),
      endHour: String(setting?.endHour ?? 6),
      enableLog: setting?.enableLog ?? false,
      logChannel: setting?.logChannel ?? null,
    },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await bindUpdateSettingAction(values);
    if (res.serverError || res.validationErrors) {
      return addToast({
        title: '送信中に問題が発生しました',
        description: '時間を置いてもう一度送信してください。',
        color: 'danger',
      });
    }
    form.reset(form.getValues());
  };

  return (
    <PropsContext value={props}>
      <ControlledForm form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <EnableSetting />
        <GeneralSetting />
        <LogSetting />
        <FormChangePublisher />
        <FormDevTool />
      </ControlledForm>
    </PropsContext>
  );
}

function EnableSetting() {
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard>
      <ControlledSwitch
        control={control}
        name='enabled'
        label='自動認証レベル変更を有効にする'
        description='サーバーの認証レベルを特定の時間帯だけ変更します。'
      />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();
  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <div className='w-full flex gap-6'>
        <ControlledHourInput
          control={control}
          name='startHour'
          label='開始時間（0～23）'
          isDisabled={!isEnabled}
          isRequired
        />
        <ControlledHourInput
          control={control}
          name='endHour'
          label='終了時間（0～23）'
          isDisabled={!isEnabled}
          isRequired
        />
      </div>
      <ControlledRadioGroup
        control={control}
        name='level'
        label='期間内に設定する認証レベル'
        isDisabled={!isEnabled}
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
      </ControlledRadioGroup>
    </FormCard>
  );
}

function LogSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels } = useContext(PropsContext);

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });
  const isEnabledLog = useWatch<InputSetting>({ name: 'enableLog' });

  return (
    <FormCard title='ログ設定'>
      <ControlledSwitch
        control={control}
        name='enableLog'
        label='ログを有効にする'
        description='自動変更の開始・終了時にログを送信します。'
        isDisabled={!isEnabled}
      />
      <ChannelSelect
        control={control}
        name='logChannel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='ログを送信するチャンネル'
        isRequired
        isDisabled={!isEnabled || !isEnabledLog}
      />
    </FormCard>
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
    labelWrapper: 'flex-row flex-1 items-center gap-3',
  };
}
