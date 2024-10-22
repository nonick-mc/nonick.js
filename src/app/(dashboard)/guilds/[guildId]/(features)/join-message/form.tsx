'use client';

import { ChannelSelect } from '@/components/dashboard/channel-select';
import { FormActionButtons, FormCard } from '@/components/dashboard/form-components';
import { AuthorWrapper } from '@/components/dashboard/message-edit-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { JoinMessageConfig } from '@/lib/database/zod';
import type { getChannels } from '@/lib/discord';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@nextui-org/card';
import { Input, Textarea } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { Switch } from '@nextui-org/switch';
import { cn } from '@nextui-org/theme';
import { ChannelType } from 'discord-api-types/v10';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';
import {
  type SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { updateConfig } from './action';

// #region Types, Context
type InputConfig = z.input<typeof JoinMessageConfig>;
type OutputConfig = z.output<typeof JoinMessageConfig>;

type Props = {
  channels: Awaited<ReturnType<typeof getChannels>>;
  config: OutputConfig | null;
};

const PropsContext = createContext<Omit<Props, 'config'>>({
  channels: [],
});
// #endregion

// #region Form
export function ConfigForm({ config, ...props }: Props) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputConfig, unknown, OutputConfig>({
    resolver: zodResolver(JoinMessageConfig),
    defaultValues: config ?? {
      enabled: false,
      channel: null,
      ignoreBot: false,
      message: {
        embeds: [
          {
            title: 'WELCOME',
            description: '![user] **(![userTag])** さん、**![serverName]**へようこそ！',
            color: 5763719,
          },
        ],
      },
    },
  });

  const onSubmit: SubmitHandler<OutputConfig> = async (values) => {
    const res = await updateConfig({ guildId, ...values });

    if (res?.data?.success) {
      form.reset(values);
      toast.success('設定を保存しました！');
    } else {
      toast.error('設定の保存に失敗しました。');
    }
  };

  return (
    <PropsContext.Provider value={props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <EnableConfigForm />
          <GeneralConfigForm />
          <MessageConfigForm />
          <FormActionButtons />
        </form>
      </Form>
    </PropsContext.Provider>
  );
}

function EnableConfigForm() {
  const form = useFormContext<InputConfig>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel title='入室メッセージを有効にする' />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfigForm() {
  const form = useFormContext<InputConfig>();
  const { channels } = useContext(PropsContext);
  const disabled = !useWatch<InputConfig>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <FormField
        control={form.control}
        name='channel'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='メッセージを送信するチャンネル' isRequired isDisabled={disabled} />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                items={channels}
                selectedKeys={value ? [value] : []}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isDisabled={disabled}
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignoreBot'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='BOT入室時にメッセージを送信しない'
              description='オンにすると、BOTがサーバーに追加された際にメッセージが送信されないようになります。'
              isDisabled={disabled}
            />
            <FormControl>
              <Switch
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                isSelected={value}
                isDisabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function MessageConfigForm() {
  const form = useFormContext<InputConfig>();
  const disabled = !useWatch<InputConfig>({ name: 'enabled' });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'message.embeds',
  });

  return (
    <FormCard title='メッセージ設定' className='gap-6'>
      <Alert className={cn({ 'opacity-disabled': disabled })} variant='info'>
        <AlertTitle>プレースホルダーを使用して、メッセージに動的な値を追加できます。</AlertTitle>
        <AlertDescription>
          詳細は
          <Link
            href='https://docs.nonick-js.com/features/welcome-message'
            className='text-sm text-primary underline'
            isExternal
          >
            ドキュメント
          </Link>
          を確認してください。
        </AlertDescription>
      </Alert>
      <Card className='bg-default-100 p-4 shadow-none'>
        <AuthorWrapper name='NoNICK.js' avatar='/icon_300.png' isBot isDisabled={disabled}>
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className='flex flex-row overflow-y-hidden shadow-none md:max-w-[500px] rounded-md'
            >
              <div className='h-auto w-1.5 bg-green-500' />
              <div className='flex-1 flex flex-col gap-2 p-3 md:p-4 pb-2'>
                <FormField
                  control={form.control}
                  name={`message.embeds.${index}.title`}
                  render={({
                    field: { ref, onChange, onBlur, value },
                    fieldState: { invalid, error },
                  }) => (
                    <FormControl>
                      <Input
                        ref={ref}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='タイトルを入力'
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isDisabled={disabled}
                      />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`message.embeds.${index}.description`}
                  render={({
                    field: { ref, onChange, onBlur, value },
                    fieldState: { invalid, error },
                  }) => (
                    <FormControl>
                      <Textarea
                        ref={ref}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='テキストを入力'
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isDisabled={disabled}
                        minRows={4}
                      />
                    </FormControl>
                  )}
                />
              </div>
            </Card>
          ))}
        </AuthorWrapper>
      </Card>
    </FormCard>
  );
}
// #endregion
