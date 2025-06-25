import { cn, Radio, type RadioProps } from '@heroui/react';

export function CustomRadio(props: RadioProps) {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-default-100 hover:bg-default-200 items-center justify-between',
          'w-full max-w-none cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary transition-background',
        ),
        label: 'text-sm font-semibold',
        description: 'text-sm text-foreground-500',
        labelWrapper: 'flex-1 text-sm',
      }}
    >
      {children}
    </Radio>
  );
}
