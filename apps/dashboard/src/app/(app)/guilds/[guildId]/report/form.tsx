'use client';

import { Alert, addToast } from '@heroui/react';
import { createFormHook, useStore } from '@tanstack/react-form';
import {
  type APIGuildChannel,
  type APIGuildForumChannel,
  type APIGuildForumTag,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { z } from 'zod';
import { FormCard } from '@/components/form';
import { ChannelSelectField } from '@/components/form/channel-select';
import { fieldContext, formContext } from '@/components/form/context';
import { ForumTagSelectField } from '@/components/form/forum-tag-select';
import { RoleSelectField } from '@/components/form/role-select';
import { FormChangeSubmitBanner } from '@/components/form/submit-button';
import { SwitchField } from '@/components/form/ui/switch';
import { updateSettingAction } from './action';
import { settingFormSchema } from './schema';

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  setting: z.infer<typeof settingFormSchema> | null;
};

export function SettingForm({ setting, roles, channels }: Props) {
  const { guildId } = useParams<{ guildId: string }>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      SwitchField,
      ChannelSelectField,
      RoleSelectField,
      ForumTagSelectField,
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
      channel: setting?.channel ?? '',
      forumCompletedTag: setting?.forumCompletedTag ?? null,
      forumIgnoredTag: setting?.forumIgnoredTag ?? null,
      includeModerator: setting?.includeModerator ?? false,
      showModerateLog: setting?.showModerateLog ?? true,
      enableMention: setting?.enableMention ?? false,
      mentionRoles: setting?.mentionRoles ?? [],
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

  const channelId = useStore(form.store, (state) => state.values.channel);
  const [isForumChannel, setIsForumChannel] = useState(false);
  const [forumTags, setForumTags] = useState<APIGuildForumTag[]>([]);

  useEffect(() => {
    const channel = channels.find((c) => c.id === channelId);
    const isForum = channel?.type === ChannelType.GuildForum;
    form.setFieldValue('forumCompletedTag', null);
    form.setFieldValue('forumIgnoredTag', null);
    setIsForumChannel(isForum);
    setForumTags(isForum ? (channel as APIGuildForumChannel).available_tags : []);
  }, [channelId]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='flex flex-col gap-6 pb-28'
    >
      <Alert
        variant='faded'
        color='primary'
        title='この機能を無効にするには、Discordサーバーの「サーバー設定」→「連携サービス」から、コマンドを無効化する必要があります。'
      />
      <FormCard title='チャンネル設定'>
        <form.AppField name='channel'>
          {(field) => (
            <field.ChannelSelectField
              channels={channels}
              channelTypeFilter={{ include: [ChannelType.GuildText, ChannelType.GuildForum] }}
              label='通報を表示するチャンネル'
              disallowEmptySelection
              isRequired
            />
          )}
        </form.AppField>
        {isForumChannel && channelId && (
          <div className='flex max-sm:flex-col w-full max-sm:gap-8 gap-4'>
            <form.AppField name='forumCompletedTag'>
              {(field) => (
                <field.ForumTagSelectField
                  tags={forumTags}
                  label='「対応済み」ボタンを押した時に付与するタグ'
                  className='flex-1'
                />
              )}
            </form.AppField>
            <form.AppField name='forumIgnoredTag'>
              {(field) => (
                <field.ForumTagSelectField
                  tags={forumTags}
                  label='「無視」ボタンを押した時に付与するタグ'
                  className='flex-1'
                />
              )}
            </form.AppField>
          </div>
        )}
      </FormCard>
      <FormCard title='基本設定'>
        <form.AppField name='includeModerator'>
          {(field) => (
            <field.SwitchField
              label='モデレーターも通報の対象にする'
              description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
            />
          )}
        </form.AppField>
        <form.AppField name='showModerateLog'>
          {(field) => (
            <field.SwitchField
              label='モデレートログを表示する'
              description='有効にすると、報告されたメッセージやユーザーに関連するモデレートを行った際、スレッドにログが送信されるようになります。'
            />
          )}
        </form.AppField>
      </FormCard>
      <FormCard title='メンション設定'>
        <form.AppField name='enableMention'>
          {(field) => (
            <field.SwitchField
              label='メンション通知を有効にする'
              description='通報が送られた際に特定のロールをメンションします。'
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.enableMention}>
          {(enableMention) => (
            <form.AppField name='mentionRoles'>
              {(field) => (
                <field.RoleSelectField
                  roles={roles}
                  label='メンションするロール'
                  selectionMode='multiple'
                  isRequired
                  isDisabled={!enableMention}
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
