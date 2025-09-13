import { Button } from '@heroui/react';
import { useFormState } from 'react-hook-form';
import { Icon } from '../icon';

export function FormSubmitButton() {
  const { isSubmitting, isDirty } = useFormState();

  return (
    <Button
      type='submit'
      color='primary'
      isLoading={isSubmitting}
      isDisabled={!isDirty}
      startContent={!isSubmitting && <Icon icon='solar:diskette-bold' className='text-2xl' />}
    >
      変更を保存
    </Button>
  );
}
