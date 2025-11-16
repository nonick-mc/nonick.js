import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/accordion';
import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Links } from '@/lib/constants';

interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

export function FaqSection({
  heading = 'よくある質問',
  items = [
    {
      question: 'Botを導入するにはどうすればよいですか？',
      answer: (
        <>
          ドキュメントの
          <Link className='text-foreground underline' href={'/docs/tutorial/introduction' as Route}>
            Botを導入する
          </Link>
          ページにて、NoNICK.jsの導入方法を解説しています。
        </>
      ),
    },
    {
      question: 'NoNICK.jsの使用に料金は発生しますか？',
      answer:
        '現在、NoNICK.jsに有料プランは提供されておりません。そのため、全ての機能を無料で使用することができます。',
    },
    {
      question: 'NoNICK.jsは他のサーバー管理Botとどう違うのですか？',
      answer: (
        <>
          NoNICK.jsは、豊富な機能や高度なカスタマイズ性と、分かりやすく使いやすい操作性を両立するよう設計されています。
          <br />
          各機能の設定は全てダッシュボードに集約されているため、使用前にコマンド等を学習する必要なく、ダッシュボードにアクセスするだけで使用を開始することができます。
        </>
      ),
    },
    {
      question:
        '日本語以外の言語で使用することはできますか？ (Can I use it in languages other than Japanese?)',
      answer: (
        <>
          いいえ、NoNICK.jsは日本語のみをサポートしています。他の言語への対応予定は現時点ではありません。
          <br />
          (No, NoNICK.js currently only supports Japanese. There are no plans to support other
          languages at this time.)
        </>
      ),
    },
    {
      question: '質問やサポートを受けられるコミュニティはありますか？',
      answer: (
        <>
          はい、
          <Link className='text-foreground underline' href={Links.SupportServer}>
            公式サポートサーバー
          </Link>
          に参加し、専用のテキストチャンネルに投稿することでサポートを受けることができます。
        </>
      ),
    },
    {
      question: '今後開発する機能を確認したり、リクエストすることはできますか？',
      answer: (
        <>
          <Link className='text-foreground underline' href={Links.Roadmap}>
            ロードマップ
          </Link>
          に今後の開発予定を掲載しています。また、
          <Link className='text-foreground underline' href={Links.SupportServer}>
            公式サポートサーバー
          </Link>
          では、専用のテキストチャンネルでリクエストを受け付けています。ただし、いただいたリクエストが必ずしも実装されるとは限りませんので、あらかじめご了承ください。
        </>
      ),
    },
  ],
}: Faq1Props) {
  return (
    <section className='py-32'>
      <div className='container max-w-4xl'>
        <h1 className='mb-4 text-3xl font-semibold md:mb-11 md:text-4xl'>{heading}</h1>
        <Accordion type='single' collapsible>
          {items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: need to use index
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='font-semibold hover:no-underline'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
