'use client';

import {
  Alert,
  addToast,
  Button,
  cn,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { createFormHook, useStore } from '@tanstack/react-form';
import {
  type APIGuildChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { z } from 'zod';
import { FormCard, FormSubCard } from '@/components/form';
import { ChannelSelectField } from '@/components/form/channel-select';
import { fieldContext, formContext } from '@/components/form/context';
import { RoleSelectField } from '@/components/form/role-select';
import { FormChangeSubmitBanner } from '@/components/form/submit-button';
import { InputField } from '@/components/form/ui/input';
import { FieldLabel } from '@/components/form/ui/label';
import { SwitchField } from '@/components/form/ui/switch';
import { ArrayTextareaField } from '@/components/form/ui/textarea';
import { Icon } from '@/components/icon';
import { updateSettingAction } from './action';
import { domainListSchema, settingFormSchema } from './schema';

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  setting: z.infer<typeof settingFormSchema> | null;
};

export function SettingForm({ setting, channels, roles }: Props) {
  const { guildId } = useParams<{ guildId: string }>();
  const bindUpdateSettingAction = updateSettingAction.bind(null, guildId);

  const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      SwitchField,
      ChannelSelectField,
      RoleSelectField,
      ArrayTextareaField,
      InputField,
    },
    formComponents: {
      FormChangeSubmitBanner,
    },
  });

  const form = useAppForm({
    validators: {
      onSubmit: settingFormSchema,
    },
    defaultValues: {
      enabled: setting?.enabled ?? false,
      enableInviteUrlFilter: setting?.enableInviteUrlFilter ?? false,
      enableTokenFilter: setting?.enableTokenFilter ?? false,
      enableDomainFilter: setting?.enableDomainFilter ?? false,
      domainList: setting?.domainList ?? [],
      ignoreChannels: setting?.ignoreChannels ?? [],
      ignoreRoles: setting?.ignoreRoles ?? [],
      enableLog: setting?.enableLog ?? false,
      logChannel: setting?.logChannel ?? null,
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await bindUpdateSettingAction(value);
      if (res.serverError || res.validationErrors) {
        return addToast({
          title: '送信中に問題が発生しました',
          description: '時間を置いてもう一度送信してください。',
          color: 'danger',
        });
      }
      formApi.reset(value);
      formApi.setFieldValue('domainList', value.domainList);
    },
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const domainList = useStore(form.store, (state) => state.values.domainList);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='flex flex-col gap-6 pb-28'
      >
        <FormCard>
          <form.AppField name='enabled'>
            {(field) => (
              <field.SwitchField
                label='AutoMod Plusを有効にする'
                description='特定の条件を満たすメッセージを自動で削除します。'
              />
            )}
          </form.AppField>
        </FormCard>
        <FormCard title='フィルター設定'>
          <form.Subscribe selector={(state) => state.values.enabled}>
            {(enabled) => (
              <div className='flex flex-col gap-3'>
                <FormSubCard
                  title='Discordサーバーの招待リンク'
                  icon='solar:link-round-bold'
                  isDisabled={!enabled}
                >
                  <form.AppField name='enableInviteUrlFilter'>
                    {(field) => (
                      <field.SwitchField
                        label='招待リンクをブロックする'
                        description='このDiscordサーバー以外の招待リンクを含むメッセージを自動で削除します。'
                        isDisabled={!enabled}
                      />
                    )}
                  </form.AppField>
                </FormSubCard>
                <FormSubCard
                  title='Discordトークン'
                  icon='solar:shield-keyhole-bold'
                  isDisabled={!enabled}
                >
                  <form.AppField name='enableTokenFilter'>
                    {(field) => (
                      <field.SwitchField
                        label='Discordトークンをブロックする'
                        description='Discordアカウントのトークンを含むメッセージを自動で削除します。'
                        isDisabled={!enabled}
                      />
                    )}
                  </form.AppField>
                </FormSubCard>
                <FormSubCard title='ドメイン' icon='solar:global-bold' isDisabled={!enabled}>
                  <form.AppField name='enableDomainFilter'>
                    {(field) => (
                      <field.SwitchField
                        label='特定のドメインをブロックする'
                        description='特定のドメインのURLを含むメッセージを自動で削除します。'
                        isDisabled={!enabled}
                      />
                    )}
                  </form.AppField>
                  <form.Subscribe selector={(state) => state.values.enableDomainFilter}>
                    {(enableDomainFilter) => (
                      <div className='flex justify-between gap-3'>
                        <FieldLabel
                          label='ブロックするドメイン'
                          description='最大20個のドメインを設定することができます。'
                          isDisabled={!enabled || !enableDomainFilter}
                        />
                        <Button
                          onPress={onOpen}
                          variant='flat'
                          isDisabled={!enabled || !enableDomainFilter}
                          startContent={<Icon icon='solar:settings-bold' className='text-2xl' />}
                        >
                          ドメインを設定
                        </Button>
                      </div>
                    )}
                  </form.Subscribe>
                </FormSubCard>
              </div>
            )}
          </form.Subscribe>
        </FormCard>
        <FormCard title='例外設定' bodyClass='gap-6'>
          <form.Subscribe selector={(state) => state.values.enabled}>
            {(isEnabled) => (
              <>
                <Alert
                  variant='faded'
                  color='primary'
                  description='「サーバー管理」権限を持っているユーザーやBOTは、設定に関わらず全てのフィルターが適用されません。'
                  classNames={{ base: cn({ 'opacity-disabled': !isEnabled }) }}
                />
                <div className='flex flex-col gap-8'>
                  <form.AppField name='ignoreChannels'>
                    {(field) => (
                      <field.ChannelSelectField
                        channels={channels}
                        channelTypeFilter={{ exclude: [ChannelType.GuildCategory] }}
                        label='フィルターを適用しないチャンネル'
                        description='選択したチャンネルのスレッドもフィルターが適用されなくなります。'
                        selectionMode='multiple'
                        isDisabled={!isEnabled}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name='ignoreRoles'>
                    {(field) => (
                      <field.RoleSelectField
                        roles={roles}
                        disableItemFilter={(role) => role.id === guildId}
                        label='フィルターを適用しないロール'
                        selectionMode='multiple'
                        isDisabled={!isEnabled}
                      />
                    )}
                  </form.AppField>
                </div>
              </>
            )}
          </form.Subscribe>
        </FormCard>
        <FormCard title='ログ設定'>
          <form.Subscribe selector={(state) => state.values.enabled}>
            {(isEnabled) => (
              <form.Subscribe selector={(state) => state.values.enableLog}>
                {(isLogEnabled) => (
                  <>
                    <form.AppField name='enableLog'>
                      {(field) => (
                        <field.SwitchField
                          label='ログを有効にする'
                          description='フィルターによってメッセージが削除された際にログを送信します。'
                          isDisabled={!isEnabled}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name='logChannel'>
                      {(field) => (
                        <field.ChannelSelectField
                          label='ログを送信するチャンネル'
                          channels={channels}
                          channelTypeFilter={{ include: [ChannelType.GuildText] }}
                          isRequired
                          isDisabled={!isEnabled || !isLogEnabled}
                        />
                      )}
                    </form.AppField>
                  </>
                )}
              </form.Subscribe>
            )}
          </form.Subscribe>
        </FormCard>

        <form.AppForm>
          <form.FormChangeSubmitBanner />
        </form.AppForm>
      </form>
      <DomainListModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        parentFieldValue={domainList}
        onSubmit={(value) => form.setFieldValue('domainList', value)}
      />
    </>
  );
}

type DomainListModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  parentFieldValue: z.infer<typeof domainListSchema>;
  onSubmit: (value: z.infer<typeof domainListSchema>) => void;
};

function DomainListModal({
  isOpen,
  onOpenChange,
  onClose,
  parentFieldValue,
  onSubmit,
}: DomainListModalProps) {
  const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: { InputField },
    formComponents: {},
  });

  const form = useAppForm({
    validators: {
      onSubmit: z.object({
        domain: domainListSchema,
      }),
    },
    defaultValues: { domain: [] as string[] },
    onSubmit: ({ value }) => {
      onSubmit(value.domain);
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) form.reset({ domain: parentFieldValue });
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='outside'>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <ModalHeader>ドメインの設定</ModalHeader>
            <ModalBody>
              <Alert
                variant='faded'
                color='primary'
                title='メインドメインを指定すると、すべてのサブドメインのURLもブロックされます。'
              />
              <Divider className='my-2' />
              <form.AppField name='domain' mode='array'>
                {(field) => (
                  <>
                    {!!field.state.meta.errors.length && (
                      <Alert
                        variant='faded'
                        color='danger'
                        title={field.state.meta.errors.map((e) => e?.message).join('\n')}
                      />
                    )}
                    <div className='flex flex-col gap-3'>
                      {field.state.value.map((_, i) => (
                        <form.AppField
                          // biome-ignore lint: false positive
                          key={i}
                          name={`domain[${i}]`}
                        >
                          {(subField) => (
                            <div className='flex gap-2'>
                              <subField.InputField
                                aria-label='ドメインを入力'
                                placeholder='ドメインを入力'
                                startContent={
                                  <Icon
                                    icon='solar:link-minimalistic-bold'
                                    className='text-2xl text-default-500'
                                  />
                                }
                              />
                              <Button
                                onPress={() => field.removeValue(i)}
                                isIconOnly
                                variant='flat'
                                color='danger'
                              >
                                <Icon
                                  icon='solar:trash-bin-minimalistic-bold'
                                  className='text-2xl text-danger'
                                />
                              </Button>
                            </div>
                          )}
                        </form.AppField>
                      ))}
                      <form.Subscribe selector={(state) => state.values.domain}>
                        {(domain) => (
                          <Button
                            color='primary'
                            variant='flat'
                            onPress={() => field.pushValue('')}
                            startContent={
                              <Icon icon='solar:add-circle-bold' className='text-2xl' />
                            }
                            isDisabled={domain.length >= 20}
                          >
                            追加
                          </Button>
                        )}
                      </form.Subscribe>
                    </div>
                  </>
                )}
              </form.AppField>
            </ModalBody>
            <ModalFooter className='justify-between items-center'>
              <form.Subscribe selector={(state) => state.values.domain}>
                {(domain) => (
                  <p className='text-sm text-default-500'>{domain.length}/20 設定済み</p>
                )}
              </form.Subscribe>
              <div className='flex gap-2'>
                <Button onPress={onClose} variant='flat'>
                  キャンセル
                </Button>
                <Button type='submit' color='primary'>
                  保存
                </Button>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
