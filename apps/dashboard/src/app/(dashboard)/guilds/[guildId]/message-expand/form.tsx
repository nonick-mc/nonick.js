'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { MegaphoneIcon, SpoolIcon, Volume2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Controller, FormProvider, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ChannelSelect } from '@/components/channel-select';
import { FormChangePublisher, FormDevTool } from '@/components/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { updateSettingAction } from './action';
import { PrefixSelect } from './prefix-select';
import { formSchema } from './schema';

type FormProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  setting?: z.infer<typeof formSchema>;
};

const IgnoreChannelTypesOptions = [
  { label: 'アナウンスチャンネル', value: ChannelType.GuildAnnouncement, icon: MegaphoneIcon },
  { label: 'ボイスチャンネル', value: ChannelType.GuildVoice, icon: Volume2Icon },
  { label: '公開スレッド', value: ChannelType.PublicThread, icon: SpoolIcon },
  { label: 'プライベートスレッド', value: ChannelType.PrivateThread, icon: SpoolIcon },
];

export function SettingForm({ channels, setting }: FormProps) {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]/message-expand'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      enabled: false,
      allowExternalGuild: false,
      ignoreChannels: [],
      ignoreChannelTypes: [],
      ignorePrefixes: [],
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
                      <FieldLabel htmlFor={field.name}>メッセージURL展開を有効にする</FieldLabel>
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
                  <Controller
                    control={form.control}
                    name='allowExternalGuild'
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        data-disabled={!enabled}
                        orientation='horizontal'
                      >
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>
                            このサーバーのメッセージを他のサーバーで展開することを許可する
                          </FieldLabel>
                          <FieldDescription>
                            有効にすると、このサーバーのメッセージURLが他のサーバーでも展開されるようになります。
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
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>例外設定</CardTitle>
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
                      name='ignoreChannelTypes'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>除外するチャンネルの種類</FieldLabel>
                            <FieldDescription>
                              特定の種類のチャンネルでURLが展開されないようにします。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <FieldGroup data-slot='checkbox-group' className='sm:min-w-[200px]'>
                            {IgnoreChannelTypesOptions.map((option) => (
                              <Field
                                key={option.value}
                                data-invalid={fieldState.invalid}
                                data-disabled={!enabled}
                                orientation='horizontal'
                              >
                                <Checkbox
                                  ref={field.ref}
                                  id={`${field.name}-${option.value}`}
                                  name={field.name}
                                  aria-invalid={fieldState.invalid}
                                  checked={field.value.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const newValues = checked
                                      ? [...field.value, option.value]
                                      : field.value.filter((value) => value !== option.value);
                                    field.onChange(newValues.sort());
                                  }}
                                  disabled={!enabled}
                                />
                                <FieldLabel htmlFor={`${field.name}-${option.value}`}>
                                  <option.icon className='size-4 text-muted-foreground' />
                                  {option.label}
                                </FieldLabel>
                              </Field>
                            ))}
                          </FieldGroup>
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='ignoreChannels'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>除外するチャンネル</FieldLabel>
                            <FieldDescription>
                              特定のチャンネルでURLが展開されないようにします。
                              <br />
                              この設定は設定したチャンネルのスレッドにも適用されます。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <ChannelSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            className='sm:max-w-sm sm:min-w-sm'
                            channels={channels}
                            excludeChannelTypes={[ChannelType.GuildCategory]}
                            disabled={!enabled}
                          />
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='ignorePrefixes'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>プレフィックス</FieldLabel>
                            <FieldDescription>
                              URLの前にこれらの記号がある場合に展開が行われないようにします。（5つまで選択可）
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <PrefixSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            className='sm:max-w-xs sm:min-w-xs'
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
        <FormChangePublisher />
      </form>
      <FormDevTool />
    </FormProvider>
  );
}
