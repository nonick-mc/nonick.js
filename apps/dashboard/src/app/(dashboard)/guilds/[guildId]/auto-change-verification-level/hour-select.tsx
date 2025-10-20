import type { SelectTriggerProps } from '@radix-ui/react-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type HourSelectProps = {
  value: number;
  onChange: (value: number) => void;
} & SelectTriggerProps;

export function HourSelect({ value, onChange, ...triggerProps }: HourSelectProps) {
  return (
    <Select value={value.toString()} onValueChange={(value) => onChange(Number(value))}>
      <SelectTrigger {...triggerProps}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 24 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: キーを使用する必要があるため
          <SelectItem key={i} value={i.toString()}>
            {i.toString().padStart(2, '0')}:00
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
