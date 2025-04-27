import { Icon } from '@/components/icon';
import { Checkbox, type CheckboxProps, cn } from '@heroui/react';

type CustomCheckboxProps = CheckboxProps & { icon: string };

export function CustomCheckbox({ children, icon, ...props }: CustomCheckboxProps) {
  return (
    <Checkbox
      classNames={{
        base: cn(
          'inline-flex m-0 bg-default-100 items-center justify-between w-full max-w-none',
          'w-full cursor-pointer rounded-lg gap-2 px-4 py-3 border-2 border-transparent data-[hover=true]:bg-default-200',
        ),
        label: 'w-full',
      }}
      {...props}
    >
      <div className='flex items-center gap-3 text-sm'>
        <Icon className='text-default-500 text-xl' icon={icon} />
        {children}
      </div>
    </Checkbox>
  );
}
