'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  type APIGuildChannel,
  ChannelType,
  type GuildChannelType,
  GuildVerificationLevel,
} from 'discord-api-types/v10';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Controller, FormProvider, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ChannelSelect } from '@/components/channel-select';
import { FormChangePublisher, FormDevTool } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { updateSettingAction } from './action';
import { HourSelect } from './hour-select';
import { formSchema } from './schema';

type FormProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  setting?: z.infer<typeof formSchema>;
};

export function SettingForm({ channels, setting }: FormProps) {
  const { guildId } =
    useParams<Awaited<PageProps<'/guilds/[guildId]/auto-change-verification-level'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      enabled: false,
      startHour: 0,
      endHour: 6,
      level: GuildVerificationLevel.Low,
      enableLog: false,
      logChannel: null,
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
                    <FieldContent aria-disabled>
                      <FieldLabel htmlFor={field.name}>自動認証レベル変更を有効にする</FieldLabel>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                    <Switch
                      id={field.name}
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
                      name='startHour'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>開始時間</FieldLabel>
                            <FieldDescription>この時間に認証レベルを変更します。</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <HourSelect
                            className='sm:max-w-[300px] sm:min-w-[300px]'
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={!enabled}
                          />
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='endHour'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>終了時間</FieldLabel>
                            <FieldDescription>
                              この時間に認証レベルを元のレベルに戻します。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <HourSelect
                            className='sm:max-w-[300px] sm:min-w-[300px]'
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={!enabled}
                          />
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='level'
                      render={({ field, fieldState }) => (
                        <Field
                          // className='@md/field-group:items-start'
                          data-invalid={fieldState.invalid}
                          orientation='responsive'
                          data-disabled={!enabled}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>認証レベル</FieldLabel>
                            <FieldDescription>
                              この認証レベルが期間内に設定されます。認証レベルに関する詳しい情報は
                              <Button className='p-0 h-auto' variant='link' asChild>
                                <Link
                                  href='https://support.discord.com/hc/ja/articles/216679607'
                                  target='_blank'
                                >
                                  こちら
                                </Link>
                              </Button>
                              を参照してください。
                            </FieldDescription>
                          </FieldContent>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <SelectTrigger
                              className='sm:min-w-[400px] sm:max-w-[400px] min-h-16'
                              disabled={!enabled}
                            >
                              <SelectValue placeholder='認証レベルを選択' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={GuildVerificationLevel.Low.toString()}>
                                <span className='flex flex-col gap-px'>
                                  <span className='flex items-center gap-2'>
                                    <span className='size-1.5 rounded-full bg-green-500' />
                                    <span>低</span>
                                  </span>
                                  <span className='text-muted-foreground text-xs'>
                                    メール認証がされているアカウントのみ
                                  </span>
                                </span>
                              </SelectItem>
                              <SelectItem value={GuildVerificationLevel.Medium.toString()}>
                                <span className='flex flex-col gap-px'>
                                  <span className='flex items-center gap-2'>
                                    <span className='size-1.5 rounded-full bg-yellow-500' />
                                    <span>中</span>
                                  </span>
                                  <span className='text-muted-foreground text-xs'>
                                    Discordに登録してから5分以上経過したアカウントのみ
                                  </span>
                                </span>
                              </SelectItem>
                              <SelectItem value={GuildVerificationLevel.High.toString()}>
                                <span className='flex flex-col gap-px'>
                                  <span className='flex items-center gap-2'>
                                    <span className='size-1.5 rounded-full bg-orange-500' />
                                    <span>高</span>
                                  </span>
                                  <span className='text-muted-foreground text-xs'>
                                    このサーバーに参加してから10分以上経過したアカウントのみ
                                  </span>
                                </span>
                              </SelectItem>
                              <SelectItem value={GuildVerificationLevel.VeryHigh.toString()}>
                                <span className='flex flex-col gap-px'>
                                  <span className='flex items-center gap-2'>
                                    <span className='size-1.5 rounded-full bg-red-500' />
                                    <span>最高</span>
                                  </span>
                                  <span className='text-muted-foreground text-xs'>
                                    電話認証がされているアカウントのみ
                                  </span>
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ログ設定</CardTitle>
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
                      name='enableLog'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='horizontal'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>ログを有効にする</FieldLabel>
                            <FieldDescription>
                              自動変更が開始・終了した際にログを送信します。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <Switch
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!enabled}
                          />
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Watch
                      control={form.control}
                      names={['enableLog']}
                      render={([enableLog]: [boolean]) => (
                        <Controller
                          control={form.control}
                          name='logChannel'
                          render={({ field, fieldState }) => (
                            <Field
                              data-invalid={fieldState.invalid}
                              data-disabled={!enabled || !enableLog}
                              data-required
                              orientation='responsive'
                            >
                              <FieldContent>
                                <FieldLabel htmlFor={field.name}>
                                  ログを送信するチャンネル
                                </FieldLabel>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </FieldContent>
                              <ChannelSelect
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className='sm:max-w-[300px] sm:min-w-[300px]'
                                channels={channels}
                                value={field.value}
                                onValueChange={field.onChange}
                                includeChannelTypes={[ChannelType.GuildText]}
                                disabled={!enabled || !enableLog}
                              />
                            </Field>
                          )}
                        />
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
