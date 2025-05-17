'use client';

import { Icon } from '@/components/icon';
import { AnimatedStep } from '@/components/wizard-animated-step';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { Alert, Avatar, Button, addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import type { APIGuild } from 'discord-api-types/v10';
import { signOut, useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { Wizard, useWizard } from 'react-use-wizard';
import { verifyAction } from './action';
import { type FormInputSchema, type FormOutputSchema, captchaFormSchema } from './schema';

export function VerificationWizard({
  guild,
  isVerified,
}: { guild: APIGuild; isVerified: boolean }) {
  const previousStep = useRef<number>(0);

  return (
    <Wizard>
      <AnimatedStep previousStep={previousStep}>
        <VerificationStatusStep guild={guild} isVerified={isVerified} />
      </AnimatedStep>
      <AnimatedStep previousStep={previousStep}>
        <CaptchaStep />
      </AnimatedStep>
      <AnimatedStep previousStep={previousStep}>
        <ResultStep />
      </AnimatedStep>
    </Wizard>
  );
}

function VerificationStatusStep({ guild, isVerified }: { guild: APIGuild; isVerified: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const { nextStep } = useWizard();
  const { data: session } = useSession();

  return (
    <div className='flex flex-col gap-3'>
      <div>
        <p className='text-xl pb-1 font-extrabold'>メンバー認証</p>
        <p className='text-sm text-default-500'>Discordアカウントで認証を行います。</p>
      </div>
      <div className='flex flex-col items-center gap-3 py-6'>
        <Avatar
          src={`${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}.webp`}
          className='w-28 h-28'
        />
        <p className='text-lg font-semibold'>{guild.name}</p>
      </div>
      <div className='flex flex-col gap-3 w-full'>
        {session?.error && (
          <Alert
            title='セッションの有効期限が切れました'
            description='「他のアカウントに切り替える」ボタンから再度ログインを行ってください。'
            color='warning'
            variant='faded'
          />
        )}
        <Button
          onPress={nextStep}
          color='primary'
          startContent={<Avatar src={session?.user.image} size='sm' />}
          isDisabled={!!session?.error || isLoading || isVerified}
        >
          {isVerified ? '既に認証されています' : `${session?.user.name} として認証する`}
        </Button>
        <Button
          onPress={() => {
            setIsLoading(true);
            signOut();
          }}
          isLoading={isLoading}
          disableRipple
        >
          他のアカウントに切り替える
        </Button>
      </div>
    </div>
  );
}

function CaptchaStep() {
  const { guildId } = useParams<{ guildId: string }>();
  const { goToStep, nextStep } = useWizard();

  const form = useForm<FormInputSchema, unknown, FormOutputSchema>({
    resolver: zodResolver(captchaFormSchema),
  });

  const onSubmit: SubmitHandler<FormOutputSchema> = async (values) => {
    const res = await verifyAction({ guildId, ...values });

    if (res?.data?.error) {
      goToStep(0);
      return addToast({
        title: '認証中に問題が発生しました',
        description: '時間を置いてもう一度お試しください。',
        color: 'danger',
      });
    }
    nextStep();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3'>
          <div>
            <p className='text-xl pb-1 font-extrabold'>メンバー認証</p>
            <p className='text-sm text-default-500'>Discordアカウントで認証を行います。</p>
          </div>
          <div className='py-6'>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => form.setValue('turnstileToken', token)}
              options={{ size: 'flexible' }}
            />
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <Button
              type='submit'
              color='primary'
              startContent={
                !form.formState.isSubmitting && (
                  <Icon icon='solar:arrow-right-outline' className='text-2xl' />
                )
              }
              isLoading={form.formState.isSubmitting}
              isDisabled={!form.watch().turnstileToken}
            >
              続行
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export function ResultStep() {
  return (
    <div className='flex flex-col gap-3'>
      <div className='py-6 flex justify-center'>
        <div className='flex items-center justify-center p-3 bg-success-50 dark:bg-success-100 border-success-100 shadow-small border-1 rounded-full'>
          <Icon icon='solar:check-circle-bold' className='text-success text-6xl' />
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <p className='text-lg font-semibold'>認証に成功しました！</p>
        <p className='text-default-500'>このページを閉じても問題ありません。</p>
      </div>
    </div>
  );
}
