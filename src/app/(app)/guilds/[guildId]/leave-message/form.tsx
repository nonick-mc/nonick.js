'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { AuthorWrapper } from '@/components/react-hook-form/discord-message';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { ControlledTextarea } from '@/components/react-hook-form/ui/textarea';
import { leaveMessageSettingSchema } from '@/lib/database/src/schema/setting';
import { Alert, Card, Link, addToast, cn } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateLeaveMessageSettingAction } from './action';

type InputSetting = z.input<typeof leaveMessageSettingSchema.form>;
type OutputSetting = z.output<typeof leaveMessageSettingSchema.form>;

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  setting: OutputSetting | null;
};

const PropsContext = createContext<Omit<Props, 'setting'>>({
  channels: [],
});

export function SettingForm({ setting, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(leaveMessageSettingSchema.form),
    defaultValues: {
      enabled: setting?.enabled ?? false,
      ignoreBot: setting?.ignoreBot ?? false,
      channel: setting?.channel ?? null,
      message: setting?.message ?? {
        content: '**![userTag]** さんがサーバーを退室しました👋',
      },
    },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await updateLeaveMessageSettingAction({ guildId, ...values });
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
        <EnableSetting />
        <GeneralSetting />
        <MessageSetting />
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
        label='退室メッセージを有効にする'
        description='サーバーからユーザーが退室した際にメッセージを送信します。'
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
        name='channel'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        label='メッセージを送信するチャンネル'
        isRequired
        isDisabled={!isEnabled}
      />
      <ControlledSwitch
        control={control}
        name='ignoreBot'
        label='BOT退室時にメッセージを送信しない'
        description='有効にすると、BOTがサーバーから退室した際にメッセージが送信されないようになります。'
        isDisabled={!isEnabled}
      />
    </FormCard>
  );
}

function MessageSetting() {
  const { control } = useFormContext<InputSetting>();
  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='メッセージ設定' bodyClass='gap-6'>
      <Alert
        variant='faded'
        color='primary'
        classNames={{ base: cn({ 'opacity-disabled': !isEnabled }) }}
        title='プレースホルダーを使用して、メッセージに動的な値を追加できます。'
        description={
          <span>
            詳細は
            <Link
              href='https://docs.nonick-js.com/features/welcome-message'
              className='text-sm text-primary'
              showAnchorIcon
            >
              ドキュメント
            </Link>
            を確認してください。
          </span>
        }
      />
      <Card className='bg-default-100 p-4 shadow-none'>
        <AuthorWrapper name='NoNICK.js' avatar='/icon_300.png' isBot isDisabled={!isEnabled}>
          <ControlledTextarea
            control={control}
            name='message.content'
            variant='bordered'
            minRows={4}
            isDisabled={!isEnabled}
          />
        </AuthorWrapper>
      </Card>
    </FormCard>
  );
}
