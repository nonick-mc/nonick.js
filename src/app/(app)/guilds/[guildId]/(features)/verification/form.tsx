'use client';

import { FormCard } from '@/components/form';
import { FormChangePublisher } from '@/components/react-hook-form/change-publisher';
import { FormDevTool } from '@/components/react-hook-form/devtool';
import { RoleSelect } from '@/components/react-hook-form/role-select';
import { ControlledForm } from '@/components/react-hook-form/ui/form';
import { ControlledRadioGroup } from '@/components/react-hook-form/ui/radio';
import { ControlledSwitch } from '@/components/react-hook-form/ui/switch';
import { Radio, type RadioProps, addToast, cn } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { APIRole } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import { type SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { updateVerificationSettingAction } from './action';
import { verificationSettingFormSchema } from './schema';

type InputSetting = z.input<typeof verificationSettingFormSchema>;
type OutputSetting = z.output<typeof verificationSettingFormSchema>;

type Props = {
  roles: APIRole[];
  highestRolePosition: number;
  setting: OutputSetting | null;
};

const PropsContext = createContext<Omit<Props, 'setting' | 'highestRole'>>({
  roles: [],
  highestRolePosition: 0,
});

export function SettingForm({ setting, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSetting, unknown, OutputSetting>({
    resolver: zodResolver(verificationSettingFormSchema),
    defaultValues: {
      enabled: !!setting?.enabled,
      role: setting?.role ?? null,
      captchaType: setting?.captchaType ?? 'web',
    },
  });

  const onSubmit: SubmitHandler<OutputSetting> = async (values) => {
    const res = await updateVerificationSettingAction({ guildId, ...values });
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
        <FormChangePublisher />
        <FormDevTool />
      </ControlledForm>
    </PropsContext>
  );
}

function EnableSetting() {
  const { control } = useFormContext<InputSetting>();

  return (
    <FormCard bodyClass='gap-6'>
      <ControlledSwitch control={control} name='enabled' label='メンバー認証を有効にする' />
    </FormCard>
  );
}

function GeneralSetting() {
  const { roles, highestRolePosition } = useContext(PropsContext);
  const { control } = useFormContext<InputSetting>();
  const { guildId } = useParams<{ guildId: string }>();
  const isEnabled = useWatch<InputSetting>({ name: 'enabled' });

  return (
    <FormCard title='基本設定'>
      <RoleSelect
        control={control}
        name='role'
        roles={roles}
        label='認証成功時に付与するロール'
        description='NoNICK.jsが所持しているロールより高い位置にあるロールを選択できます。'
        disableItemFilter={(role) =>
          role.managed || role.id === guildId || role.position > highestRolePosition
        }
        disallowEmptySelection
        isRequired
        isDisabled={!isEnabled}
      />
      <ControlledRadioGroup
        control={control}
        name='captchaType'
        label='認証方法'
        isDisabled={!isEnabled}
        isRequired
      >
        <CustomRadio
          description='ユーザーは認証サイトにログインし、Cloudflare Turnstile検証を行うことでロールを取得することができます。'
          value='web'
        >
          Web認証
        </CustomRadio>
        <CustomRadio
          description='認証を開始するとユーザーのDMに画像が送信されます。画像内に含まれる文字列を入力することでロールを取得することができます。'
          value='image'
        >
          画像認証
        </CustomRadio>
        <CustomRadio
          description='ユーザーは認証パネルにあるボタンを押すことでロールを取得することができます。'
          value='button'
        >
          ボタン（非推奨）
        </CustomRadio>
      </ControlledRadioGroup>
    </FormCard>
  );
}

function CustomRadio(props: RadioProps) {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-default-100 hover:bg-default-200 items-center justify-between',
          'w-full max-w-none cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary transition-background',
        ),
        label: 'text-sm font-semibold',
        description: 'text-sm text-foreground-500',
        labelWrapper: 'flex-1 text-sm',
      }}
    >
      {children}
    </Radio>
  );
}
