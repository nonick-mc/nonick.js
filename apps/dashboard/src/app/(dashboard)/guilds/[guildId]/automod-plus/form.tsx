'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@repo/ui/components/alert';
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@repo/ui/components/input-group';
import { Switch } from '@repo/ui/components/switch';
import {
  type APIGuildChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';
import { CircleAlertIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Controller, FormProvider, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { ChannelSelect } from '@/components/channel-select';
import { FormChangePublisher, FormDevTool } from '@/components/form';
import { RoleSelect } from '@/components/role-select';
import { updateSettingAction } from './action';
import { formSchema, parseDomainList } from './schema';

type FormProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  setting?: z.infer<typeof formSchema>;
};

export function SettingForm({ channels, roles, setting }: FormProps) {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]/automod-plus'>['params']>>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: setting || {
      enabled: false,
      enableInviteUrlFilter: false,
      enableTokenFilter: false,
      enableDomainFilter: false,
      domainList: [],
      ignoreChannels: [],
      ignoreRoles: [],
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
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>AutoMod Plusを有効にする</FieldLabel>
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
            <CardTitle>フィルター設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2'>
              <Watch
                control={form.control}
                names={['enabled']}
                render={([enabled]) => (
                  <>
                    <Card className='py-4'>
                      <CardContent className='px-4'>
                        <FieldGroup>
                          <Controller
                            control={form.control}
                            name='enableInviteUrlFilter'
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                data-disabled={!enabled}
                                orientation='horizontal'
                              >
                                <FieldContent>
                                  <FieldLabel htmlFor={field.name}>
                                    招待リンクをブロックする
                                  </FieldLabel>
                                  <FieldDescription>
                                    このDiscordサーバー以外の招待リンクを含むメッセージを自動で削除します。
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
                        </FieldGroup>
                      </CardContent>
                    </Card>
                    <Card className='py-4'>
                      <CardContent className='px-4'>
                        <FieldGroup>
                          <Controller
                            control={form.control}
                            name='enableTokenFilter'
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                data-disabled={!enabled}
                                orientation='horizontal'
                              >
                                <FieldContent>
                                  <FieldLabel htmlFor={field.name}>
                                    Discordトークンをブロックする
                                  </FieldLabel>
                                  <FieldDescription>
                                    Discordアカウントのトークンを含むメッセージを自動で削除します。
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
                        </FieldGroup>
                      </CardContent>
                    </Card>
                    <Card className='py-4'>
                      <CardContent className='px-4'>
                        <FieldGroup className='gap-4'>
                          <Controller
                            control={form.control}
                            name='enableDomainFilter'
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                data-disabled={!enabled}
                                orientation='horizontal'
                              >
                                <FieldContent>
                                  <FieldLabel htmlFor={field.name}>
                                    特定のドメインをブロックする
                                  </FieldLabel>
                                  <FieldDescription>
                                    特定のドメインのURLを含むメッセージを自動で削除します。
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
                          <FieldSeparator />
                          <Watch
                            control={form.control}
                            names={['enableDomainFilter']}
                            render={([enableDomainFilter]) => (
                              <Controller
                                control={form.control}
                                name='domainList'
                                render={({ field, fieldState }) => (
                                  <Field
                                    data-invalid={fieldState.invalid}
                                    data-disabled={!enabled || !enableDomainFilter}
                                    orientation='responsive'
                                  >
                                    <FieldContent>
                                      <FieldLabel htmlFor={field.name}>
                                        ブロックするドメイン
                                      </FieldLabel>
                                      <FieldDescription>
                                        複数のドメインをブロックする場合はカンマ、または改行で区分してください。
                                      </FieldDescription>
                                      {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                    </FieldContent>
                                    <InputGroup className='sm:min-w-md'>
                                      <InputGroupTextarea
                                        {...field}
                                        id={field.name}
                                        value={
                                          Array.isArray(field.value)
                                            ? field.value.join(', ')
                                            : String(field.value)
                                        }
                                        aria-invalid={fieldState.invalid}
                                        placeholder='example.com, example.org'
                                        disabled={!enabled || !enableDomainFilter}
                                      />
                                      <InputGroupAddon align='block-end'>
                                        <InputGroupText className='ml-auto'>
                                          <span>
                                            <Watch
                                              control={form.control}
                                              names={['domainList']}
                                              render={([domainList]) => (
                                                <>{parseDomainList(domainList).length}</>
                                              )}
                                            />
                                            /20
                                          </span>
                                        </InputGroupText>
                                      </InputGroupAddon>
                                    </InputGroup>
                                  </Field>
                                )}
                              />
                            )}
                          />
                        </FieldGroup>
                      </CardContent>
                    </Card>
                  </>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>例外設定</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-8'>
            <Alert variant='primary'>
              <CircleAlertIcon />
              <AlertDescription className='text-card-foreground'>
                BOTや「サーバー管理」権限を持っているユーザーは、設定に関わらず全てのフィルターが適用されません。
              </AlertDescription>
            </Alert>
            <FieldGroup>
              <Watch
                control={form.control}
                names={['enabled']}
                render={([enabled]) => (
                  <>
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
                              この設定はチャンネルのスレッドにも適用されます。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <ChannelSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            className='sm:min-w-sm sm:max-w-sm'
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
                      name='ignoreRoles'
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          data-disabled={!enabled}
                          orientation='responsive'
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>除外するロール</FieldLabel>
                            <FieldDescription>
                              設定したロールが付与されているユーザーはフィルターが適用されなくなります。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <RoleSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            className='sm:min-w-sm sm:max-w-sm'
                            roles={roles}
                            disabled={!enabled}
                            disabledItemFilter={(role) => role.id === guildId}
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
            <CardTitle>ログ設定</CardTitle>
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
                      name='enableLog'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>ログを有効にする</FieldLabel>
                            <FieldDescription>
                              フィルターによってメッセージが削除された際にログを送信します。
                            </FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                          <Switch
                            ref={field.ref}
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
                      render={([enableLog]) => (
                        <Controller
                          control={form.control}
                          name='logChannel'
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} orientation='responsive'>
                              <FieldContent>
                                <FieldLabel htmlFor={field.name}>
                                  ログを送信するチャンネル
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
