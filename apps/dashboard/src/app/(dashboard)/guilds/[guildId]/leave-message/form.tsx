'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@repo/ui/components/field';
import { Switch } from '@repo/ui/components/switch';
import { Textarea } from '@repo/ui/components/textarea';
import { cn } from '@repo/ui/lib/utils';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { CheckIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Controller, FormProvider, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ChannelSelect } from '@/components/channel-select';
import { FormChangePublisher, FormDevTool } from '@/components/form';
import { updateSettingAction } from './action';
import { formSchema } from './schema';

type FormProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  setting?: z.infer<typeof formSchema>;
};

export function SettingForm({ channels, setting }: FormProps) {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]/leave-message'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      enabled: false,
      channel: null,
      ignoreBot: false,
      message: {
        content: '**![userTag]** さんがサーバーを退室しました👋',
      },
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
                      <FieldLabel htmlFor={field.name}>入室メッセージを有効にする</FieldLabel>
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
                render={([enabled]) => (
                  <>
                    <Controller
                      control={form.control}
                      name='channel'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>
                              メッセージを送信するチャンネル
                            </FieldLabel>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <ChannelSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            className='sm:max-w-xs sm:min-w-xs'
                            channels={channels}
                            includeChannelTypes={[ChannelType.GuildText]}
                            disabled={!enabled}
                          />
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='ignoreBot'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='horizontal'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>
                              BOT入室時にメッセージを送信しない
                            </FieldLabel>
                            <FieldDescription>
                              有効にすると、BOTがサーバーに追加された際にメッセージが送信されないようになります。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <Switch
                            ref={field.ref}
                            id={field.name}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!enabled}
                          />
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
            <CardTitle>メッセージ設定</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Alert variant='primary'>
                <InfoIcon />
                <AlertTitle>
                  プレースホルダーを使用してメッセージに動的な値を追加できます。
                </AlertTitle>
                <AlertDescription>
                  <span>
                    詳細は
                    <Button variant='link' className='h-auto p-0' asChild>
                      <Link
                        href='https://docs.nonick-js.com/features/welcome-message'
                        target='_blank'
                      >
                        ドキュメント
                      </Link>
                    </Button>
                    を参照してください。
                  </span>
                </AlertDescription>
              </Alert>
              <Watch
                control={form.control}
                names={['enabled']}
                render={([enabled]) => (
                  <Card className={cn({ 'opacity-50': !enabled })}>
                    <CardContent>
                      <div className='flex gap-3'>
                        <Avatar className='size-10'>
                          <AvatarImage src='/icon_300.png' alt='NoNICK.js' />
                          <AvatarFallback>No</AvatarFallback>
                        </Avatar>
                        <div className='flex-1 flex flex-col gap-2'>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium'>NoNICK.js</p>
                            <Badge className='h-5 mt-0.5 bg-[#5865F2] gap-0.5 px-1.5'>
                              <CheckIcon className='mt-0.5' />
                              アプリ
                            </Badge>
                          </div>
                          <Controller
                            control={form.control}
                            name='message.content'
                            render={({ field, fieldState }) => (
                              <>
                                <Textarea
                                  {...field}
                                  id={field.name}
                                  aria-invalid={fieldState.invalid}
                                  disabled={!enabled}
                                  className='min-h-[120px] sm:max-w-xl'
                                  placeholder='メッセージを入力'
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
