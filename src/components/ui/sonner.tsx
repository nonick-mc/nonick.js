'use client';

import { Toaster as Sonner } from 'sonner';
import { IconifyIcon } from '../iconify-icon';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          icon: 'text-[20px]',
        },
      }}
      icons={{
        info: <IconifyIcon icon='solar:info-circle-bold' className='text-primary' />,
        success: <IconifyIcon icon='solar:check-circle-bold' className='text-success' />,
        warning: <IconifyIcon icon='solar:danger-circle-bold' className='text-warning' />,
        error: <IconifyIcon icon='solar:close-circle-bold' className='text-danger' />,
      }}
      {...props}
    />
  );
};

export { Toaster };
