'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { autoCreateThreadRule } from '@repo/database';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Spinner } from '@repo/ui/components/spinner';
import { Switch } from '@repo/ui/components/switch';
import {
  type APIGuildChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
  ThreadAutoArchiveDuration,
} from 'discord-api-types/v10';
import type { InferSelectModel } from 'drizzle-orm';
import { CheckIcon, ExternalLinkIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { ChannelSelect } from '@/components/channel-select';
import { FormDevTool } from '@/components/form';
import { RoleSelect } from '@/components/role-select';
import { createRuleAction } from '../action';
import { ArchiveDurationOptions, RulesMaxSize } from '../constants';
import { createRuleFormSchema } from '../schema';

type CreateRuleDialogProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  rules: InferSelectModel<typeof autoCreateThreadRule>[];
};

export function CreateRuleDialog({ channels, roles, rules }: CreateRuleDialogProps) {
  const { guildId } = useParams<{ guildId: string }>();
  const bindCreateRuleAction = createRuleAction.bind(null, guildId);
  const [open, onOpenChange] = useState(false);

  const form = useForm({
    resolver: zodResolver(createRuleFormSchema),
    defaultValues: {
      channelId: '',
      threadName: '![displayName]のスレッド',
      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
      ignoreBot: true,
      ignoreRoles: [],
    },
  });

  async function onSubmit(values: z.infer<typeof createRuleFormSchema>) {
    const res = await bindCreateRuleAction(values);
    if (res.serverError || res.validationErrors) {
      return toast.error(
        'チャンネルの追加中に問題が発生しました。時間をおいて再度お試しください。',
      );
    }
    onOpenChange(false);
    toast.success('チャンネルを追加しました。');
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm' disabled={rules.length >= RulesMaxSize}>
          <PlusIcon />
          チャンネルを追加
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>チャンネルを追加</DialogTitle>
              <DialogDescription>
                自動スレッド作成を適用するチャンネルを追加します。
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className='py-8'>
              <Controller
                control={form.control}
                name='channelId'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>チャンネル</FieldLabel>
                    <ChannelSelect
                      ref={field.ref}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value}
                      onValueChange={field.onChange}
                      channels={channels}
                      includeChannelTypes={[ChannelType.GuildText]}
                      disabledItemFilter={(channel) =>
                        rules.some((rule) => rule.channelId === channel.id)
                      }
                      modal
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />
              <FieldSeparator />
              <Controller
                control={form.control}
                name='threadName'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>作成するスレッドの名前</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='スレッドの名前を入力'
                    />
                    <FieldDescription>
                      <span>
                        <Link
                          className='inline-flex items-center text-primary hover:underline'
                          href='https://nonick-js.com/docs/features/auto-create-thread#プレースホルダー'
                          target='_blank'
                        >
                          プレースホルダー
                          <ExternalLinkIcon className='size-4' />
                        </Link>
                        を使用して、動的な値を埋め込むことができます。
                      </span>
                    </FieldDescription>
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />
              <FieldSeparator />
              <Controller
                control={form.control}
                name='autoArchiveDuration'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>スレッドの自動アーカイブ時間</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder='期間を選択' />
                      </SelectTrigger>
                      <SelectContent>
                        {ArchiveDurationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      指定した期間アクティブでなかったスレッドはアーカイブされます。
                    </FieldDescription>
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />
              <FieldSeparator />
              <Controller
                control={form.control}
                name='ignoreBot'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        BotやWebhookが送信したメッセージを除外する
                      </FieldLabel>
                      <FieldDescription>
                        NoNICK.jsから送信されたメッセージは常に除外されます。
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      ref={field.ref}
                      id={field.name}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />
              <FieldSeparator />
              <Controller
                control={form.control}
                name='ignoreRoles'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>スレッド作成を除外するロール</FieldLabel>
                    <RoleSelect
                      ref={field.ref}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value}
                      onValueChange={field.onChange}
                      roles={roles}
                      disabledItemFilter={(role) => role.id === guildId}
                      modal
                    />
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                キャンセル
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : <CheckIcon />}
                作成
              </Button>
            </DialogFooter>
          </form>
          <FormDevTool />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
