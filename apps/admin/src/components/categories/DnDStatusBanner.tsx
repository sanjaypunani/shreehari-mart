import React from 'react';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface DnDStatusBannerProps {
  visible: boolean;
}

export const DnDStatusBanner: React.FC<DnDStatusBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Alert
      variant="light"
      color="yellow"
      title="Reordering unavailable"
      icon={<IconInfoCircle size={16} />}
      role="status"
      aria-live="polite"
    >
      Clear the search field to drag and reorder categories.
    </Alert>
  );
};
