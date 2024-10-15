'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { RoleSelect } from '@/components/dashboard/role-select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ReportConfig } from '@/lib/database/zod';
import type { GuildChannelWithoutThread } from '@/types/discord';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/switch';
import { type APIRole, ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { updateConfig } from './action';

// #region Types, Context
type InputConfig = z.input<typeof ReportConfig>;
type OutputConfig = z.output<typeof ReportConfig>;

type Props = {
  channels: GuildChannelWithoutThread[];
  roles: APIRole[];
  config: OutputConfig | null;
};

const PropsContext = createContext<Omit<Props, 'config'>>({
  channels: [],
  roles: [],
});
// #endregion

// #region Form
export function ConfigForm({ config, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputConfig>({
    resolver: zodResolver(ReportConfig),
    defaultValues: config ?? {
      channel: '',
      includeModerator: false,
      progressButton: true,
      mention: {
        enabled: false,
        roles: [],
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
          <NotificationConfigForm />
          <FormActionButtons />
        </form>
      </Form>
    </PropsContext.Provider>
  );
}

function EnableConfigForm() {
  const { channels } = useContext(PropsContext);
  const form = useFormContext<InputConfig>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='channel'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='通報を受け取るチャンネル' isRequired />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                selectedKeys={value ? [value] : []}
                channels={channels}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isRequired
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfigForm() {
  const form = useFormContext<InputConfig>();

  return (
    <FormCard title='基本設定'>
      <FormField
        control={form.control}
        name='includeModerator'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='モデレーターも通報の対象にする'
              description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
            />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='progressButton'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='進捗ボタンを表示する'
              description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
            />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function NotificationConfigForm() {
  const { guildId } = useParams<{ guildId: string }>();
  const form = useFormContext<InputConfig>();
  const { roles } = useContext(PropsContext);

  const disabled = !useWatch<InputConfig>({ name: 'mention.enabled' });

  return (
    <FormCard title='通知設定'>
      <FormField
        control={form.control}
        name='mention.enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='メンション通知を有効にする'
              description='通報が送られた際に特定のロールをメンションします。'
            />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='mention.roles'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='メンションするロール （複数選択可）'
              isRequired
              isDisabled={disabled}
            />
            <FormControl>
              <RoleSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                roles={roles}
                selectedKeys={value.filter((id) => roles.some((role) => role.id === id))}
                selectionMode='multiple'
                disabledKeyFilter={(role) => role.managed || role.id === guildId}
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
