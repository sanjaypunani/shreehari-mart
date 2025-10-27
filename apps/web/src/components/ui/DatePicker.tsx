import {
  DatePickerInput,
  DatePickerInputProps,
  DateValue,
} from '@mantine/dates';

export interface DatePickerProps
  extends Omit<DatePickerInputProps, 'onChange'> {
  variant?: 'default' | 'filled' | 'unstyled';
  onChange?: (value: DateValue) => void;
}

export function DatePicker({
  variant = 'default',
  onChange,
  ...props
}: DatePickerProps) {
  return (
    <DatePickerInput
      variant={variant}
      valueFormat="DD/MM/YYYY"
      onChange={onChange}
      {...props}
    />
  );
}
