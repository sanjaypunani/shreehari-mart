import React, { ReactNode } from 'react';
import {
  Modal as MantineModal,
  ModalProps as MantineModalProps,
  Stack,
  Group,
  Title,
  Text,
  Divider,
} from '@mantine/core';
import { Button } from './Button';

export interface ModalAction {
  label: string;
  variant?:
    | 'filled'
    | 'outline'
    | 'light'
    | 'subtle'
    | 'default'
    | 'white'
    | 'gradient'
    | 'brand';
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  autoClose?: boolean;
}

export interface ModalProps extends Omit<MantineModalProps, 'children'> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ModalAction[];
  actionsPosition?: 'left' | 'center' | 'right' | 'apart';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  subtitle,
  actions = [],
  actionsPosition = 'right',
  spacing = 'md',
  withCloseButton = true,
  onClose,
  opened,
  ...props
}) => {
  const getActionsJustify = () => {
    switch (actionsPosition) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      case 'apart':
        return 'space-between';
      default:
        return 'flex-end';
    }
  };

  const handleActionClick = (action: ModalAction) => {
    action.onClick();
    if (action.autoClose !== false && onClose) {
      onClose();
    }
  };

  return (
    <MantineModal
      opened={opened}
      withCloseButton={withCloseButton}
      onClose={onClose}
      {...props}
    >
      <Stack gap={spacing}>
        {(title || subtitle) && (
          <>
            {title && <Title order={3}>{title}</Title>}
            {subtitle && <Text c="dimmed">{subtitle}</Text>}
            <Divider />
          </>
        )}

        <div>{children}</div>

        {actions.length > 0 && (
          <>
            <Divider />
            <Group justify={getActionsJustify()}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  color={action.color}
                  loading={action.loading}
                  disabled={action.disabled}
                  onClick={() => handleActionClick(action)}
                >
                  {action.label}
                </Button>
              ))}
            </Group>
          </>
        )}
      </Stack>
    </MantineModal>
  );
};

// Confirmation Modal for common delete/destructive actions
export interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger',
}) => {
  const getConfirmColor = () => {
    switch (variant) {
      case 'danger':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'info':
        return 'blue';
      default:
        return 'red';
    }
  };

  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      variant: 'outline',
      onClick: onClose,
      disabled: loading,
      autoClose: true,
    },
    {
      label: confirmLabel,
      variant: 'filled',
      color: getConfirmColor(),
      onClick: onConfirm,
      loading: loading,
      autoClose: false, // Let the parent handle closing after action
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="sm"
      centered
      actions={actions}
      withCloseButton={!loading}
    >
      <Text>{message}</Text>
    </Modal>
  );
};
