'use client';

import { Container, Stack, Box, Skeleton, SimpleGrid, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { CategoryGrid } from '../../components/home';
import { ProductGrid, ProductDetailDrawer } from '../../components/products';
import { colors, spacing, typography } from '../../theme';
import { useState } from 'react';
import { useProducts, useCategories } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore } from '../../store';
import { toApiAssetUrl } from '../../config/api';
import { Text } from '../../components/ui';

export const HomeRoot = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  // Get cart store actions
  const addItem = useCartStore((state) => state.addItem);

  // Fetch categories from API
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

  const categories = (categoriesResponse?.data ?? []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    image: toApiAssetUrl(cat.imageUrl),
  }));

  // Fetch products from API
  const { data: productsResponse, isLoading } = useProducts({
    page: 1,
    limit: 100,
    isAvailable: true,
  });

  // Map API response to component format
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
      deliveryTime: '30 mins',
    })
  );

  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const handleProductClick = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setDrawerOpened(true);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Add to cart using cart store with base product data
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        unit: product.unit,
        productQuantity: product.quantity,
        orderedQuantity: product.baseQuantity,
        baseQuantity: product.baseQuantity,
        basePrice: product.price,
        baseUnit: product.unit,
        isAvailable: true,
      });
    }
  };

  return (
    <Container size="xl" px={spacing.xs} py={spacing.sm}>
      <Stack gap={spacing.sm}>
        <Box
          style={{
            borderRadius: 20,
            padding: spacing.md,
            background:
              'linear-gradient(145deg, rgba(31,122,99,0.92) 0%, rgba(28,100,82,0.98) 62%, rgba(20,81,67,1) 100%)',
            color: colors.text.inverse,
            boxShadow: '0 14px 28px rgba(31, 122, 99, 0.35)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              right: -40,
              top: -50,
              width: 170,
              height: 170,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
            }}
          />
          <Stack gap={6} style={{ position: 'relative', zIndex: 1 }}>
            <Text
              size="xs"
              style={{
                opacity: 0.92,
                fontWeight: typography.fontWeight.semibold,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              Everyday Essentials
            </Text>
            <Text
              style={{
                fontSize: '26px',
                lineHeight: 1.1,
                fontWeight: typography.fontWeight.bold,
                letterSpacing: '-0.03em',
                maxWidth: 260,
              }}
            >
              Fresh groceries in 30 minutes
            </Text>
            <Text
              size="sm"
              style={{
                opacity: 0.88,
                maxWidth: 280,
                lineHeight: typography.lineHeight.normal,
              }}
            >
              Handpicked fruits, vegetables and daily essentials at smart prices.
            </Text>
            <Group gap={spacing.xs} mt={spacing.xs}>
              <Box
                style={{
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.35)',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                No minimum order
              </Box>
              <Box
                style={{
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.35)',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Same day delivery
              </Box>
            </Group>
          </Stack>
        </Box>

        {categoriesLoading ? (
          <Box
            style={{
              backgroundColor: 'transparent',
              padding: 0,
            }}
          >
            <Text size="md" fw={typography.fontWeight.semibold} variant="primary"
              style={{ marginBottom: spacing.xs, fontSize: '16px', paddingInline: spacing.xs }}>
              Shop by category
            </Text>
            <SimpleGrid cols={{ base: 4, xs: 4, sm: 5, md: 6, lg: 8 }} spacing={spacing.xs}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={96} radius="md" />
              ))}
            </SimpleGrid>
          </Box>
        ) : categories.length === 0 ? (
          <Box
            style={{
              backgroundColor: 'transparent',
              padding: 0,
            }}
          >
            <Text size="md" fw={typography.fontWeight.semibold} variant="primary"
              style={{ marginBottom: spacing.xs, fontSize: '16px', paddingInline: spacing.xs }}>
              Shop by category
            </Text>
            <Text variant="secondary" size="sm" px={spacing.xs}>No categories available yet.</Text>
          </Box>
        ) : (
          <CategoryGrid
            title="Shop by category"
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        )}
        <ProductGrid
          title="Top picks for you"
          products={products}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
      </Stack>

      <ProductDetailDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        product={selectedProduct}
      />
    </Container>
  );
};
