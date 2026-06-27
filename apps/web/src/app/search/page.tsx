'use client';

import React from 'react';
import { Box, Skeleton } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { colors } from '../../theme';
import { Image } from '../../components/ui';
import {
  VariantSheet,
  VariantSheetProduct,
} from '../../components/products';
import { useProducts, useOrders } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore, useUser, useAppStore } from '../../store';
import { toApiAssetUrl } from '../../config/api';

interface SearchResultProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  baseQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
  quantity: string;
  discount?: number;
}

function mapProduct(apiProduct: ProductDto): SearchResultProduct {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    image: toApiAssetUrl(apiProduct.imageUrl),
    price: parseFloat(apiProduct.price.toString()),
    baseQuantity: apiProduct.quantity,
    unit: apiProduct.unit as 'gm' | 'kg' | 'pc',
    quantity: `${apiProduct.quantity}${apiProduct.unit}`,
    discount: apiProduct.discount ?? undefined,
  };
}

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [variantSheetProduct, setVariantSheetProduct] =
    React.useState<VariantSheetProduct | null>(null);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const cartItems = useCartStore((state) => state.items);
  const user = useUser();

  // Debounce query so we don't fire a request on every keystroke
  React.useEffect(() => {
    const trimmed = query.trim();
    const id = window.setTimeout(() => setDebouncedQuery(trimmed), 200);
    return () => window.clearTimeout(id);
  }, [query]);

  const isSearching = debouncedQuery.length >= 2;

  // Live search results
  const { data: searchResponse, isLoading: searchLoading } = useProducts(
    {
      search: debouncedQuery,
      isAvailable: true,
      limit: 30,
    },
    { enabled: isSearching }
  );

  // Default "in season" suggestions when there's no query
  const { data: seasonalResponse, isLoading: seasonalLoading } = useProducts(
    {
      page: 1,
      limit: 6,
      isAvailable: true,
    },
    { enabled: !isSearching }
  );

  // Fetch past orders to list previously ordered items
  const { data: ordersResponse } = useOrders(
    { customerId: user?.customerId || '', limit: 30 },
    { enabled: !!user?.customerId && !isSearching }
  );

  // Extract unique productIds from past orders
  const pastProductIds = React.useMemo(() => {
    if (!ordersResponse) return new Set<string>();
    const rawOrders = ordersResponse as any;
    const resolvedOrders = Array.isArray(rawOrders?.data?.data)
      ? rawOrders.data.data
      : Array.isArray(rawOrders?.data)
        ? rawOrders.data
        : [];
    
    const ids = new Set<string>();
    resolvedOrders.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (item.productId) {
            ids.add(item.productId);
          }
        });
      }
    });
    return ids;
  }, [ordersResponse]);

  // Fetch all products to resolve full details of previously ordered items
  const { data: allProductsResponse } = useProducts(
    { limit: 150, isAvailable: true },
    { enabled: !isSearching && pastProductIds.size > 0 }
  );

  const pastOrderedProducts = React.useMemo(() => {
    if (!allProductsResponse || pastProductIds.size === 0) return [];
    const products: SearchResultProduct[] = (allProductsResponse?.data || []).map(mapProduct);
    const cartItemIds = new Set(cartItems.map((item) => item.id));
    return products.filter((p) => pastProductIds.has(p.id) && !cartItemIds.has(p.id));
  }, [allProductsResponse, pastProductIds, cartItems]);

  const results: SearchResultProduct[] = (searchResponse?.data || []).map(
    mapProduct
  );
  const inSeason: SearchResultProduct[] = (seasonalResponse?.data || []).map(
    mapProduct
  );

  const handleAddToCart = (product: SearchResultProduct) => {
    setVariantSheetProduct({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      baseQuantity: product.baseQuantity,
      unit: product.unit,
      discount: product.discount,
      quantity: product.quantity,
    });
  };

  const handleOpenProduct = (product: SearchResultProduct) => {
    handleAddToCart(product);
  };

  const lastScrollTop = React.useRef(0);
  const setChromeVisible = useAppStore((state) => state.setChromeVisible);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    const atTop = currentScrollTop <= 60;

    if (atTop) {
      setChromeVisible(true);
    } else {
      const diff = currentScrollTop - lastScrollTop.current;
      if (Math.abs(diff) >= 10) {
        setChromeVisible(diff <= 0);
      }
    }
    lastScrollTop.current = currentScrollTop;
  };

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        color: colors.text.primary,
      }}
    >
      {/* Search header */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 22,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IconSearch size={17} color={colors.text.secondary} />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search produce, farms…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              fontFamily: 'inherit',
              color: colors.text.primary,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconX size={16} color={colors.text.secondary} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        onScroll={handleScroll}
        style={{ flex: 1, overflow: 'auto', padding: '16px 20px 30px' }}
      >
        {!isSearching ? (
          <>
            {pastOrderedProducts.length > 0 && (
              <Box mb={28}>
                <SectionLabel>Ordered in the past</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pastOrderedProducts.map((p) => {
                    const inCartQty = cartItems
                      .filter((i) => i.id === p.id)
                      .reduce((sum, i) => sum + i.quantity, 0);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleOpenProduct(p)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 14,
                          background: colors.surface,
                          border: `1px solid ${colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          cursor: 'pointer',
                        }}
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={48}
                          height={48}
                          radius={10}
                          fit="cover"
                          withPlaceholder
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p.name}
                          </div>
                          <div style={{ fontSize: 11, color: colors.text.secondary, marginTop: 1 }}>
                            ₹{Math.round(p.price)} · {p.quantity}
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          {inCartQty > 0 ? (
                            <div
                              style={{
                                padding: '5px 10px',
                                borderRadius: 12,
                                background: colors.primary,
                                color: colors.text.inverse,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {inCartQty} in cart
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(p)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: 12,
                                background: 'transparent',
                                color: colors.primary,
                                border: `1.5px solid ${colors.primary}`,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              ADD
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Box>
            )}

            <div style={{ marginTop: pastOrderedProducts.length > 0 ? 28 : 0 }}>
              <SectionLabel>In season</SectionLabel>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 10,
              }}
            >
              {seasonalLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={64} radius={14} />
                  ))
                : inSeason.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenProduct(p)}
                      style={{
                        padding: 10,
                        borderRadius: 14,
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                      }}
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={44}
                        height={44}
                        radius={10}
                        fit="cover"
                        withPlaceholder
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: colors.text.secondary,
                          }}
                        >
                          From ₹{Math.round(p.price)} · {p.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </>
        ) : (
          <>
            <SectionLabel>
              {searchLoading
                ? 'Searching…'
                : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
            </SectionLabel>
            {searchLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height={84} radius={16} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: colors.text.secondary,
                  fontSize: 13,
                }}
              >
                No matches for &ldquo;{debouncedQuery}&rdquo;
              </div>
            ) : (
              results.map((p) => {
                const inCartQty = cartItems
                  .filter((i) => i.id === p.id)
                  .reduce((sum, i) => sum + i.quantity, 0);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleOpenProduct(p)}
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={60}
                      height={60}
                      radius={12}
                      fit="cover"
                      withPlaceholder
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: colors.text.secondary,
                          marginTop: 1,
                        }}
                      >
                        From {p.quantity} · ₹{Math.round(p.price)}
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      {inCartQty > 0 ? (
                        <div
                          style={{
                            padding: '6px 12px',
                            borderRadius: 14,
                            background: colors.primary,
                            color: colors.text.inverse,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {inCartQty} in cart
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(p)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 14,
                            background: 'transparent',
                            color: colors.primary,
                            border: `1.5px solid ${colors.primary}`,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            letterSpacing: 0.3,
                          }}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
        <Box h="calc(88px + var(--safe-area-bottom) + 16px)" />
      </div>

      <VariantSheet
        product={variantSheetProduct}
        onClose={() => setVariantSheetProduct(null)}
        bottomOffset="88px"
      />
    </Box>
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
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}
