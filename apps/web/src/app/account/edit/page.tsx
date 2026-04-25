'use client';

import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Group,
  Select,
  Skeleton,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../../theme';
import { Text } from '../../../components/ui';
import { LoginBottomSheet } from '../../../components/auth/LoginBottomSheet';
import { StickyPageHeader } from '../../../components/navigation/StickyPageHeader';
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

const standardCardShadow = '0 4px 12px rgba(0,0,0,0.06)';

export default function EditAccountPage() {
  const router = useRouter();
  const auth = useAuth();
  const updateUser = useAppStore((state) => state.updateUser);
  const [loginOpen, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [flatNumber, setFlatNumber] = React.useState('');
  const [deliveryInstructions, setDeliveryInstructions] = React.useState('');
  const [customerId, setCustomerId] = React.useState<string | null>(null);

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

        const loadedCustomer = response.data.customer;
        const loadedCustomerId = loadedCustomer.id || null;
        const storageKey = loadedCustomerId
          ? `deliveryInstructions:${loadedCustomerId}`
          : null;
        const storedInstructions =
          typeof window !== 'undefined' && storageKey
            ? window.localStorage.getItem(storageKey) || ''
            : '';

        setName(loadedCustomer.name || '');
        setEmail(loadedCustomer.email || '');
        setPhone(loadedCustomer.mobileNumber || '');
        setFlatNumber(loadedCustomer.flatNumber || '');
        setSocietyId(loadedCustomer.societyId || null);
        setBuildingId(loadedCustomer.buildingId || null);
        setCustomerId(loadedCustomerId);
        setDeliveryInstructions(storedInstructions);
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

  const handleDiscardAndBack = () => {
    router.push('/account');
  };

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
        deliveryInstructions: deliveryInstructions.trim(),
      });

      if (typeof window !== 'undefined' && customerId) {
        window.localStorage.setItem(
          `deliveryInstructions:${customerId}`,
          deliveryInstructions.trim()
        );
      }

      updateUser({
        name: response.data.user.name,
        email: response.data.user.email,
        customerId: response.data.user.customerId,
        mobileNumber: response.data.user.mobileNumber,
      });

      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });

      router.push('/account');
    } catch {
      setErrorMessage("Couldn't update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: colors.surface }}
    >
      <LoginBottomSheet
        opened={loginOpen}
        onClose={closeLogin}
        returnUrl="/account/edit"
      />

      <StickyPageHeader title="Edit Profile" onBack={handleDiscardAndBack} />

      <Stack p={spacing.md} gap={spacing.md}>
        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        <Card
          withBorder
          p={spacing.lg}
          style={{
            borderRadius: radius.lg,
            borderColor: colors.border,
            backgroundColor: colors.background,
            boxShadow: standardCardShadow,
          }}
        >
          <Stack gap={spacing.md}>
            <Text size="sm" fw={typography.fontWeight.bold}>
              Personal Information
            </Text>

            {loadingProfile ? (
              <>
                <Skeleton height={44} radius="md" />
                <Skeleton height={44} radius="md" />
                <Skeleton height={20} radius="sm" width="30%" />
                <Skeleton height={44} radius="md" />
              </>
            ) : (
              <>
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

                <Stack gap={6}>
                  <Text size="sm" fw={typography.fontWeight.medium}>
                    Phone Number
                  </Text>
                  <Group
                    justify="space-between"
                    align="center"
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: radius.md,
                      padding: `10px ${spacing.sm}`,
                      minHeight: 44,
                    }}
                  >
                    <Text size="sm" fw={typography.fontWeight.semibold}>
                      {phone ? `+91 ${phone}` : '+91'}
                    </Text>
                    <Button
                      variant="subtle"
                      color="blue"
                      onClick={openLogin}
                      style={{ minHeight: 44, fontWeight: typography.fontWeight.semibold }}
                    >
                      Change Phone
                    </Button>
                  </Group>
                </Stack>
              </>
            )}
          </Stack>
        </Card>

        <Card
          withBorder
          p={spacing.lg}
          style={{
            borderRadius: radius.lg,
            borderColor: colors.border,
            backgroundColor: colors.background,
            boxShadow: standardCardShadow,
          }}
        >
          <Stack gap={spacing.md}>
            <Text size="sm" fw={typography.fontWeight.bold}>
              Delivery Address
            </Text>

            {loadingProfile ? (
              <>
                <Skeleton height={44} radius="md" />
                <Skeleton height={44} radius="md" />
                <Skeleton height={44} radius="md" />
                <Skeleton height={92} radius="md" />
              </>
            ) : (
              <>
                <Select
                  label="Society"
                  placeholder={
                    loadingSocieties ? 'Loading societies...' : 'Select society'
                  }
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

                <Textarea
                  label="Delivery Instructions (Optional)"
                  placeholder={'Leave at door\nCall when arriving'}
                  minRows={3}
                  maxRows={6}
                  value={deliveryInstructions}
                  onChange={(event) =>
                    setDeliveryInstructions(event.currentTarget.value)
                  }
                  disabled={loadingProfile}
                />
              </>
            )}
          </Stack>
        </Card>

        <Group grow>
          <Button
            variant="default"
            onClick={handleDiscardAndBack}
            style={{
              minHeight: 44,
              borderRadius: radius.md,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Cancel
          </Button>
          <Button
            size="md"
            leftSection={<IconDeviceFloppy size={18} />}
            onClick={handleSave}
            loading={isSubmitting}
            disabled={!isFormValid || loadingProfile}
            style={{
              minHeight: 44,
              borderRadius: radius.md,
              backgroundColor: colors.primary,
              fontWeight: typography.fontWeight.bold,
            }}
          >
            Update Profile
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
