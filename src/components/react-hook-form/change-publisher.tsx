import { Button, Card, Divider, Spinner } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Icon } from '../icon';

export function FormChangePublisher() {
  const {
    formState: { isDirty, isSubmitting },
    reset,
  } = useFormContext();

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          className='fixed bottom-7 w-dvw lg:w-[calc(100dvw_-_300px)] left-0 lg:left-[300px] flex justify-center z-50'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
        >
          <Card className='flex justify-center p-2 rounded-full border-divider border-1'>
            <div className='flex items-center'>
              <div className='flex items-center gap-2 mx-2 max-sm:hidden'>
                <Icon className='text-warning text-2xl' icon='solar:danger-circle-linear' />
                <span className='text-medium'>保存されていない変更があります！</span>
              </div>
              <Divider className='max-sm:hidden mx-2 h-5' orientation='vertical' />
              <div className='flex gap-1 items-center'>
                <Button
                  onPress={() => reset()}
                  isDisabled={isSubmitting}
                  radius='full'
                  variant='light'
                  className='text-default-500'
                >
                  リセット
                </Button>
                <Button type='submit' radius='full' color='primary' isLoading={isSubmitting}>
                  変更を保存
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
