'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import type { APIGuild } from 'discord-api-types/v10';
import { ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm, Watch } from 'react-hook-form';
import { useWizard, Wizard } from 'react-use-wizard';
import { toast } from 'sonner';
import type z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { verifyAction } from './action';
import { formSchema } from './schema';
import { AnimatedStep } from './wizard-animation';

type VerificationWizardProps = {
  guild: APIGuild;
  isVerified: boolean;
};

export function VerificationWizard({ guild, isVerified }: VerificationWizardProps) {
  const previousStep = useRef<number>(0);

  return (
    <Wizard>
      <AnimatedStep previousStep={previousStep}>
        <Step1 guild={guild} isVerified={isVerified} />
      </AnimatedStep>
      <AnimatedStep previousStep={previousStep}>
        <Step2 />
      </AnimatedStep>
      <AnimatedStep previousStep={previousStep}>
        <Step3 />
      </AnimatedStep>
    </Wizard>
  );
}

function Step1({ guild, isVerified }: { guild: APIGuild; isVerified: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const { nextStep } = useWizard();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <div className='flex flex-col items-center gap-8'>
      <div className='flex flex-col items-center gap-3'>
        <Avatar className='size-28'>
          <AvatarImage src={`${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}`} />
          <AvatarFallback>{guild.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className='text-lg font-semibold'>{guild.name}</p>
      </div>
      <div className='w-full flex flex-col gap-2'>
        <Button onClick={nextStep} disabled={isLoading || isVerified || !session}>
          {session ? (
            <>
              <Avatar className='size-7'>
                <AvatarImage src={session.user.image ?? undefined} alt={`@${session.user.name}`} />
                <AvatarFallback>{session.user.globalName ?? session.user.name}</AvatarFallback>
              </Avatar>
              {isVerified ? '既に認証されています' : `@${session.user.name} として認証する`}
            </>
          ) : (
            '読み込み中'
          )}
        </Button>
        <Button
          onClick={() => {
            setIsLoading(true);
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.refresh(),
              },
            });
          }}
          variant='outline'
          disabled={isLoading || !session}
        >
          他のアカウントに切り替える
        </Button>
      </div>
    </div>
  );
}

function Step2() {
  const { guildId } = useParams<Awaited<PageProps<'/verify/guilds/[guildId]'>['params']>>();
  const { goToStep, nextStep } = useWizard();
  const bindVerifyAction = verifyAction.bind(null, guildId);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await bindVerifyAction(values);
    if (res.serverError || res.validationErrors) {
      goToStep(0);
      form.reset();
      return toast.error('設定の更新中に問題が発生しました。時間をおいて再度お試しください。');
    }
    nextStep();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='w-full flex flex-col items-center gap-8'
    >
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
        onSuccess={(token) => form.setValue('turnstileToken', token)}
        options={{ size: 'flexible' }}
      />
      <Watch
        control={form.control}
        names={['turnstileToken']}
        render={([turnstileToken]: [string]) => (
          <Button
            className='w-full'
            type='submit'
            disabled={!turnstileToken || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner className='pt-0' /> : <ArrowRightIcon />}
            続行
          </Button>
        )}
      />
    </form>
  );
}

function Step3() {
  return (
    <div className='flex flex-col items-center gap-6'>
      <CheckCircle2Icon className='size-28 stroke-green-500' strokeWidth={1.5} />
      <div className='flex flex-col items-center'>
        <p className='text-lg font-semibold'>認証に成功しました！</p>
        <p className='text-muted-foreground'>このページを閉じても問題ありません。</p>
      </div>
    </div>
  );
}
