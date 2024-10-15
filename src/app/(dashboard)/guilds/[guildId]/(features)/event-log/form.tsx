'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { EventLogConfig } from '@/lib/database/zod';
import type { getChannels } from '@/lib/discord';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/switch';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { updateConfig } from './action';

// #region Types, Context
type InputConfig = z.input<typeof EventLogConfig>;
type OutputConfig = z.output<typeof EventLogConfig>;

type Props = {
  channels: Awaited<ReturnType<typeof getChannels>>;
  config: OutputConfig | null;
};

const PropsContext = createContext<Omit<Props, 'config'>>({
  channels: [],
});
// #endregion

// #region Form
export function ConfigForm({ config, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputConfig, unknown, OutputConfig>({
    resolver: zodResolver(EventLogConfig),
    defaultValues: config ?? {
      timeout: { enabled: false, channel: null },
      kick: { enabled: false, channel: null },
      ban: { enabled: false, channel: null },
      voice: { enabled: false, channel: null },
      messageDelete: { enabled: false, channel: null },
      messageEdit: { enabled: false, channel: null },
    },
  });

  const onSubmit: SubmitHandler<OutputConfig> = async (values) => {
    const res = await updateConfig({ guildId, ...values });

    if (res?.data?.success) {
      form.reset(values);
      toast.success('設定を保存しました！');
    } else {
      toast.error('設定の保存に失敗しました。');
    }
  };

  return (
    <PropsContext.Provider value={props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <LogConfigForm
            name='timeout'
            cardTitle='タイムアウト'
            labelTitle='タイムアウトログを有効にする'
            labelDescription='メンバーをタイムアウトしたり、タイムアウトを手動で解除したりした際にログを送信します。'
          />
          <LogConfigForm
            name='kick'
            cardTitle='キック'
            labelTitle='キックログを有効にする'
            labelDescription='メンバーをキックした際にログを送信します。'
          />
          <LogConfigForm
            name='ban'
            cardTitle='BAN'
            labelTitle='BANログを有効にする'
            labelDescription='メンバーをBANしたり、BANを解除した際にログを送信します。'
          />
          <LogConfigForm
            name='voice'
            cardTitle='ボイスチャット'
            labelTitle='VCログを有効にする'
            labelDescription='ボイスチャットの入室や退室、移動があった際にログを送信します。'
          />
          <LogConfigForm
            name='messageEdit'
            cardTitle='メッセージ編集'
            labelTitle='編集ログを有効にする'
            labelDescription='メッセージが編集された際にログを送信します。'
          />
          <LogConfigForm
            name='messageDelete'
            cardTitle='メッセージ削除'
            labelTitle='削除ログを有効にする'
            labelDescription='メッセージが削除された際にログを送信します。'
          />
          <FormActionButtons />
        </form>
      </Form>
    </PropsContext.Provider>
  );
}

function LogConfigForm({
  name,
  cardTitle,
  labelTitle,
  labelDescription,
}: {
  name: keyof Omit<InputConfig, 'guildId'>;
  cardTitle: string;
  labelTitle: string;
  labelDescription: string;
}) {
  const { channels } = useContext(PropsContext);
  const form = useFormContext<InputConfig>();
  const disabled = !useWatch<InputConfig>({ name: `${name}.enabled` });

  return (
    <FormCard title={cardTitle}>
      <FormField
        control={form.control}
        name={`${name}.enabled`}
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel title={labelTitle} description={labelDescription} />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${name}.channel`}
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='ログを送信するチャンネル' isDisabled={disabled} isRequired />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                selectedKeys={value ? [value] : []}
                channels={channels}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isDisabled={disabled}
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
// #endregion
