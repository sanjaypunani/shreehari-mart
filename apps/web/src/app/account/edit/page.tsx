'use client';

import React from 'react';
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Group,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../../theme';
import { Text } from '../../../components/ui';
import {
  authApi,
  buildingsApi,
  societiesApi,
} from '../../../lib/api/services';
import { getErrorMessage } from '../../../lib/api-client';
import { useAuth, useAppStore } from '../../../store/app-store';

interface Option {
  value: string;
  label: string;
}

export default function EditAccountPage() {
  const router = useRouter();
  const auth = useAuth();
  const updateUser = useAppStore((state) => state.updateUser);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [flatNumber, setFlatNumber] = React.useState('');

  const [societyId, setSocietyId] = React.useState<string | null>(null);
  const [buildingId, setBuildingId] = React.useState<string | null>(null);

  const [societyOptions, setSocietyOptions] = React.useState<Option[]>([]);
  const [buildingOptions, setBuildingOptions] = React.useState<Option[]>([]);

  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [loadingSocieties, setLoadingSocieties] = React.useState(false);
  const [loadingBuildings, setLoadingBuildings] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace('/account');
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setErrorMessage(null);

        const response = await authApi.me();

        if (cancelled) {
          return;
        }

        if (response.data.requiresSignup || !response.data.customer) {
          router.replace('/account/signup');
          return;
        }

        setName(response.data.customer.name || '');
        setEmail(response.data.customer.email || '');
        setPhone(response.data.customer.mobileNumber || '');
        setFlatNumber(response.data.customer.flatNumber || '');
        setSocietyId(response.data.customer.societyId || null);
        setBuildingId(response.data.customer.buildingId || null);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, router]);

  React.useEffect(() => {
    let cancelled = false;

    const loadSocieties = async () => {
      try {
        setLoadingSocieties(true);
        const response = await societiesApi.getAll();

        if (cancelled) {
          return;
        }

        const options: Option[] = (response.data || []).map((society: any) => ({
          value: society.id,
          label: society.name,
        }));

        setSocietyOptions(options);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoadingSocieties(false);
        }
      }
    };

    loadSocieties();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const loadBuildings = async () => {
      if (!societyId) {
        setBuildingOptions([]);
        setBuildingId(null);
        return;
      }

      try {
        setLoadingBuildings(true);

        const response = await buildingsApi.getAll({ societyId });

        if (cancelled) {
          return;
        }

        const rawBuildings = Array.isArray(response.data) ? response.data : [];

        const options: Option[] = rawBuildings.map((building: any) => ({
          value: building.id,
          label: building.name,
        }));

        setBuildingOptions(options);

        if (buildingId && !options.some((option) => option.value === buildingId)) {
          setBuildingId(null);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoadingBuildings(false);
        }
      }
    };

    loadBuildings();

    return () => {
      cancelled = true;
    };
  }, [societyId, buildingId]);

  const isFormValid =
    name.trim().length > 1 &&
    email.trim().length > 3 &&
    !!societyId &&
    !!buildingId &&
    flatNumber.trim().length > 0;

  const handleSave = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await authApi.updateProfile({
        name: name.trim(),
        email: email.trim(),
        societyId: societyId!,
        buildingId: buildingId!,
        flatNumber: flatNumber.trim(),
      });

      updateUser({
        name: response.data.user.name,
        email: response.data.user.email,
        customerId: response.data.user.customerId,
        mobileNumber: response.data.user.mobileNumber,
      });

      notifications.show({
        title: 'Profile Updated',
        message: 'Your profile details were updated successfully.',
        color: 'green',
      });

      router.push('/account');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: '#f2f5f7' }}
    >
      <Box
        px={spacing.md}
        pb={spacing.lg}
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
        }}
      >
        <Group justify="space-between" align="center">
          <ActionIcon variant="subtle" onClick={() => router.back()}>
            <IconArrowLeft size={22} color={colors.text.primary} />
          </ActionIcon>
          <Text size="lg" fw={typography.fontWeight.bold}>
            Edit Profile
          </Text>
          <Box w={34} />
        </Group>
      </Box>

      <Stack p={spacing.md} gap={spacing.md}>
        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        <Card
          withBorder
          p={spacing.lg}
          style={{
            borderRadius: radius.lg,
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Stack gap={spacing.md}>
            <Text size="sm" fw={typography.fontWeight.bold}>
              Personal Details
            </Text>

            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              disabled={loadingProfile}
              styles={{ label: { marginBottom: 6 } }}
            />

            <TextInput
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              disabled={loadingProfile}
              styles={{ label: { marginBottom: 6 } }}
            />

            <TextInput
              label="Phone Number"
              value={phone ? `+91 ${phone}` : ''}
              readOnly
              styles={{
                label: { marginBottom: 6 },
                input: { backgroundColor: colors.surface },
              }}
            />
          </Stack>
        </Card>

        <Card
          withBorder
          p={spacing.lg}
          style={{
            borderRadius: radius.lg,
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Stack gap={spacing.md}>
            <Text size="sm" fw={typography.fontWeight.bold}>
              Address Details
            </Text>

            <Select
              label="Society"
              placeholder={loadingSocieties ? 'Loading societies...' : 'Select society'}
              data={societyOptions}
              value={societyId}
              onChange={(value) => {
                setSocietyId(value);
                setBuildingId(null);
              }}
              searchable
              disabled={loadingSocieties || loadingProfile}
            />

            <Select
              label="Building"
              placeholder={
                societyId
                  ? loadingBuildings
                    ? 'Loading buildings...'
                    : 'Select building'
                  : 'Select society first'
              }
              data={buildingOptions}
              value={buildingId}
              onChange={setBuildingId}
              searchable
              disabled={!societyId || loadingBuildings || loadingProfile}
            />

            <TextInput
              label="Flat / House Number"
              placeholder="e.g. A-302"
              value={flatNumber}
              onChange={(event) => setFlatNumber(event.currentTarget.value)}
              disabled={loadingProfile}
              styles={{ label: { marginBottom: 6 } }}
            />
          </Stack>
        </Card>

        <Button
          fullWidth
          size="md"
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={handleSave}
          loading={isSubmitting}
          disabled={!isFormValid || loadingProfile}
          style={{
            height: 48,
            borderRadius: radius.md,
            backgroundColor: colors.primary,
            fontWeight: typography.fontWeight.bold,
          }}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
