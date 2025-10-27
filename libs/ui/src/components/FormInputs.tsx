import React, { forwardRef } from 'react';
import {
  TextInput as MantineTextInput,
  TextInputProps as MantineTextInputProps,
  NumberInput as MantineNumberInput,
  NumberInputProps as MantineNumberInputProps,
  PasswordInput as MantinePasswordInput,
  PasswordInputProps as MantinePasswordInputProps,
  Textarea as MantineTextarea,
  TextareaProps as MantineTextareaProps,
  Select as MantineSelect,
  SelectProps as MantineSelectProps,
  MultiSelect as MantineMultiSelect,
  MultiSelectProps as MantineMultiSelectProps,
} from '@mantine/core';

// Text Input
export interface TextInputProps extends MantineTextInputProps {
  /** Custom validation state */
  isValid?: boolean;
  /** Show validation icon */
  showValidationIcon?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ isValid, showValidationIcon, error, ...props }, ref) => {
    return <MantineTextInput ref={ref} error={error} {...props} />;
  }
);

TextInput.displayName = 'TextInput';

// Number Input
export interface NumberInputProps extends MantineNumberInputProps {
  /** Custom validation state */
  isValid?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ isValid, ...props }, ref) => {
    return <MantineNumberInput ref={ref} {...props} />;
  }
);

NumberInput.displayName = 'NumberInput';

// Password Input
export interface PasswordInputProps extends MantinePasswordInputProps {
  /** Custom validation state */
  isValid?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ isValid, ...props }, ref) => {
    return <MantinePasswordInput ref={ref} {...props} />;
  }
);

PasswordInput.displayName = 'PasswordInput';

// Textarea
export interface TextareaProps extends MantineTextareaProps {
  /** Custom validation state */
  isValid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ isValid, ...props }, ref) => {
    return <MantineTextarea ref={ref} {...props} />;
  }
);

Textarea.displayName = 'Textarea';

// Select
export interface SelectProps extends MantineSelectProps {
  /** Custom validation state */
  isValid?: boolean;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ isValid, ...props }, ref) => {
    return <MantineSelect ref={ref} {...props} />;
  }
);

Select.displayName = 'Select';

// MultiSelect
export interface MultiSelectProps extends MantineMultiSelectProps {
  /** Custom validation state */
  isValid?: boolean;
}

export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(
  ({ isValid, ...props }, ref) => {
    return <MantineMultiSelect ref={ref} {...props} />;
  }
);

MultiSelect.displayName = 'MultiSelect';
