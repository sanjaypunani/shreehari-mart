import React from 'react';
import { AppShell, Group, Text, Button, Stack, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconShoppingCart,
  IconBox,
  IconUsers,
  IconBuilding,
  IconHome,
  IconLogout,
  IconReceipt,
} from '@tabler/icons-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { icon: IconDashboard, label: 'Dashboard', href: '/' },
  { icon: IconShoppingCart, label: 'Orders', href: '/orders' },
  { icon: IconBox, label: 'Products', href: '/products' },
  { icon: IconUsers, label: 'Customers', href: '/customers' },
  { icon: IconReceipt, label: 'Monthly Billing', href: '/monthly-billing' },
  { icon: IconHome, label: 'Societies', href: '/societies' },
  { icon: IconBuilding, label: 'Buildings', href: '/buildings' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} size="lg" c="shreehari-brand">
              Shreehari Mart
            </Text>
          </Group>
          <Button variant="light" leftSection={<IconLogout size={16} />}>
            Logout
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.href}
                component={Link}
                to={item.href}
                variant={isActive ? 'filled' : 'subtle'}
                color={isActive ? 'shreehari-brand' : 'gray'}
                leftSection={<item.icon size={16} />}
                justify="flex-start"
                fullWidth
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
