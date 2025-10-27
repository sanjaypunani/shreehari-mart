import {
  Avatar as MantineAvatar,
  AvatarProps as MantineAvatarProps,
} from '@mantine/core';

export interface AvatarProps extends MantineAvatarProps {
  name?: string;
}

export function Avatar({ name, src, ...props }: AvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <MantineAvatar src={src} alt={name} color="primary" {...props}>
      {!src && name ? getInitials(name) : null}
    </MantineAvatar>
  );
}
