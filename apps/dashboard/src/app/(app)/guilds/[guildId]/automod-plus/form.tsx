'use client';

import { FormCard, FormSubCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { RoleSelect } from '@/components/react-hook-form/role-select';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { ControlledArrayTextarea } from '@/components/react-hook-form/ui/textarea';
import { filterValidIds } from '@/lib/discord/utils';
import { Alert, addToast, cn } from '@heroui/react';
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
  const bindAction = updateSettingAction.bind(null, guildId);

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      enabled: setting?.enabled ?? false,
      enableInviteUrlFilter: setting?.enableInviteUrlFilter ?? false,
      enableTokenFilter: setting?.enableTokenFilter ?? false,
      enableDomainFilter: setting?.enableDomainFilter ?? false,
      domainList: setting?.domainList ?? [],
      ignoreChannels: filterValidIds(setting?.ignoreChannels, props.channels),
      ignoreRoles: filterValidIds(setting?.ignoreRoles, props.roles),
      enableLog: setting?.enableLog ?? false,
      logChannel: setting?.logChannel ?? null,
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
        <FilterSetting />
        <IgnoreSetting />
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
        label='AutoMod Plusを有効にする'
        description='特定の条件を満たすメッセージを自動で削除します。'
      />
    </FormCard>
  );
}

function FilterSetting() {
  const { control } = useFormContext<InputSetting>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });
  const isEnableDomainFilter = useWatch<InputSetting>({ name: 'enableDomainFilter' });

  return (
    <FormCard title='フィルター設定'>
      <div className='flex flex-col gap-3'>
        <FormSubCard
          title='Discordサーバーの招待リンク'
          icon='solar:link-round-bold'
          isDisabled={!isEnabled}
        >
          <ControlledSwitch
            control={control}
            name='enableInviteUrlFilter'
            label='招待リンクをブロックする'
            description='このDiscordサーバー以外の招待リンクを含むメッセージを自動で削除します。'
            isDisabled={!isEnabled}
          />
        </FormSubCard>
        <FormSubCard
          title='Discordトークン'
          icon='solar:shield-keyhole-bold'
          isDisabled={!isEnabled}
        >
          <ControlledSwitch
            control={control}
            name='enableTokenFilter'
            label='Discordトークンをブロックする'
            description='Discordアカウントのトークンを含むメッセージを自動で削除します。'
            isDisabled={!isEnabled}
          />
        </FormSubCard>
        <FormSubCard title='ドメイン' icon='solar:global-bold' isDisabled={!isEnabled}>
          <ControlledSwitch
            control={control}
            name='enableDomainFilter'
            label='特定のドメインをブロックする'
            description='特定のドメインのURLを含むメッセージを自動で削除します。'
            isDisabled={!isEnabled}
          />
          <ControlledArrayTextarea
            control={control}
            name='domainList'
            label='ブロックするドメイン'
            description='ドメインはカンマ（例: nonick-js.com, discord.com）または改行で区分してください。'
            variant='bordered'
            classNames={{
              inputWrapper: 'bg-content1',
              innerWrapper: 'flex-col items-end',
            }}
            maxArrayLength={20}
            isDisabled={!isEnabled || !isEnableDomainFilter}
          />
        </FormSubCard>
      </div>
    </FormCard>
  );
}

function IgnoreSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels, roles } = useContext(PropsContext);
  const { guildId } = useParams<{ guildId: string }>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='例外設定' bodyClass='gap-6'>
      <Alert
        variant='faded'
        color='primary'
        description='「サーバー管理」権限を持っているユーザーやBOTは、設定に関わらず全てのフィルターが適用されません。'
        classNames={{ base: cn({ 'opacity-disabled': !isEnabled }) }}
      />
      <div className='flex flex-col gap-8'>
        <ChannelSelect
          control={control}
          name='ignoreChannels'
          channels={channels}
          channelTypeFilter={{ exclude: [ChannelType.GuildCategory] }}
          label='フィルターを適用しないチャンネル'
          description='選択したチャンネルのスレッドもフィルターが適用されなくなります。'
          selectionMode='multiple'
          isDisabled={!isEnabled}
        />
        <RoleSelect
          control={control}
          name='ignoreRoles'
          roles={roles}
          disableItemFilter={(role) => role.id === guildId}
          label='フィルターを適用しないロール'
          selectionMode='multiple'
          isDisabled={!isEnabled}
        />
      </div>
    </FormCard>
  );
}

function LogSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels } = useContext(PropsContext);

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });
  const isLogEnabled = useWatch<InputSetting>({ name: 'enableLog' });

  return (
    <FormCard title='ログ設定'>
      <ControlledSwitch
        control={control}
        name='enableLog'
        label='ログを有効にする'
        description='フィルターによってメッセージが削除された際にログを送信します。'
        isDisabled={!isEnabled}
      />
      <ChannelSelect
        control={control}
        name='logChannel'
        label='ログを送信するチャンネル'
        channels={channels}
        channelTypeFilter={{ include: [ChannelType.GuildText] }}
        isRequired
        isDisabled={!isEnabled || !isLogEnabled}
      />
    </FormCard>
  );
}
