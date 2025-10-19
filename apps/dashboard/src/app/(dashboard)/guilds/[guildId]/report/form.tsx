'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  type APIGuildChannel,
  type APIGuildForumChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  Watch,
} from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ChannelSelect } from '@/components/channel-select';
import { FormChangePublisher, FormDevTool } from '@/components/form';
import { ForumTagSelect } from '@/components/forum-tag-select';
import { MultipleRoleSelect } from '@/components/role-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { updateSettingAction } from './action';
import { formSchema } from './schema';

type FormProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  setting?: z.infer<typeof formSchema>;
};

export function SettingForm({ setting, channels, roles }: FormProps) {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]/report'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      channel: '',
      forumCompletedTag: null,
      forumIgnoredTag: null,
      includeModerator: false,
      showModerateLog: true,
      enableMention: false,
      mentionRoles: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await bindUpdateSettingAction(values);
    if (res.serverError || res.validationErrors) {
      return toast.error('設定の更新中に問題が発生しました。時間をおいて再度お試しください。');
    }
    form.reset(values);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 pb-24'>
        <Card>
          <CardHeader>
            <CardTitle>チャンネル設定</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name='channel'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='responsive'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>通報を管理するチャンネル</FieldLabel>
                      <FieldDescription>指定したチャンネルに通報が送信されます。</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <ChannelSelect
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className='sm:max-w-[300px] sm:min-w-[300px]'
                      channels={channels}
                      value={field.value}
                      onValueChange={field.onChange}
                      includeChannelTypes={[ChannelType.GuildText, ChannelType.GuildForum]}
                    />
                  </Field>
                )}
              />
              <ForumTagSettingField channels={channels} />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>全般設定</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name='includeModerator'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>モデレーターも通報の対象にする</FieldLabel>
                      <FieldDescription>
                        有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
              <FieldSeparator />
              <Controller
                control={form.control}
                name='showModerateLog'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>モデレートログを有効にする</FieldLabel>
                      <FieldDescription>
                        報告されたメッセージやユーザーに関連するモデレートを行った際、スレッドにログが送信されるようになります。
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>通知設定</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name='enableMention'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>メンション通知を有効にする</FieldLabel>
                      <FieldDescription>
                        通報が送られた際に特定のロールをメンションします。
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
              <FieldSeparator />
              <Watch
                control={form.control}
                names={['enableMention']}
                render={([enableMention]: [boolean]) => (
                  <Controller
                    control={form.control}
                    name='mentionRoles'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} orientation='responsive'>
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>メンションするロール</FieldLabel>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldContent>
                        <MultipleRoleSelect
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className='sm:max-w-[400px] sm:min-w-[400px]'
                          roles={roles}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!enableMention}
                        />
                      </Field>
                    )}
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <FormChangePublisher />
      </form>
      <FormDevTool />
    </FormProvider>
  );
}

// フォーム全体の再レンダリングを回避するため別コンポーネントに切り分け
function ForumTagSettingField({ channels }: { channels: APIGuildChannel<GuildChannelType>[] }) {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const channel = useWatch({ control: form.control, name: 'channel' });

  useEffect(() => {
    form.setValue('forumCompletedTag', null);
    form.setValue('forumIgnoredTag', null);
  }, [channel]);

  return (
    <Watch
      control={form.control}
      names={['channel']}
      render={([channelId]: [string]) => {
        const channel = channels.find((channel) => channel.id === channelId);
        if (channel?.type !== ChannelType.GuildForum) return null;

        const tags = (channel as APIGuildForumChannel).available_tags;

        return (
          <>
            <FieldSeparator />
            <Controller
              control={form.control}
              name='forumCompletedTag'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      「対応済み」ボタンを押した時に付与するタグ
                    </FieldLabel>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                  <ForumTagSelect
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className='sm:max-w-[300px] sm:min-w-[300px]'
                    tags={tags}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />
            <FieldSeparator />
            <Controller
              control={form.control}
              name='forumIgnoredTag'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      「対応なし」ボタンを押した時に付与するタグ
                    </FieldLabel>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                  <ForumTagSelect
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className='sm:max-w-[300px] sm:min-w-[300px]'
                    tags={tags}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />
          </>
        );
      }}
    />
  );
}
