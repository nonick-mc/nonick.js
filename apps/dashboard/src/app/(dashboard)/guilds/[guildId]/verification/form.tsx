'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { APIRole } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { Controller, FormProvider, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { FormChangePublisher, FormDevTool } from '@/components/form';
import { RoleSelect } from '@/components/role-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { updateSettingAction } from './action';
import { formSchema } from './schema';

type FormProps = {
  roles: APIRole[];
  botHighestRolePosition: number;
  setting?: z.infer<typeof formSchema>;
};

export const captchaTypeOptions = [
  {
    label: 'Web認証',
    description:
      'ユーザーは認証サイトにログインし、Cloudflare Turnstile検証を行うことでロールを取得することができます。',
    value: 'web',
  },
  {
    label: '画像認証',
    description:
      'ユーザーはDMに送信された画像を確認し、画像内の認証コードを入力することでロールを取得することができます。',
    value: 'image',
  },
  {
    label: 'ボタン',
    description: 'ユーザーは認証パネルにあるボタンを押すことでロールを取得することができます。',
    value: 'button',
  },
] as const;

export function SettingForm({ roles, botHighestRolePosition, setting }: FormProps) {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]/verification'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      enabled: false,
      role: null,
      captchaType: 'web',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await bindUpdateSettingAction(values);
    if (res.serverError || res.validationErrors) {
      return toast.error('設定の更新中に問題が発生しました。時間をおいて再度お試しください。');
    }
    form.reset(values);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 pb-24'>
        <Card>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name='enabled'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>メンバー認証を有効にする</FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      ref={field.ref}
                      id={field.name}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>全般設定</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Watch
                control={form.control}
                names={['enabled']}
                render={([enabled]: [boolean]) => (
                  <>
                    <Controller
                      control={form.control}
                      name='role'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>認証成功時に付与するロール</FieldLabel>
                            <FieldDescription>
                              NoNICK.jsが所持しているロールより高い位置にあるロールを選択できます。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <RoleSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            className='sm:max-w-xs sm:min-w-xs'
                            roles={roles}
                            disabled={!enabled}
                            disabledItemFilter={(role) =>
                              role.managed ||
                              role.id === guildId ||
                              role.position > botHighestRolePosition
                            }
                          />
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='captchaType'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>認証方法</FieldLabel>
                            <FieldDescription>
                              ユーザーが認証に使用する方式を変更できます。
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroup
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            className='sm:max-w-md sm:min-w-md'
                            disabled={!enabled}
                          >
                            {captchaTypeOptions.map((option) => (
                              <FieldLabel key={option.value} id={`${field.name}-${option.value}`}>
                                <Field orientation='horizontal' data-invalid={fieldState.invalid}>
                                  <RadioGroupItem
                                    value={option.value}
                                    id={`${field.name}-${option.value}`}
                                    aria-invalid={fieldState.invalid}
                                  />
                                  <FieldContent>
                                    <FieldTitle>{option.label}</FieldTitle>
                                    <FieldDescription className='text-xs'>
                                      {option.description}
                                    </FieldDescription>
                                  </FieldContent>
                                </Field>
                              </FieldLabel>
                            ))}
                          </RadioGroup>
                        </Field>
                      )}
                    />
                  </>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <FormChangePublisher />
      </form>
      <FormDevTool />
    </FormProvider>
  );
}
