'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { CustomSelect } from '@/components/dashboard/custom-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { IconifyIcon } from '@/components/iconify-icon';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { MessageExpandConfig } from '@/lib/database/zod';
import { MessageExpandIgnorePrefixes } from '@/lib/database/zod/messageExpandConfig';
import type { getChannels } from '@/lib/discord';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, CheckboxGroup, type CheckboxProps } from '@nextui-org/checkbox';
import { Chip } from '@nextui-org/chip';
import { SelectItem } from '@nextui-org/select';
import { Switch } from '@nextui-org/switch';
import { cn } from '@nextui-org/theme';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { updateConfig } from './action';

// #region Types, Context
type InputConfig = z.input<typeof MessageExpandConfig>;
type OutputConfig = z.output<typeof MessageExpandConfig>;

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
    resolver: zodResolver(MessageExpandConfig),
    defaultValues: config ?? {
      enabled: false,
      allowExternalGuild: false,
      ignore: {
        channels: [],
        types: [],
        prefixes: [],
      },
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
          <IgnoreConfigForm />
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
            <FormLabel title='メッセージURL展開を有効にする' />
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
  const disabled = !useWatch<InputConfig>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <FormField
        control={form.control}
        name='allowExternalGuild'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='このサーバーのメッセージを他のサーバーで展開することを許可する'
              description='有効にすると、このサーバーのメッセージURLが他のサーバーでも展開されるようになります。'
              isDisabled={disabled}
            />
            <Switch
              ref={ref}
              onChange={onChange}
              onBlur={onBlur}
              isSelected={value}
              isDisabled={disabled}
            />
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function IgnoreConfigForm() {
  const form = useFormContext<InputConfig>();
  const { channels } = useContext(PropsContext);
  const disabled = !useWatch<InputConfig>({ name: 'enabled' });

  return (
    <FormCard title='例外設定'>
      <FormField
        control={form.control}
        name='ignore.types'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='URLを展開しないチャンネルの種類'
              description='特定の種類のチャンネルでURLが展開されないようにします。'
              isDisabled={disabled}
            />
            <FormControl>
              <div className='w-full md:w-[450px]'>
                <CheckboxGroup
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value.map((v) => String(v))}
                  isInvalid={invalid}
                  isDisabled={disabled}
                >
                  <CustomCheckbox
                    icon='solar:mailbox-bold'
                    value={String(ChannelType.GuildAnnouncement)}
                  >
                    アナウンスチャンネル
                  </CustomCheckbox>
                  <CustomCheckbox
                    icon='solar:volume-loud-bold'
                    value={String(ChannelType.GuildVoice)}
                  >
                    ボイスチャンネル
                  </CustomCheckbox>
                  <CustomCheckbox
                    icon='solar:hashtag-chat-bold'
                    value={String(ChannelType.PublicThread)}
                  >
                    公開スレッド
                  </CustomCheckbox>
                  <CustomCheckbox
                    icon='solar:hashtag-chat-bold'
                    value={String(ChannelType.PrivateThread)}
                  >
                    プライベートスレッド
                  </CustomCheckbox>
                </CheckboxGroup>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignore.channels'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='URLを展開しないチャンネル （複数選択可）'
              description='この設定はチャンネルのスレッドにも適用されます。'
              isDisabled={disabled}
            />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                items={channels}
                selectedKeys={value.filter((id) => channels.some((channel) => channel.id === id))}
                selectionMode='multiple'
                isInvalid={invalid}
                isDisabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignore.prefixes'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='プレフィックス （5つまで選択可）'
              description='URLの前にこれらの記号がある場合に展開が行われないようにします。'
              isDisabled={disabled}
            />
            <FormControl>
              <CustomSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                className='w-[320px]'
                placeholder='プレフィックスを選択'
                renderValue={(items) => (
                  <div className='flex flex-wrap items-center gap-1'>
                    {items.map((item) => (
                      <Chip radius='sm' key={item.key}>
                        {item.data?.value}
                      </Chip>
                    ))}
                  </div>
                )}
                items={MessageExpandIgnorePrefixes.map((prefix) => ({ value: prefix }))}
                selectedKeys={value}
                selectionMode='multiple'
                isInvalid={invalid}
                isDisabled={disabled}
              >
                {(prefix) => <SelectItem key={prefix.value}>{prefix.value}</SelectItem>}
              </CustomSelect>
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
// #endregion

// #region Components
type CustomCheckboxProps = CheckboxProps & { icon: string };

function CustomCheckbox({ children, icon, ...props }: CustomCheckboxProps) {
  return (
    <Checkbox
      classNames={{
        base: cn(
          'inline-flex m-0 bg-default-100 hover:bg-default-100/80 items-center justify-between w-full max-w-none',
          'w-full cursor-pointer rounded-lg gap-2 px-4 py-3 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
        label: 'w-full',
      }}
      {...props}
    >
      <div className='flex items-center gap-3 text-sm'>
        <IconifyIcon className='text-[20px] text-default-500' icon={icon} />
        {children}
      </div>
    </Checkbox>
  );
}
// #endregion
