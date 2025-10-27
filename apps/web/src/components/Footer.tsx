'use client';

import React from 'react';
import {
  AppShell,
  Container,
  Group,
  Text,
  Anchor,
  Stack,
  Grid,
  Divider,
  ActionIcon,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
} from '@tabler/icons-react';
import Link from 'next/link';

export function Footer() {
  return (
    <AppShell.Footer>
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="sm">
              <Text size="lg" fw={700} c="blue">
                Shreehari Mart
              </Text>
              <Text size="sm" c="dimmed">
                Your one-stop shop for all your daily needs. Quality products at
                affordable prices.
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600}>
                Quick Links
              </Text>
              <Anchor component={Link} href="/products" size="sm" c="dimmed">
                Products
              </Anchor>
              <Anchor component={Link} href="/about" size="sm" c="dimmed">
                About Us
              </Anchor>
              <Anchor component={Link} href="/contact" size="sm" c="dimmed">
                Contact
              </Anchor>
              <Anchor component={Link} href="/faq" size="sm" c="dimmed">
                FAQ
              </Anchor>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600}>
                Customer Service
              </Text>
              <Anchor component={Link} href="/shipping" size="sm" c="dimmed">
                Shipping Info
              </Anchor>
              <Anchor component={Link} href="/returns" size="sm" c="dimmed">
                Returns
              </Anchor>
              <Anchor component={Link} href="/privacy" size="sm" c="dimmed">
                Privacy Policy
              </Anchor>
              <Anchor component={Link} href="/terms" size="sm" c="dimmed">
                Terms & Conditions
              </Anchor>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600}>
                Connect With Us
              </Text>
              <Group gap="xs">
                <ActionIcon variant="subtle" size="lg" radius="xl">
                  <IconBrandFacebook size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" size="lg" radius="xl">
                  <IconBrandTwitter size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" size="lg" radius="xl">
                  <IconBrandInstagram size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" size="lg" radius="xl">
                  <IconBrandYoutube size={20} />
                </ActionIcon>
              </Group>
              <Text size="sm" c="dimmed">
                Email: info@shreeharimart.com
              </Text>
              <Text size="sm" c="dimmed">
                Phone: +91 1234567890
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            © 2025 Shreehari Mart. All rights reserved.
          </Text>
          <Group gap="xs">
            <Anchor component={Link} href="/privacy" size="sm" c="dimmed">
              Privacy
            </Anchor>
            <Text size="sm" c="dimmed">
              •
            </Text>
            <Anchor component={Link} href="/terms" size="sm" c="dimmed">
              Terms
            </Anchor>
          </Group>
        </Group>
      </Container>
    </AppShell.Footer>
  );
}
