'use client';

import React from 'react';
import {
  Box,
  Stack,
  TextInput,
  Select,
  Button,
  Alert,
} from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, spacing, typography, radius } from '../../../theme';
import { Text } from '../../../components/ui';
import { StickyPageHeader } from '../../../components/navigation/StickyPageHeader';
import { authApi, buildingsApi, societiesApi } from '../../../lib/api/services';
import { getErrorMessage } from '../../../lib/api-client';
import { useAppStore } from '../../../store/app-store';

interface Option {
  value: string;
  label: string;
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAppStore((state) => state.login);

  const phone = searchParams.get('phone') || '';
  const returnUrl = searchParams.get('returnUrl');

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [societyId, setSocietyId] = React.useState<string | null>(null);
  const [buildingId, setBuildingId] = React.useState<string | null>(null);
  const [flatNumber, setFlatNumber] = React.useState('');

  const [societyOptions, setSocietyOptions] = React.useState<Option[]>([]);
  const [buildingOptions, setBuildingOptions] = React.useState<Option[]>([]);

  const [loadingSocieties, setLoadingSocieties] = React.useState(false);
  const [loadingBuildings, setLoadingBuildings] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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

        const options: Option[] = (response.data || []).map((building: any) => ({
          value: building.id,
          label: building.name,
        }));

        setBuildingOptions(options);
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
  }, [societyId]);

  const isFormValid =
    name.trim().length > 1 &&
    email.trim().length > 3 &&
    !!societyId &&
    !!buildingId &&
    flatNumber.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await authApi.completeSignup({
        name: name.trim(),
        email: email.trim(),
        societyId: societyId!,
        buildingId: buildingId!,
        flatNumber: flatNumber.trim(),
      });

      const authenticatedUser = response.data.user;

      login(
        {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          mobileNumber: authenticatedUser.mobileNumber,
          customerId: authenticatedUser.customerId,
          role:
            authenticatedUser.role === 'admin' || authenticatedUser.role === 'staff'
              ? authenticatedUser.role
              : 'customer',
        },
        response.data.token
      );

      router.push(returnUrl ? decodeURIComponent(returnUrl) : '/account');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        paddingBottom: `calc(${spacing.xl} + var(--safe-area-bottom-with-keyboard))`,
        scrollPaddingBottom: 'calc(140px + var(--safe-area-bottom-with-keyboard))',
      }}
    >
      <StickyPageHeader
        title="Complete Signup"
        onBack={() => router.back()}
      >
        <Stack gap={2}>
          <Text variant="secondary" size="sm">
            Add your details for +91-{phone}
          </Text>
        </Stack>
      </StickyPageHeader>

      <Stack gap={spacing.lg} px={spacing.md} pt={spacing.md}>

        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        <Stack
          gap={spacing.md}
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.lg,
            padding: spacing.md,
          }}
        >
          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <TextInput
            label="Email Address"
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />

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
            disabled={loadingSocieties}
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
            disabled={!societyId || loadingBuildings}
          />

          <TextInput
            label="Flat Number"
            placeholder="e.g. A-302"
            value={flatNumber}
            onChange={(event) => setFlatNumber(event.currentTarget.value)}
          />
        </Stack>

        <Button
          fullWidth
          size="lg"
          color={colors.primary}
          radius="md"
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
          onClick={handleSubmit}
          styles={{
            root: {
              height: '50px',
              backgroundColor:
                isFormValid && !isSubmitting ? colors.primary : '#FFCCB0',
              color: colors.text.inverse,
            },
            label: {
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
            },
          }}
        >
          COMPLETE SIGNUP
        </Button>
      </Stack>
    </Box>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense
      fallback={
        <Box p={spacing.md}>
          <Text>Loading signup...</Text>
        </Box>
      }
    >
      <SignupPageContent />
    </React.Suspense>
  );
}
