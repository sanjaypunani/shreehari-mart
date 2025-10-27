import {
  Stepper as MantineStepper,
  StepperProps as MantineStepperProps,
} from '@mantine/core';
import { ReactNode } from 'react';

export interface StepItem {
  label: string;
  description?: string;
  icon?: ReactNode;
  content?: ReactNode;
  loading?: boolean;
}

export interface StepperProps extends Omit<MantineStepperProps, 'children'> {
  steps: StepItem[];
  variant?: 'default' | 'circle' | 'simple';
}

export function Stepper({
  steps,
  variant = 'default',
  ...props
}: StepperProps) {
  return (
    <MantineStepper color="primary" {...props}>
      {steps.map((step, index) => (
        <MantineStepper.Step
          key={index}
          label={step.label}
          description={step.description}
          icon={step.icon}
          loading={step.loading}
        >
          {step.content}
        </MantineStepper.Step>
      ))}
    </MantineStepper>
  );
}
