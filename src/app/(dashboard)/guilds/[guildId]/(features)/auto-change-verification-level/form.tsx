'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { IconifyIcon } from '@/components/iconify-icon';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AutoChangeVerifyLevelConfig } from '@/lib/database/zod';
import type { getChannels } from '@/lib/discord';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, type InputProps } from '@nextui-org/input';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { Switch } from '@nextui-org/switch';
import { cn } from '@nextui-org/theme';
import { ChannelType, GuildVerificationLevel } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import React, { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { updateConfig } from './action';

// #region Types, Context
type InputConfig = z.input<typeof AutoChangeVerifyLevelConfig>;
type OutputConfig = z.output<typeof AutoChangeVerifyLevelConfig>;

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
    resolver: zodResolver(AutoChangeVerifyLevelConfig),
    defaultValues: config ?? {
      enabled: false,
      level: GuildVerificationLevel.Low,
      startHour: 0,
      endHour: 6,
      log: {
        enabled: false,
        channel: null,
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
            <FormLabel title='自動認証レベル変更を有効にする' />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

const HourInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      className='max-sm:w-[120px] w-[150px]'
      type='number'
      variant='bordered'
      startContent={
        <IconifyIcon
          className='text-[20px] text-foreground-500 group-data-[invalid=true]:text-danger-400'
          icon='solar:clock-circle-bold'
        />
      }
      endContent={
        <span className='text-small text-foreground-500 group-data-[invalid=true]:text-danger-400'>
          :00
        </span>
      }
      {...props}
    />
  );
});

function CustomRadioClassName(color: Omit<GuildVerificationLevel, 'None'>) {
  return {
    base: cn(
      'inline-flex m-0 bg-default-100 hover:bg-default-100/80 items-center justify-between w-full max-w-none',
      'w-full cursor-pointer rounded-lg gap-2 px-4 py-3 border-2 border-transparent',
      'data-[selected=true]:border-primary',
    ),
    label: cn(
      { 'text-green-500': color === GuildVerificationLevel.Low },
      { 'text-yellow-500': color === GuildVerificationLevel.Medium },
      { 'text-orange-500': color === GuildVerificationLevel.High },
      { 'text-red-500': color === GuildVerificationLevel.VeryHigh },
    ),
    description: 'text-default-500',
    labelWrapper: 'flex-1',
  };
}

function GeneralConfigForm() {
  const form = useFormContext<InputConfig>();
  const disabled = !useWatch<OutputConfig>();

  return (
    <FormCard title='全般設定'>
      <div className='flex flex-col gap-3'>
        <FormField
          control={form.control}
          name='startHour'
          render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
            <FormItem dir='row'>
              <FormLabel title='開始時間（0:00～23:00）' isRequired isDisabled={disabled} />
              <FormControl>
                <HourInput
                  ref={ref}
                  onChange={onChange}
                  value={String(value)}
                  isInvalid={invalid}
                  isDisabled={disabled}
                  isRequired
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endHour'
          render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
            <FormItem dir='row'>
              <FormLabel title='終了時間（0:00～23:00）' isRequired isDisabled={disabled} />
              <FormControl>
                <HourInput
                  ref={ref}
                  onChange={onChange}
                  value={String(value)}
                  isInvalid={invalid}
                  isDisabled={disabled}
                  isRequired
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name='level'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem className='gap-4' dir='col'>
            <FormLabel title='期間内に設定する認証レベル' isRequired isDisabled={disabled} />
            <FormControl>
              <RadioGroup
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                value={String(value)}
                isInvalid={invalid}
                isDisabled={disabled}
              >
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.Low)}
                  value={String(GuildVerificationLevel.Low)}
                  description='メール認証がされているアカウントのみ'
                >
                  低
                </Radio>
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.Medium)}
                  value={String(GuildVerificationLevel.Medium)}
                  description='Discordに登録してから5分以上経過したアカウントのみ'
                >
                  中
                </Radio>
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.High)}
                  value={String(GuildVerificationLevel.High)}
                  description='このサーバーのメンバーとなってから10分以上経過したアカウントのみ'
                >
                  高
                </Radio>
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.VeryHigh)}
                  value={String(GuildVerificationLevel.VeryHigh)}
                  description='電話認証がされているアカウントのみ'
                >
                  最高
                </Radio>
              </RadioGroup>
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
              description='自動変更の開始・終了時にログを送信します。'
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
