import { type VariantProps, cn, tv } from '@nextui-org/theme';
import React, { type HTMLAttributes } from 'react';
import { IconifyIcon } from '../iconify-icon';

const AlertVariants = tv({
  base: ['w-full', 'flex', 'items-center', 'gap-3', 'py-3', 'px-4', 'rounded-xl', 'border'],
  variants: {
    variant: {
      info: '[&>iconify-icon]:text-primary border-primary-100 bg-primary-100/20',
      success: '[&>iconify-icon]:text-success border-success-100 bg-success-100/20',
      warning: '[&>iconify-icon]:text-warning border-warning-100 bg-warning-100/20',
      danger: '[&>iconify-icon]:text-danger border-danger-100 bg-danger-100/20',
    },
  },
  defaultVariants: { variant: 'info' },
});

const AlertIcons = {
  info: 'solar:info-circle-bold',
  success: 'solar:check-circle-bold',
  warning: 'solar:danger-circle-bold',
  danger: 'solar:close-circle-bold',
};

const Alert = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & VariantProps<typeof AlertVariants>
>(({ className, variant, children, ...props }, ref) => {
  return (
    <div ref={ref} role='alert' className={cn(AlertVariants({ variant }), className)} {...props}>
      <IconifyIcon icon={AlertIcons[variant || 'info']} className='text-[22px]' />
      <div className='flex-1'>{children}</div>
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('text-sm font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-default-500', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
