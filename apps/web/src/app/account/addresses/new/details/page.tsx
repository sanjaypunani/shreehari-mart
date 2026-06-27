'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { IconChevronLeft, IconMapPin } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../../../../theme';
import {
  useAddressesStore,
  useAuth,
  type AddressLabel,
} from '../../../../../store';

const LABELS: AddressLabel[] = ['Home', 'Work', 'Hotel', 'Other'];

export default function AddressFormPage() {
  const router = useRouter();
  const auth = useAuth();
  const draft = useAddressesStore((s) => s.draft);
  const upsertAddress = useAddressesStore((s) => s.upsertAddress);

  // If user landed here directly (no draft), bounce them back to map step
  React.useEffect(() => {
    if (!draft) {
      router.replace('/account/addresses/new');
    }
  }, [draft, router]);

  const [label, setLabel] = React.useState<AddressLabel>('Home');
  const [flat, setFlat] = React.useState('');
  const [landmark, setLandmark] = React.useState('');
  const [receiverName, setReceiverName] = React.useState(
    auth.user?.name || ''
  );
  const [receiverPhone, setReceiverPhone] = React.useState(
    auth.user?.mobileNumber || ''
  );

  const phoneDigits = receiverPhone.replace(/\D/g, '');
  const valid =
    flat.trim().length >= 2 &&
    receiverName.trim().length >= 2 &&
    phoneDigits.length === 10;

  const handleSave = () => {
    if (!valid || !draft) return;
    upsertAddress({
      label,
      area: draft.area,
      fullAddress: draft.fullAddress,
      flat: flat.trim(),
      landmark: landmark.trim() || undefined,
      receiverName: receiverName.trim(),
      receiverPhone: phoneDigits,
    });
    router.replace('/account/addresses');
  };

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
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
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Add address
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 20px 20px' }}>
        {/* Pin chip */}
        <div
          style={{
            padding: 14,
            borderRadius: 16,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <IconMapPin size={18} color={colors.primary} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {draft?.area || '—'}
            </div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 1,
              }}
            >
              {draft?.fullAddress || ''}
            </div>
          </div>
          <span
            onClick={() => router.back()}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: colors.primary,
              cursor: 'pointer',
            }}
          >
            Change
          </span>
        </div>

        {/* Label chips */}
        <SectionLabel>Save as</SectionLabel>
        <div
          style={{
            display: 'flex',
            gap: 8,
            margin: '10px 0 20px',
            flexWrap: 'wrap',
          }}
        >
          {LABELS.map((l) => {
            const active = label === l;
            return (
              <button
                key={l}
                onClick={() => setLabel(l)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 18,
                  background: active ? colors.primary : colors.surface,
                  color: active ? colors.text.inverse : colors.text.primary,
                  border: `1.5px solid ${active ? colors.primary : colors.border}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {l}
              </button>
            );
          })}
        </div>

        <FormField
          label="Flat / House no. / Building"
          placeholder="Apt 3B, Willowbrook Apartments"
          value={flat}
          onChange={setFlat}
        />
        <FormField
          label="Landmark (optional)"
          placeholder="Near Forum Mall"
          value={landmark}
          onChange={setLandmark}
        />
        <FormField
          label="Receiver name"
          placeholder="Juno Greene"
          value={receiverName}
          onChange={setReceiverName}
        />
        <FormField
          label="Receiver mobile"
          placeholder="98765 43210"
          value={receiverPhone}
          onChange={(v) => setReceiverPhone(v.replace(/\D/g, '').slice(0, 10))}
          inputMode="tel"
        />
      </div>

      {/* Save */}
      <div
        style={{
          padding: '14px 20px',
          paddingBottom: 'calc(14px + var(--safe-area-bottom))',
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <button
          disabled={!valid}
          onClick={handleSave}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 27,
            background: valid ? colors.primary : colors.surfaceAlt,
            color: valid ? colors.text.inverse : colors.text.faint,
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 0.3,
            cursor: valid ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          Save address
        </button>
      </div>
    </Box>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  inputMode?: 'tel' | 'text';
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: colors.text.secondary,
          marginBottom: 6,
          paddingLeft: 4,
        }}
      >
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: colors.text.secondary,
      }}
    >
      {children}
    </div>
  );
}
