import { Icon } from '@/components/icon';
import {
  ControlledNumberInput,
  type ControlledNumberInputProps,
} from '@/components/react-hook-form/ui/number-input';
import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';

type HourInputProps = Omit<
  ControlledNumberInputProps,
  'minValue' | 'maxValue' | 'startContent' | 'endContent'
>;

export function ControlledHourInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: HourInputProps & UseControllerProps<TFieldValues, TName>) {
  return (
    <ControlledNumberInput
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
