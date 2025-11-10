'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@repo/ui/components/field';
import { Switch } from '@repo/ui/components/switch';
import type { APIGuildChannel, GuildChannelType } from 'discord-api-types/v10';
import { ChannelType } from 'discord-api-types/v10';
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
  const { guildId } =
    useParams<Awaited<PageProps<'/guilds/[guildId]/event-log/voice'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      enabled: false,
      channel: null,
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
                      <FieldLabel htmlFor={field.name}>ボイスチャットログを有効にする</FieldLabel>
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
            <CardTitle>チャンネル設定</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Watch
                control={form.control}
                names={['enabled']}
                render={([enabled]: [boolean]) => (
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
                          <FieldLabel htmlFor={field.name}>ログを送信するチャンネル</FieldLabel>
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
