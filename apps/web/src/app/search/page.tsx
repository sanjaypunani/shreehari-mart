'use client';

import React from 'react';
import { Box, Skeleton } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { colors } from '../../theme';
import { Image } from '../../components/ui';
import {
  ProductDetailDrawer,
  VariantSheet,
  VariantSheetProduct,
} from '../../components/products';
import { useProducts } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore } from '../../store';
import { toApiAssetUrl } from '../../config/api';

const TRENDING = [
  'Tomatoes',
  'Onion',
  'Spinach',
  'Mushrooms',
  'Carrots',
  'Basil',
];

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
  const [drawerOpened, setDrawerOpened] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<SearchResultProduct | null>(null);
  const [variantSheetProduct, setVariantSheetProduct] =
    React.useState<VariantSheetProduct | null>(null);

  const cartItems = useCartStore((state) => state.items);

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
    setSelectedProduct(product);
    setDrawerOpened(true);
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
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 30px' }}>
        {!isSearching ? (
          <>
            <SectionLabel>Trending now</SectionLabel>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: 20,
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    color: colors.text.primary,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
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
      </div>

      <ProductDetailDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        product={selectedProduct ?? undefined}
      />

      <VariantSheet
        product={variantSheetProduct}
        onClose={() => setVariantSheetProduct(null)}
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
