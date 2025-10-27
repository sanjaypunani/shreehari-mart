import { Avatar } from '@mantine/core';
import { AvatarGroupProps as MantineAvatarGroupProps } from '@mantine/core';

export interface AvatarGroupProps extends MantineAvatarGroupProps {
  avatars: Array<{ src?: string; name: string }>;
  max?: number;
}

export function AvatarGroup({ avatars, max = 3, ...props }: AvatarGroupProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayAvatars = max ? avatars.slice(0, max) : avatars;
  const remaining = max && avatars.length > max ? avatars.length - max : 0;

  return (
    <Avatar.Group {...props}>
      {displayAvatars.map((avatar, index) => (
        <Avatar key={index} src={avatar.src} alt={avatar.name} color="primary">
          {!avatar.src ? getInitials(avatar.name) : null}
        </Avatar>
      ))}
      {remaining > 0 && <Avatar color="primary">+{remaining}</Avatar>}
    </Avatar.Group>
  );
}
