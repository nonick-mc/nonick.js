'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { RoleSelect } from '@/components/react-hook-form/role-select';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { reportSettingSchema } from '@/lib/database/src/schema/setting';
import { filterValidIds } from '@/lib/discord/utils';
import { Alert, addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type APIGuildChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateReportSettingAction } from './action';

type InputSetting = z.input<typeof reportSettingSchema.form>;
type OutputSetting = z.output<typeof reportSettingSchema.form>;

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  setting: OutputSetting | null;
};

const PropsContext = createContext<Omit<Props, 'setting'>>({
  channels: [],
  roles: [],
});

export function SettingForm({ setting, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(reportSettingSchema.form),
    defaultValues: {
      channel: setting?.channel ?? '',
      showProgressButton: setting?.showProgressButton ?? true,
      includeModerator: setting?.includeModerator ?? false,
      enableMention: setting?.enableMention ?? false,
      mentionRoles: filterValidIds(setting?.mentionRoles, props.roles),
    },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await updateReportSettingAction({ guildId, ...values });
    const error = !res?.data?.success;

    if (error) {
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
        <Alert
          variant='faded'
          color='primary'
          title='この機能を無効にするには、Discordサーバーの「サーバー設定」→「連携サービス」から、コマンドを無効化する必要があります。'
        />
        <EnableSetting />
        <GeneralSetting />
        <NotificationSetting />
        <FormChangePublisher />
        <FormDevTool />
      </ControlledForm>
    </PropsContext>
  );
}

function EnableSetting() {
  const { channels } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard>
      <ChannelSelect
        control={control}
        name='channel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='通報を表示するチャンネル'
        disallowEmptySelection
        isRequired
      />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard title='基本設定'>
      <ControlledSwitch
        control={control}
        name='includeModerator'
        label='モデレーターも通報の対象にする'
        description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
      />
      <ControlledSwitch
        control={control}
        name='showProgressButton'
        label='進捗ボタンを表示する'
        description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
      />
    </FormCard>
  );
}

function NotificationSetting() {
  const { roles } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();

  const isMentionEnabled = useWatch<InputSetting>({ name: 'enableMention' });

  return (
    <FormCard title='通知設定'>
      <ControlledSwitch
        control={control}
        name='enableMention'
        label='メンション通知を有効にする'
        description='通報が送られた際に特定のロールをメンションします。'
      />
      <RoleSelect
        control={control}
        name='mentionRoles'
        roles={roles}
        label='メンションするロール'
        selectionMode='multiple'
        isRequired
        isDisabled={!isMentionEnabled}
      />
    </FormCard>
  );
}
