'use client';

import { Box, Stack, Skeleton } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { CategoryGrid } from '../../components/home';
import {
  ProductGrid,
  VariantSheet,
  VariantSheetProduct,
} from '../../components/products';
import { colors, spacing } from '../../theme';
import { useState } from 'react';
import { useProducts, useCategories } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { toApiAssetUrl } from '../../config/api';
import { Text } from '../../components/ui';
import {
  IconTruck,
  IconChevronRight,
} from '@tabler/icons-react';

export const HomeRoot = () => {
  const [variantSheetProduct, setVariantSheetProduct] =
    useState<VariantSheetProduct | null>(null);

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories();

  const categories = (categoriesResponse?.data ?? []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    image: toApiAssetUrl(cat.imageUrl),
  }));

  const { data: productsResponse } = useProducts({
    page: 1,
    limit: 100,
    isAvailable: true,
  });

  const products = (productsResponse?.data || []).map(
    (apiProduct: ProductDto) => ({
      id: apiProduct.id,
      name: apiProduct.name,
      image: toApiAssetUrl(apiProduct.imageUrl),
      price: parseFloat(apiProduct.price.toString()),
      baseQuantity: apiProduct.quantity,
      unit: apiProduct.unit,
      discount: apiProduct.discount ?? undefined,
      quantity: `${apiProduct.quantity}${apiProduct.unit}`,
      deliveryTime: 'Next-day',
      categoryId: apiProduct.categoryId ?? null,
      categoryName: apiProduct.categoryName ?? null,
    })
  );

  const productsByCategory = categories
    .map((cat) => ({
      ...cat,
      items: products.filter((p) => p.categoryId === cat.id),
    }))
    .filter((cat) => cat.items.length > 0);

  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
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

  const handleProductClick = handleAddToCart;

  return (
    <Box pb={spacing.xl}>
      <Stack gap={0}>
        {/* Hero Banner */}
        <Box
          style={{
            margin: '14px 20px 0',
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            height: 160,
          }}
        >
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: colors.primary,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              right: -30,
              top: -30,
              width: 220,
              height: 220,
              borderRadius: '50%',
              overflow: 'hidden',
              opacity: 0.15,
              background: 'rgba(255,255,255,0.5)',
            }}
          />
          <Box
            style={{
              position: 'relative',
              padding: 22,
              color: colors.text.inverse,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  opacity: 0.8,
                  textTransform: 'uppercase' as const,
                }}
              >
                This week's harvest
              </div>
              <div
                style={{
                  fontFamily:
                    "var(--font-heading), 'Instrument Serif', Georgia, serif",
                  fontSize: 28,
                  lineHeight: 1.05,
                  marginTop: 8,
                  maxWidth: 230,
                }}
              >
                Autumn{' '}
                <span style={{ fontStyle: 'italic' }}>roots</span>
                <br />& brassicas
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}
              >
                Up to 30% off
              </div>
              <IconChevronRight size={16} color={colors.text.inverse} />
            </div>
          </Box>
        </Box>

        {/* Categories Rail */}
        <Box mt={28}>
          {categoriesLoading ? (
            <Box px={20}>
              <div
                style={{
                  fontFamily:
                    "var(--font-heading), 'Instrument Serif', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  letterSpacing: -0.3,
                  color: colors.text.primary,
                  lineHeight: 1.15,
                  marginBottom: 14,
                }}
              >
                Shop by category
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    width={96}
                    height={96}
                    radius={22}
                    style={{ flexShrink: 0 }}
                  />
                ))}
              </div>
            </Box>
          ) : categories.length === 0 ? (
            <Box px={20}>
              <Text
                size="md"
                style={{ color: colors.text.secondary }}
              >
                No categories available yet.
              </Text>
            </Box>
          ) : (
            <CategoryGrid
              title="Shop by category"
              subtitle="Fresh · seasonal · local"
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </Box>

        {/* Products grouped by category */}
        {productsByCategory.map((cat) => (
          <Box key={cat.id} mt={32}>
            <ProductGrid
              title={cat.name}
              action="See all"
              onActionClick={() => router.push(`/category/${cat.id}`)}
              products={cat.items}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
            />
          </Box>
        ))}

        {/* Delivery Promise Strip */}
        <Box
          style={{
            margin: '32px 20px 0',
            padding: '20px 22px',
            borderRadius: 24,
            background: colors.surfaceAlt,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Box
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconTruck size={22} color={colors.text.inverse} />
          </Box>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Next-day farm-fresh
            </div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              Order by 9pm. We harvest at dawn. Arrives 8am–noon.
            </div>
          </div>
        </Box>
      </Stack>

      <VariantSheet
        product={variantSheetProduct}
        onClose={() => setVariantSheetProduct(null)}
        bottomOffset="88px"
      />
    </Box>
  );
};
