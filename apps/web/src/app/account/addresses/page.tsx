'use client';

import React from 'react';
import { Box } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconHome,
  IconBriefcase,
  IconMapPin,
  IconBuildingSkyscraper,
  IconDots,
  IconTrash,
  IconCheck,
} from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors } from '../../../theme';
import {
  useAddressesStore,
  type Address,
  type AddressLabel,
} from '../../../store';

const labelIcon = (label: AddressLabel) => {
  switch (label) {
    case 'Home':
      return IconHome;
    case 'Work':
      return IconBriefcase;
    case 'Hotel':
      return IconBuildingSkyscraper;
    default:
      return IconMapPin;
  }
};

function AddressListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectMode = searchParams.get('select') === '1';
  const returnUrl = searchParams.get('returnUrl');

  const addresses = useAddressesStore((s) => s.addresses);
  const removeAddress = useAddressesStore((s) => s.removeAddress);
  const setDefault = useAddressesStore((s) => s.setDefault);

  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);

  const handleAdd = () => {
    router.push('/account/addresses/new');
  };

  const handleSelect = (address: Address) => {
    if (selectMode) {
      setDefault(address.id);
      router.push(returnUrl || '/cart');
    }
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
          {selectMode ? 'Choose address' : 'Saved addresses'}
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 20px 30px' }}>
        {/* Add new address card */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 18,
            background: colors.surface,
            border: `1.5px dashed ${colors.borderStrong}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
            color: colors.text.primary,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconPlus size={18} color={colors.text.inverse} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              Add a new address
            </div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              Pick from map or enter manually
            </div>
          </div>
          <IconChevronRight size={16} color={colors.text.faint} />
        </button>

        {addresses.length > 0 && (
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: colors.text.secondary,
              marginBottom: 10,
              padding: '0 4px',
            }}
          >
            Your addresses
          </div>
        )}

        {addresses.length === 0 ? (
          <div
            style={{
              padding: 32,
              borderRadius: 20,
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: colors.surfaceAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <IconMapPin size={28} color={colors.text.faint} />
            </div>
            <div
              style={{
                fontFamily:
                  "var(--font-heading), 'Instrument Serif', Georgia, serif",
                fontSize: 22,
                lineHeight: 1.1,
              }}
            >
              No saved addresses
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.text.secondary,
                marginTop: 6,
              }}
            >
              Add your first address to start ordering
            </div>
          </div>
        ) : (
          addresses.map((a) => {
            const Icon = labelIcon(a.label);
            const isMenuOpen = menuOpenId === a.id;
            return (
              <div
                key={a.id}
                onClick={() => handleSelect(a)}
                style={{
                  position: 'relative',
                  padding: 16,
                  borderRadius: 18,
                  background: colors.surface,
                  border: `1.5px solid ${a.isDefault ? colors.primary : colors.border}`,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: selectMode ? 'pointer' : 'default',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: colors.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={17} color={colors.text.primary} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700 }}>
                      {a.label}
                    </span>
                    {a.isDefault && (
                      <span
                        style={{
                          fontSize: 9,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: colors.secondarySoft,
                          color: colors.secondary,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase' as const,
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.text.primary,
                      marginTop: 3,
                    }}
                  >
                    {a.flat}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: colors.text.secondary,
                      marginTop: 1,
                    }}
                  >
                    {a.area} · {a.fullAddress}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId((cur) => (cur === a.id ? null : a.id));
                  }}
                  aria-label="Address actions"
                  style={{
                    padding: 6,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconDots size={16} color={colors.text.faint} />
                </button>

                {isMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: 56,
                      zIndex: 5,
                      background: colors.surface,
                      borderRadius: 12,
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 12px 28px rgba(28,42,33,0.16)',
                      padding: 6,
                      minWidth: 160,
                    }}
                  >
                    {!a.isDefault && (
                      <button
                        onClick={() => {
                          setDefault(a.id);
                          setMenuOpenId(null);
                        }}
                        style={menuItemStyle}
                      >
                        <IconCheck size={14} color={colors.text.primary} />
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => {
                        removeAddress(a.id);
                        setMenuOpenId(null);
                      }}
                      style={{ ...menuItemStyle, color: colors.error }}
                    >
                      <IconTrash size={14} color={colors.error} />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Box>
  );
}

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  color: colors.text.primary,
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  textAlign: 'left' as const,
};

export default function AddressListPage() {
  return (
    <React.Suspense fallback={null}>
      <AddressListContent />
    </React.Suspense>
  );
}
