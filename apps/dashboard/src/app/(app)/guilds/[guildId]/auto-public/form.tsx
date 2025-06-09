'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateSettingAction } from './action';
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
  const bindAction = updateSettingAction.bind(null, guildId);

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      enabled: setting?.enabled ?? false,
      channels: setting?.channels ?? [],
    },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await bindAction(values);
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
        label='自動アナウンス公開を有効にする'
        description='アナウンスチャンネルに投稿されたメッセージを自動で公開します。'
      />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels } = useContext(PropsContext);

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <ChannelSelect
        control={control}
        name='channels'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildAnnouncement] }}
        label='自動公開するチャンネル'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      />
    </FormCard>
  );
}
