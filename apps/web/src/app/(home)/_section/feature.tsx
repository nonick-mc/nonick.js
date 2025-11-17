import {
  DollarSignIcon,
  HeartIcon,
  LifeBuoyIcon,
  RocketIcon,
  ServerIcon,
  WrenchIcon,
} from 'lucide-react';

interface Feature {
  heading: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    heading: '豊富な機能',
    description:
      '小規模なサーバーから大規模なコミュニティまで、幅広いサーバーの運営をサポートする豊富な機能やコマンドを搭載しています。',
    icon: <RocketIcon className='size-6' />,
  },
  {
    heading: '使いやすい操作性',
    description:
      'Botの導入や各機能の設定は全てダッシュボードに集約されており、ダッシュボードにアクセスするだけですぐに使用を開始することができます。',
    icon: <HeartIcon className='size-6' />,
  },
  {
    heading: 'カスタマイズ可能',
    description:
      '各機能には豊富なカスタマイズオプションが用意されているため、各サーバーのニーズに合わせて自由に設定を行うことができます。',
    icon: <WrenchIcon className='size-6' />,
  },
  {
    heading: '充実したサポート',
    description:
      'Botの使い方を網羅したドキュメントや、いつでも質問やお問い合わせが可能な公式サポートサーバーにより、誰でもBotの使用を開始することができます。',
    icon: <LifeBuoyIcon className='size-6' />,
  },
  {
    heading: '無料で使用可能',
    description:
      '特定の機能を開放するために料金を支払う必要はありません。NoNICK.jsでは全ての機能を無料で使用することができます。',
    icon: <DollarSignIcon className='size-6' />,
  },
  {
    heading: '高い信頼性',
    description:
      '現在、NoNICK.jsは1,000を超えるサーバーで導入されており、様々な規模のサーバー管理をサポートしています。',
    icon: <ServerIcon className='size-6' />,
  },
];

export function FeatureSection() {
  return (
    <section className='container max-w-6xl py-32'>
      <div className='container'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='text-pretty text-4xl font-bold lg:text-5xl'>
            機能性と使いやすさを両立した
            <br />
            サーバー管理Bot
          </h2>
        </div>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: need to use index
            <div key={i} className='flex flex-col'>
              <div className='bg-accent mb-5 flex size-14 items-center justify-center rounded-full'>
                {feature.icon}
              </div>
              <h3 className='mb-2 text-xl font-semibold'>{feature.heading}</h3>
              <p className='text-muted-foreground'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
