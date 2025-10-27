import {
  Modal as MantineModal,
  ModalProps as MantineModalProps,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface ModalProps
  extends Omit<MantineModalProps, 'opened' | 'onClose'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  centered = true,
  withCloseButton = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  footer,
  ...props
}: ModalProps) {
  return (
    <MantineModal
      opened={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      withCloseButton={withCloseButton}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      {...props}
    >
      <Stack gap="md">
        {children}
        {footer && (
          <Group gap="sm" mt="md">
            {footer}
          </Group>
        )}
      </Stack>
    </MantineModal>
  );
}

// Dialog component (alias for Modal with specific defaults)
export interface DialogProps extends Omit<ModalProps, 'size'> {
  size?: 'xs' | 'sm' | 'md';
}

export function Dialog({ size = 'sm', ...props }: DialogProps) {
  return <Modal size={size} {...props} />;
}

// Confirmation Dialog
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false,
}: ConfirmDialogProps) {
  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Text>{message}</Text>
      <Group gap="sm" mt="xl" justify="flex-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={getConfirmButtonVariant()}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          loading={loading}
        >
          {confirmText}
        </Button>
      </Group>
    </Modal>
  );
}
