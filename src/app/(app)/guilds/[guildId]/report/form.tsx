'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { ForumTagsSelect } from '@/components/react-hook-form/forum-tag-select';
import { RoleSelect } from '@/components/react-hook-form/role-select';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { filterValidIds } from '@/lib/discord/utils';
import { Alert, addToast, cn } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type APIGuildChannel,
  type APIGuildForumChannel,
  type APIGuildForumTag,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateSettingAction } from './action';
import { settingFormSchema } from './schema';

type InputSetting = z.input<typeof settingFormSchema>;
type OutputSetting = z.output<typeof settingFormSchema>;

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
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: setting
      ? {
          ...setting,
          mentionRoles: filterValidIds(setting?.mentionRoles, props.roles),
        }
      : {
          channel: '',
          forumCompletedTag: null,
          forumIgnoredTag: null,
          includeModerator: false,
          showModerateLog: true,
          enableMention: false,
          mentionRoles: [],
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
  const {
    control,
    setValue,
    formState: { isDirty },
  } = useFormContext<InputSetting>();

  const channelId = useWatch<InputSetting>({ name: 'channel' }) as string;
  const [isForumChannel, setIsForumChannel] = useState(false);
  const [forumTags, setForumTags] = useState<APIGuildForumTag[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const channel = channels.find((c) => c.id === channelId);
    const isForum = channel?.type === ChannelType.GuildForum;

    setIsForumChannel(isForum);
    setForumTags(
      channel?.type === ChannelType.GuildForum
        ? (channel as APIGuildForumChannel).available_tags
        : [],
    );

    if (isDirty) {
      setValue('forumIgnoredTag', null);
      setValue('forumCompletedTag', null);
    }
  }, [channelId]);

  return (
    <FormCard title='チャンネル設定'>
      <ChannelSelect
        control={control}
        name='channel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText, ChannelType.GuildForum] }}
        label='通報を表示するチャンネル'
        disallowEmptySelection
        isRequired
      />
      <div
        className={cn('flex max-sm:flex-col w-full max-sm:gap-8 gap-4', {
          hidden: !(isForumChannel && channelId),
        })}
      >
        <ForumTagsSelect
          control={control}
          name='forumCompletedTag'
          tags={forumTags}
          label='「対応済み」ボタンを押した時に付与するタグ'
          className='flex-1'
          isDisabled={!(isForumChannel && channelId)}
        />
        <ForumTagsSelect
          control={control}
          name='forumIgnoredTag'
          tags={forumTags}
          label='「無視」ボタンを押した時に付与するタグ'
          className='flex-1'
          isDisabled={!(isForumChannel && channelId)}
        />
      </div>
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
        name='showModerateLog'
        label='モデレートログを表示する'
        description='有効にすると、報告されたメッセージやユーザーに関連するモデレートを行った際、スレッドにログが送信されるようになります。'
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
