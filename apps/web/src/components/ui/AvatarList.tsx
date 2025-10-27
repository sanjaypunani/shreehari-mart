import { Group, GroupProps, Tooltip } from '@mantine/core';
import { Avatar, AvatarProps } from './Avatar';

export interface AvatarListItem {
  name: string;
  src?: string;
  color?: string;
}

export interface AvatarListProps extends Omit<GroupProps, 'children'> {
  avatars: AvatarListItem[];
  size?: AvatarProps['size'];
  max?: number;
  withTooltip?: boolean;
  spacing?: number;
}

export function AvatarList({
  avatars,
  size = 'md',
  max = 5,
  withTooltip = true,
  spacing = -8,
  ...props
}: AvatarListProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <Group gap={0} {...props}>
      {visibleAvatars.map((avatar, index) => {
        const avatarElement = (
          <div
            key={index}
            style={{
              marginLeft: index === 0 ? 0 : spacing,
              position: 'relative',
              zIndex: visibleAvatars.length - index,
              border: '2px solid white',
              borderRadius: '50%',
            }}
          >
            <Avatar
              name={avatar.name}
              src={avatar.src}
              size={size}
              color={avatar.color}
            />
          </div>
        );

        if (withTooltip) {
          return (
            <Tooltip key={index} label={avatar.name} withArrow>
              {avatarElement}
            </Tooltip>
          );
        }

        return avatarElement;
      })}

      {remainingCount > 0 && (
        <div
          style={{
            marginLeft: spacing,
            position: 'relative',
            zIndex: 0,
            border: '2px solid white',
            borderRadius: '50%',
          }}
        >
          <Avatar
            name={`+${remainingCount}`}
            size={size}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
            }}
          />
        </div>
      )}
    </Group>
  );
}
