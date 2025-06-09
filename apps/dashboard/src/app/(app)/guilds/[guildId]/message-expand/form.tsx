﻿'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { ChannelSelect } from '@/components/react-hook-form/channel-select';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { ControlledCheckboxGroup } from '@/components/react-hook-form/ui/checkbox';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledSelect } from '@/components/react-hook-form/ui/select';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { filterValidIds } from '@/lib/discord/utils';
import { Chip, SelectItem, addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateSettingAction } from './action';
import { CustomCheckbox } from './custom-checkbox';
import { ignorePrefixes, settingFormSchema } from './schema';

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
      allowExternalGuild: setting?.allowExternalGuild ?? false,
      ignorePrefixes: setting?.ignorePrefixes ?? [],
      ignoreChannels: filterValidIds(setting?.ignoreChannels, props.channels),
      ignoreChannelTypes: setting?.ignoreChannelTypes.map((v) => String(v)) ?? [],
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
        <IgnoreSetting />
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
        label='メッセージURL展開を有効にする'
        description='DiscordのメッセージURLが送信された際に、そのメッセージの内容を追加で送信します。'
      />
    </FormCard>
  );
}

function GeneralSetting() {
  const { control } = useFormContext<InputSetting>();

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <ControlledSwitch
        control={control}
        name='allowExternalGuild'
        label='このサーバーのメッセージを他のサーバーで展開することを許可する'
        description='有効にすると、このサーバーのメッセージURLが他のサーバーでも展開されるようになります。'
        isDisabled={!isEnabled}
      />
    </FormCard>
  );
}

function IgnoreSetting() {
  const { control } = useFormContext<InputSetting>();
  const { channels } = useContext(PropsContext);

  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='例外設定'>
      <ControlledCheckboxGroup
        control={control}
        name='ignoreChannelTypes'
        label='URLを展開しないチャンネルの種類'
        description='特定の種類のチャンネルでURLが展開されないようにします。'
        isDisabled={!isEnabled}
      >
        <CustomCheckbox icon='solar:mailbox-bold' value={String(ChannelType.GuildAnnouncement)}>
          アナウンスチャンネル
        </CustomCheckbox>
        <CustomCheckbox icon='solar:volume-loud-bold' value={String(ChannelType.GuildVoice)}>
          ボイスチャンネル
        </CustomCheckbox>
        <CustomCheckbox icon='solar:hashtag-chat-bold' value={String(ChannelType.PublicThread)}>
          公開スレッド
        </CustomCheckbox>
        <CustomCheckbox icon='solar:hashtag-chat-bold' value={String(ChannelType.PrivateThread)}>
          プライベートスレッド
        </CustomCheckbox>
      </ControlledCheckboxGroup>
      <ChannelSelect
        control={control}
        name='ignoreChannels'
        channels={channels}
        channelTypeFilter={{ exclude: [ChannelType.GuildCategory] }}
        label='URLを展開しないチャンネル'
        description='この設定は指定したチャンネルのスレッドにも適用されます。'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      />
      <ControlledSelect
        control={control}
        name='ignorePrefixes'
        label='プレフィックスを選択'
        description='URLの前にこれらの記号がある場合に展開が行われないようにします。（5つまで選択可）'
        items={ignorePrefixes.map((prefix) => ({ value: prefix }))}
        renderValue={(items) => (
          <div className='flex flex-wrap items-center gap-1'>
            {items.map((item) => (
              <Chip key={item.key}>
                <span className='px-0.5'>{item.data?.value}</span>
              </Chip>
            ))}
          </div>
        )}
        placeholder='プレフィックスを選択'
        selectionMode='multiple'
        isDisabled={!isEnabled}
      >
        {(prefix) => <SelectItem key={prefix.value}>{prefix.value}</SelectItem>}
      </ControlledSelect>
    </FormCard>
  );
}
