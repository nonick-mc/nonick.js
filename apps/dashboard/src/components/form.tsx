'use client';

import { Button } from '@repo/ui/components/button';
import { Item, ItemActions, ItemContent, ItemDescription } from '@repo/ui/components/item';
import { Spinner } from '@repo/ui/components/spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { SaveIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useFormContext, useFormState } from 'react-hook-form';

const DevTool = dynamic(() => import('@hookform/devtools').then((module) => module.DevTool), {
  ssr: false,
});

export function FormChangePublisher() {
  const { isDirty, isSubmitting } = useFormState();
  const { reset } = useFormContext();

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          className='fixed bottom-4 right-4 z-50'
        >
          <Item variant='outline' className='bg-background shadow-lg border-border'>
            <ItemContent className='max-sm:hidden'>
              <ItemDescription className='text-sm font-medium text-foreground'>
                保存されていない変更があります！
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => reset(undefined, { keepValues: false })}
                disabled={isSubmitting}
              >
                リセット
              </Button>
              <Button type='submit' size='sm' disabled={isSubmitting}>
                {isSubmitting ? <Spinner className='pt-0' /> : <SaveIcon />}
                変更を保存
              </Button>
            </ItemActions>
          </Item>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FormDevTool() {
  const form = useFormContext();
  if (process.env.NODE_ENV !== 'development') return null;

  return <DevTool control={form.control} placement='top-left' />;
}
