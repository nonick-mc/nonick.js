'use client';

import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { msgDeleteLogSettingSchema } from '@/lib/database/src/schema/setting';
import { addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateMsgDeleteLogSettingAction } from '../actions';
import { PropsContext } from '../form-container';

type InputSetting = z.input<typeof msgDeleteLogSettingSchema.form>;
type OutputSetting = z.output<typeof msgDeleteLogSettingSchema.form>;

type Props = {
  setting: OutputSetting | null;
  onFormChange: (hasChanges: boolean) => void;
};

export function MsgDeleteLogSettingForm({ setting, onFormChange }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(msgDeleteLogSettingSchema.form),
    defaultValues: {
      enabled: setting?.enabled ?? false,
      channel: setting?.channel ?? null,
    },
  });

  useEffect(() => {
    onFormChange(form.formState.isDirty);
  }, [form.formState.isDirty, onFormChange]);

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await updateMsgDeleteLogSettingAction({ guildId, ...values });
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
    <ControlledForm form={form} onSubmit={form.handleSubmit(onSubmit)} className='pb-0'>
      <GeneralSetting />
      <FormChangePublisher />
      <FormDevTool />
    </ControlledForm>
  );
}

function GeneralSetting() {
  const { channels } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();

  const enabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <div className='w-full flex flex-col gap-8'>
      <ControlledSwitch
        control={control}
        name='enabled'
        label='メッセージ削除ログを有効にする'
        description='メッセージが削除された際にログを送信します。'
      />
      <ChannelSelect
        control={control}
        name='channel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='ログを送信するチャンネル'
        isRequired
        isDisabled={!enabled}
      />
    </div>
  );
}
