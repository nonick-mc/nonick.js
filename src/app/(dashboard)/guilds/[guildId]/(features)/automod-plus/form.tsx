'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { RoleSelect } from '@/components/dashboard/role-select';
import { IconifyIcon } from '@/components/iconify-icon';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AutoModConfig } from '@/lib/database/zod';
import type { getChannels, getRoles } from '@/lib/discord';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Textarea } from '@nextui-org/input';
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
type InputConfig = z.input<typeof AutoModConfig>;
type OutputConfig = z.output<typeof AutoModConfig>;

type Props = {
  channels: Awaited<ReturnType<typeof getChannels>>;
  roles: Awaited<ReturnType<typeof getRoles>>;
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

  const form = useForm<InputConfig, unknown, OutputConfig>({
    resolver: zodResolver(AutoModConfig),
    defaultValues: config ?? {
      enabled: false,
      filter: {
        domain: { enabled: false, list: [] },
        token: false,
        inviteUrl: false,
      },
      ignore: { channels: [], roles: [] },
      log: { enabled: false, channel: null },
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
          <FilterConfigForm />
          <IgnoreConfigForm />
          <LogConfigForm />
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
            <FormLabel title='AutoMod Plusを有効にする' />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function FilterConfigForm() {
  const form = useFormContext<InputConfig>();
  const enabled = useWatch<InputConfig>({ name: 'enabled' });
  const domainFilterEnabled = useWatch<InputConfig>({ name: 'filter.domain.enabled' });

  return (
    <FormCard title='フィルター設定' className='gap-6'>
      <Accordion
        variant='splitted'
        selectionMode='multiple'
        className='px-0'
        itemClasses={{
          base: 'px-4 bg-default-100 shadow-none border-none',
          startContent: 'h-[20px] text-default-500',
          title: 'text-sm',
          content: 'pt-0 pb-4 flex flex-col gap-6',
        }}
        isDisabled={!enabled}
      >
        <AccordionItem
          title='Discordサーバーの招待リンク'
          startContent={<IconifyIcon icon='solar:link-round-bold' className='text-[20px]' />}
        >
          <FormField
            control={form.control}
            name='filter.inviteUrl'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormItem dir='row'>
                <FormLabel
                  title='招待リンクをブロックする'
                  description='このDiscordサーバー以外の招待リンクを含むメッセージを自動で削除します。'
                  isDisabled={!enabled}
                />
                <FormControl>
                  <Switch
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    isSelected={value}
                    isDisabled={!enabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </AccordionItem>
        <AccordionItem
          title='Discordトークン'
          startContent={<IconifyIcon icon='solar:shield-keyhole-bold' className='text-[20px]' />}
        >
          <FormField
            control={form.control}
            name='filter.token'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormItem dir='row'>
                <FormLabel
                  title='Discordトークンをブロックする'
                  description='Discordアカウントのトークンを含むメッセージを自動で削除します。'
                  isDisabled={!enabled}
                />
                <FormControl>
                  <Switch
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    isSelected={value}
                    isDisabled={!enabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </AccordionItem>
        <AccordionItem
          title='ドメイン'
          startContent={<IconifyIcon icon='solar:global-bold' className='text-[20px]' />}
        >
          <FormField
            control={form.control}
            name='filter.domain.enabled'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormItem dir='row'>
                <FormLabel
                  title='特定のドメインをブロックする'
                  description='特定のドメインのURLを含むメッセージを自動で削除します。'
                  isDisabled={!enabled}
                />
                <FormControl>
                  <Switch
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    isSelected={value}
                    isDisabled={!enabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='filter.domain.list'
            render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
              <FormItem dir='col'>
                <FormLabel
                  title='ブロックするドメイン'
                  description='ドメインはカンマ（例: nonick-js.com, discord.com）または改行で区分してください。'
                  isDisabled={!enabled || !domainFilterEnabled}
                />
                <FormControl>
                  <Textarea
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={Array.isArray(value) ? value.join(', ') : String(value)}
                    classNames={{
                      inputWrapper: 'bg-content1',
                      innerWrapper: 'flex-col items-end',
                    }}
                    variant='bordered'
                    endContent={
                      <span className={cn('text-default-500 text-sm', { 'text-danger': invalid })}>
                        {
                          String(value)
                            .split(/,|\n/)
                            .map((v) => v.trim())
                            .filter((v) => !!v).length
                        }
                        /20
                      </span>
                    }
                    isInvalid={invalid}
                    isDisabled={!enabled || !domainFilterEnabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </AccordionItem>
      </Accordion>
    </FormCard>
  );
}

function IgnoreConfigForm() {
  const form = useFormContext<InputConfig>();
  const disabled = !useWatch<InputConfig>({ name: 'enabled' });
  const { channels, roles } = useContext(PropsContext);
  const { guildId } = useParams<{ guildId: string }>();

  return (
    <FormCard title='例外設定'>
      <Alert variant='info' className={cn({ 'opacity-disabled': disabled })}>
        <AlertTitle>
          Botや「サーバー管理」権限を持っているユーザーは、この設定に関わらずフィルターが適用されません。
        </AlertTitle>
      </Alert>
      <FormField
        control={form.control}
        name='ignore.channels'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='フィルターを適用しないチャンネル'
              description='選択したチャンネルのスレッドもフィルターが適用されなくなります。'
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
                types={{ exclude: [ChannelType.GuildCategory] }}
                isInvalid={invalid}
                isDisabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignore.roles'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='フィルターを適用しないロール' isDisabled={disabled} />
            <FormControl>
              <RoleSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                items={roles}
                selectedKeys={value.filter((id) => roles.some((role) => role.id === id))}
                selectionMode='multiple'
                disabledKeyFilter={(role) => role.id === guildId}
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

function LogConfigForm() {
  const form = useFormContext<InputConfig>();
  const { channels } = useContext(PropsContext);
  const enabled = useWatch<InputConfig>({ name: 'enabled' });
  const logEnabled = useWatch<InputConfig>({ name: 'log.enabled' });

  return (
    <FormCard title='ログ設定'>
      <FormField
        control={form.control}
        name='log.enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='ログを有効にする'
              description='フィルターによってメッセージが削除された際にログを送信します。'
              isDisabled={!enabled}
            />
            <FormControl>
              <Switch
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                isSelected={value}
                isDisabled={!enabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='log.channel'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='ログを送信するチャンネル'
              isDisabled={!enabled || !logEnabled}
              isRequired
            />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                selectedKeys={value ? [value] : []}
                items={channels}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isDisabled={!enabled || !logEnabled}
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
