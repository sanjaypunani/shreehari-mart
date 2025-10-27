'use client';

import React from 'react';
import {
  AppShell,
  Group,
  Burger,
  Text,
  Button,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconShoppingCart,
  IconUser,
  IconLogout,
  IconSettings,
  IconHeart,
  IconBox,
} from '@tabler/icons-react';
import Link from 'next/link';

export interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function Header({ opened, toggle }: HeaderProps) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text size="xl" fw={700} c="blue">
              Shreehari Mart
            </Text>
          </Link>
        </Group>

        <Group gap="md" visibleFrom="sm">
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <Button variant="subtle">Products</Button>
          </Link>
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Button variant="subtle">About</Button>
          </Link>
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            <Button variant="subtle">Contact</Button>
          </Link>
        </Group>

        <Group>
          <Button
            variant="subtle"
            leftSection={<IconShoppingCart size={20} />}
            visibleFrom="sm"
          >
            Cart (0)
          </Button>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Avatar color="blue" radius="xl">
                  <IconUser size={20} />
                </Avatar>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconUser style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconBox style={{ width: rem(14), height: rem(14) }} />
                }
              >
                My Orders
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconHeart style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Wishlist
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                leftSection={
                  <IconLogout style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
