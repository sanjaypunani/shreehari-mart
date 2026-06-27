'use client';

import React from 'react';
import { Box, Skeleton, Stack } from '@mantine/core';
import {
  IconChevronRight,
  IconSettings,
  IconReceipt,
  IconHeart,
  IconMapPin,
  IconCreditCard,
  IconBell,
  IconGift,
  IconLeaf,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors, spacing } from '../../theme';
import { Text } from '../../components/ui';
import { authApi, AuthProfilePayload } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';
import { useAuth, useAppStore } from '../../store/app-store';

export default function AccountPage() {
  const router = useRouter();
  const auth = useAuth();
  const logout = useAppStore((state) => state.logout);
  const updateUser = useAppStore((state) => state.updateUser);
  const goToLogin = () => router.push('/login?returnUrl=%2Faccount');

  const [profile, setProfile] = React.useState<AuthProfilePayload | null>(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setErrorMessage(null);

        const response = await authApi.me();

        if (cancelled) return;

        if (response.data.requiresSignup || !response.data.customer) {
          router.replace('/account/signup');
          return;
        }

        setProfile(response.data);

        updateUser({
          name: response.data.user.name,
          email: response.data.user.email,
          customerId: response.data.user.customerId,
          mobileNumber: response.data.user.mobileNumber,
        });
      } catch (error) {
        if (!cancelled) {
          const statusCode = (error as any)?.response?.status;
          if (statusCode === 401) {
            logout();
            return;
          }
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, router, updateUser, logout]);

  const customerName =
    profile?.customer?.name || auth.user?.name || 'Guest Customer';
  const customerPhone = profile?.customer?.mobileNumber
    ? `+91 ${profile.customer.mobileNumber}`
    : auth.user?.mobileNumber
      ? `+91 ${auth.user.mobileNumber}`
      : '';
  const customerEmail = profile?.customer?.email || auth.user?.email || '';
  const isMonthlyEnabled = !!profile?.customer?.isMonthlyPayment;

  // Not authenticated
  if (!auth.isAuthenticated) {
    return (
      <Box
        style={{
          height: '100dvh',
          backgroundColor: colors.background,
          display: 'flex',
          flexDirection: 'column',
          color: colors.text.primary,
        }}
      >
        <Box
          style={{
            padding: '12px 16px',
            paddingTop: 'calc(var(--safe-area-top) + 12px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: -0.2,
            }}
          >
            Profile
          </div>
        </Box>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 30,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <IconUser size={36} color={colors.text.inverse} />
          </div>
          <div
            style={{
              fontFamily:
                "var(--font-heading), 'Instrument Serif', Georgia, serif",
              fontSize: 28,
              lineHeight: 1.1,
              letterSpacing: -0.5,
            }}
          >
            Welcome to <span style={{ fontStyle: 'italic' }}>Cropzo</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.text.secondary,
              marginTop: 10,
              lineHeight: 1.5,
              maxWidth: 260,
            }}
          >
            Track deliveries, reorder in one tap, and manage your farm-fresh
            orders.
          </div>
          <button
            onClick={goToLogin}
            style={{
              marginTop: 28,
              width: '100%',
              maxWidth: 280,
              height: 54,
              borderRadius: 27,
              background: colors.primary,
              color: colors.text.inverse,
              border: 'none',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Login / Signup
          </button>
        </div>
      </Box>
    );
  }

  // Authenticated
  return (
    <Box
      style={{
        height: '100dvh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        color: colors.text.primary,
      }}
    >
      <Box
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: -0.2,
          }}
        >
          Profile
        </div>
        <button
          onClick={() => router.push('/account/edit')}
          aria-label="Edit profile"
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
          <IconSettings size={17} color={colors.text.primary} />
        </button>
      </Box>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '10px 20px 40px',
        }}
      >
        {loadingProfile ? (
          <Stack gap={spacing.sm} mt={spacing.sm}>
            <Skeleton height={72} radius="xl" />
            <Skeleton height={14} width="50%" radius="sm" />
          </Stack>
        ) : (
          <>
            {errorMessage && (
              <Text size="sm" c="red" mb={spacing.sm}>
                {errorMessage}
              </Text>
            )}

            {/* Avatar section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 4px 20px',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  overflow: 'hidden',
                  border: `2px solid ${colors.primary}`,
                  background: colors.surfaceAlt,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconUser size={32} color={colors.text.secondary} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily:
                      "var(--font-heading), 'Instrument Serif', Georgia, serif",
                    fontSize: 26,
                    lineHeight: 1,
                  }}
                >
                  {customerName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.text.secondary,
                    marginTop: 4,
                  }}
                >
                  {[customerPhone, customerEmail].filter(Boolean).join(' · ')}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 6,
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: colors.secondarySoft,
                    color: colors.secondary,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {isMonthlyEnabled ? 'Monthly Billing' : 'Pay per order'}
                </div>
              </div>
            </div>

            {/* Seasonal impact card */}
            <div
              style={{
                padding: 18,
                borderRadius: 20,
                background: colors.primary,
                color: colors.text.inverse,
                marginBottom: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase' as const,
                  opacity: 0.8,
                }}
              >
                Your impact
              </div>
              <div
                style={{
                  fontFamily:
                    "var(--font-heading), 'Instrument Serif', Georgia, serif",
                  fontSize: 24,
                  lineHeight: 1.1,
                  marginTop: 6,
                }}
              >
                Supporting{' '}
                <span style={{ fontStyle: 'italic' }}>local farmers</span>
                <br />
                with every order.
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: -24,
                  bottom: -24,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  background: 'rgba(255,255,255,0.1)',
                }}
              />
            </div>

            {/* Menu groups */}
            {(
              [
                {
                  s: 'Shopping',
                  items: [
                    {
                      icon: IconReceipt,
                      t: 'Orders & returns',
                      onClick: () => router.push('/orders'),
                    },
                    { icon: IconHeart, t: 'Favorites' },
                    {
                      icon: IconMapPin,
                      t: 'Addresses',
                      onClick: () => router.push('/account/addresses'),
                    },
                    {
                      icon: IconCreditCard,
                      t: 'Payment methods',
                      onClick: () => router.push('/account/payment-methods'),
                    },
                  ],
                },
                {
                  s: 'Preferences',
                  items: [
                    { icon: IconBell, t: 'Notifications' },
                    {
                      icon: IconGift,
                      t: 'Refer a friend',
                      d: 'Earn ₹100',
                      onClick: () => router.push('/refer'),
                    },
                    { icon: IconLeaf, t: 'Dietary preferences' },
                  ],
                },
                {
                  s: 'Support',
                  items: [
                    { icon: IconSettings, t: 'Help center' },
                    { icon: IconLogout, t: 'Sign out', onClick: logout },
                  ],
                },
              ] as Array<{
                s: string;
                items: Array<{
                  icon: typeof IconReceipt;
                  t: string;
                  d?: string;
                  onClick?: () => void;
                }>;
              }>
            ).map((group) => (
              <div key={group.s} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase' as const,
                    color: colors.text.secondary,
                    padding: '0 4px 8px',
                  }}
                >
                  {group.s}
                </div>
                <div
                  style={{
                    background: colors.surface,
                    borderRadius: 18,
                    border: `1px solid ${colors.border}`,
                    overflow: 'hidden',
                  }}
                >
                  {group.items.map((it, i, arr) => {
                    const IconComponent = it.icon;
                    return (
                      <div
                        key={it.t}
                        onClick={it.onClick}
                        style={{
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          cursor: it.onClick ? 'pointer' : 'default',
                          borderBottom:
                            i < arr.length - 1
                              ? `1px solid ${colors.border}`
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 9,
                            background: colors.surfaceAlt,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent
                            size={15}
                            color={colors.text.primary}
                          />
                        </div>
                        <div
                          style={{
                            flex: 1,
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {it.t}
                        </div>
                        {'d' in it && it.d && (
                          <div
                            style={{
                              fontSize: 12,
                              color: colors.text.secondary,
                            }}
                          >
                            {it.d}
                          </div>
                        )}
                        <IconChevronRight size={14} color={colors.text.faint} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ height: 88 }} />
      </div>
    </Box>
  );
}
