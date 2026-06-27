'use client';

import React from 'react';
import { Box, Alert, Select } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors } from '../../../theme';
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
        if (cancelled) return;
        setSocietyOptions(
          (response.data || []).map((society: any) => ({
            value: society.id,
            label: society.name,
          }))
        );
      } catch (error) {
        if (!cancelled) setErrorMessage(getErrorMessage(error));
      } finally {
        if (!cancelled) setLoadingSocieties(false);
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
        if (cancelled) return;
        setBuildingOptions(
          (response.data || []).map((building: any) => ({
            value: building.id,
            label: building.name,
          }))
        );
      } catch (error) {
        if (!cancelled) setErrorMessage(getErrorMessage(error));
      } finally {
        if (!cancelled) setLoadingBuildings(false);
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
    if (!isFormValid || isSubmitting) return;

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

      router.replace(returnUrl ? decodeURIComponent(returnUrl) : '/account');
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
        color: colors.text.primary,
        paddingBottom: 'calc(110px + var(--safe-area-bottom))',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconChevronLeft size={18} color={colors.text.primary} />
        </button>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: -0.6,
          }}
        >
          A few <span style={{ fontStyle: 'italic' }}>last details</span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: colors.text.secondary,
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          Tell us where to deliver your fresh harvests for{' '}
          <b style={{ color: colors.text.primary }}>+91 {phone}</b>
        </div>

        {errorMessage && (
          <Alert color="red" radius="md" mt={20}>
            {errorMessage}
          </Alert>
        )}

        {/* Form */}
        <SectionLabel style={{ marginTop: 28 }}>About you</SectionLabel>
        <div style={{ marginTop: 8 }}>
          <FormField
            label="Full name"
            placeholder="Juno Greene"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormField
            label="Email address"
            placeholder="juno@willowbrook.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <SectionLabel style={{ marginTop: 24 }}>
          Delivery location
        </SectionLabel>
        <div style={{ marginTop: 8 }}>
          <FieldLabel>Society</FieldLabel>
          <Select
            placeholder={
              loadingSocieties ? 'Loading societies…' : 'Select society'
            }
            data={societyOptions}
            value={societyId}
            onChange={(value) => {
              setSocietyId(value);
              setBuildingId(null);
            }}
            searchable
            disabled={loadingSocieties}
            mb={12}
            styles={{
              input: {
                padding: '14px 16px',
                borderRadius: 14,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                fontSize: 14,
                color: colors.text.primary,
                fontFamily: 'inherit',
                height: 'auto',
                minHeight: 48,
              },
            }}
          />
          <FieldLabel>Building</FieldLabel>
          <Select
            placeholder={
              societyId
                ? loadingBuildings
                  ? 'Loading buildings…'
                  : 'Select building'
                : 'Select society first'
            }
            data={buildingOptions}
            value={buildingId}
            onChange={setBuildingId}
            searchable
            disabled={!societyId || loadingBuildings}
            mb={12}
            styles={{
              input: {
                padding: '14px 16px',
                borderRadius: 14,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                fontSize: 14,
                color: colors.text.primary,
                fontFamily: 'inherit',
                height: 'auto',
                minHeight: 48,
              },
            }}
          />
          <FormField
            label="Flat number"
            placeholder="A-302"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
          />
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 11,
            color: colors.text.faint,
            lineHeight: 1.6,
          }}
        >
          By signing up you agree to receive order updates over SMS and email.
          Standard rates may apply.
        </div>
      </div>

      {/* Sticky save button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 20px',
          paddingBottom: 'calc(14px + var(--safe-area-bottom))',
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <button
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 27,
            background:
              isFormValid && !isSubmitting ? colors.primary : colors.text.faint,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor:
              isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            letterSpacing: 0.3,
          }}
        >
          {isSubmitting ? 'Creating account…' : 'COMPLETE SIGNUP'}
        </button>
      </div>
    </Box>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense fallback={null}>
      <SignupPageContent />
    </React.Suspense>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          fontSize: 14,
          fontFamily: 'inherit',
          color: colors.text.primary,
          outline: 'none',
        }}
      />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: colors.text.secondary,
        fontWeight: 500,
        marginBottom: 4,
        paddingLeft: 4,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: colors.text.secondary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
