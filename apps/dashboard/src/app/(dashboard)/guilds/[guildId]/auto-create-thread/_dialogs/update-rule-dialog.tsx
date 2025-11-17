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
import type { APIRole } from 'discord-api-types/v10';
import type { InferSelectModel } from 'drizzle-orm';
import { ExternalLinkIcon, PencilIcon, SaveIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';
import { FormDevTool } from '@/components/form';
import { RoleSelect } from '@/components/role-select';
import { updateRuleAction } from '../action';
import { ArchiveDurationOptions } from '../constants';
import { updateRuleFormSchema } from '../schema';

type UpdateRuleDialogProps = {
  targetChannelName: string;
  roles: APIRole[];
  rule: InferSelectModel<typeof autoCreateThreadRule>;
  disabled?: boolean;
};

export function UpdateRuleDialog({
  targetChannelName,
  roles,
  rule,
  disabled,
}: UpdateRuleDialogProps) {
  const bindUpdateRuleAction = updateRuleAction.bind(null, rule.guildId, rule.channelId);
  const [open, onOpenChange] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateRuleFormSchema),
    defaultValues: {
      enabled: rule.enabled,
      threadName: rule.threadName,
      autoArchiveDuration: rule.autoArchiveDuration,
      ignoreBot: rule.ignoreBot,
      ignoreRoles: rule.ignoreRoles,
    },
  });

  async function onSubmit(values: z.infer<typeof updateRuleFormSchema>) {
    const res = await bindUpdateRuleAction(values);
    if (res.serverError || res.validationErrors) {
      return toast.error('設定の更新中に問題が発生しました。時間をおいて再度お試しください。');
    }
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) {
      form.reset(rule);
    }
  }, [open, form, rule]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon' disabled={disabled}>
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>「#{targetChannelName}」の設定</DialogTitle>
              <DialogDescription>自動スレッド作成の動作を変更します。</DialogDescription>
            </DialogHeader>
            <FieldGroup className='py-8'>
              <Controller
                control={form.control}
                name='enabled'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation='horizontal'>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        このチャンネルで自動スレッド作成を有効にする
                      </FieldLabel>
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
              <FieldSeparator />
              <Watch
                control={form.control}
                names={['enabled']}
                render={([enabled]) => (
                  <>
                    <Controller
                      control={form.control}
                      name='threadName'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} data-disabled={!enabled}>
                          <FieldLabel htmlFor={field.name}>作成するスレッドの名前</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder='スレッドの名前を入力'
                            disabled={!enabled}
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
                        <Field data-invalid={fieldState.invalid} data-disabled={!enabled}>
                          <FieldLabel htmlFor={field.name}>スレッドの自動アーカイブ時間</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.value.toString()}
                            onValueChange={(value) => field.onChange(Number(value))}
                          >
                            <SelectTrigger
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              disabled={!enabled}
                            >
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
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation='horizontal'
                          data-disabled={!enabled}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>
                              BotやWebhookが送信したメッセージを除外する
                            </FieldLabel>
                            <FieldDescription>
                              この設定に関わらず、NoNICK.jsから送信されたメッセージは常に除外されます。
                            </FieldDescription>
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
                          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                      )}
                    />
                    <FieldSeparator />
                    <Controller
                      control={form.control}
                      name='ignoreRoles'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} data-disabled={!enabled}>
                          <FieldLabel htmlFor={field.name}>スレッド作成を除外するロール</FieldLabel>
                          <RoleSelect
                            ref={field.ref}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            value={field.value}
                            onValueChange={field.onChange}
                            roles={roles}
                            disabled={!enabled}
                            disabledItemFilter={(role) => role.id === rule.guildId}
                            modal
                          />
                          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>
                      )}
                    />
                  </>
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
              <Button
                type='submit'
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                {form.formState.isSubmitting ? <Spinner /> : <SaveIcon />}
                保存
              </Button>
            </DialogFooter>
          </form>
          <FormDevTool />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
