'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AutoPublicConfig } from '@/lib/database/zod';
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
type InputConfig = z.input<typeof AutoPublicConfig>;
type OutputConfig = z.output<typeof AutoPublicConfig>;

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
    resolver: zodResolver(AutoPublicConfig),
    defaultValues: config ?? {
      enabled: false,
      channels: [],
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
          <EnableConfigForm />
          <GeneralConfigForm />
          <FormActionButtons />
        </form>
      </Form>
    </PropsContext.Provider>
  );
}

function EnableConfigForm() {
  const form = useFormContext<InputConfig>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel title='自動アナウンス公開を有効にする' />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfigForm() {
  const form = useFormContext<InputConfig>();
  const { channels } = useContext(PropsContext);
  const disabled = !useWatch<InputConfig>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <FormField
        control={form.control}
        name='channels'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='自動公開するチャンネル' isDisabled={disabled} />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                items={channels}
                selectedKeys={value.filter((key) => channels.some((c) => c.id === key))}
                selectionMode='multiple'
                types={{ include: [ChannelType.GuildAnnouncement] }}
                isInvalid={invalid}
                isDisabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
// #endregion
