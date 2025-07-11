import { NumberInputField, type NumberInputFieldProps } from '@/components/form/ui/input';
import { Icon } from '@/components/icon';

type HourInputProps = Omit<
  NumberInputFieldProps,
  'minValue' | 'maxValue' | 'startContent' | 'endContent'
>;

export function HourInputField(props: HourInputProps) {
  return (
    <NumberInputField
      minValue={0}
      maxValue={23}
      startContent={
        <Icon
          className='text-default-500 group-data-[invalid=true]:text-danger-400 text-xl'
          icon='solar:clock-circle-bold'
        />
      }
      endContent={
        <span className='text-small text-default-500 group-data-[invalid=true]:text-danger-400'>
          :00
        </span>
      }
      {...props}
    />
  );
}
