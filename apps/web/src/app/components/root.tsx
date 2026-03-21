'use client';

import { Container, Stack, Box, Skeleton, SimpleGrid } from '@mantine/core';
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
      discount: 30, // Mock discount
      quantity: `${apiProduct.quantity}${apiProduct.unit}`,
      deliveryTime: '7 MINS', // Mock delivery time
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
    <Container size="xl" p={0}>
      <Stack gap={0}>
        {categoriesLoading ? (
          <Box style={{ backgroundColor: colors.background, padding: spacing.md }}>
            <Text size="md" fw={typography.fontWeight.semibold} variant="primary"
              style={{ marginBottom: spacing.sm, fontSize: '16px' }}>
              Grocery & Kitchen
            </Text>
            <SimpleGrid cols={{ base: 4, xs: 4, sm: 6, md: 8, lg: 10 }} spacing={spacing.xs}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={80} radius="sm" />
              ))}
            </SimpleGrid>
          </Box>
        ) : categories.length === 0 ? (
          <Box style={{ backgroundColor: colors.background, padding: spacing.md }}>
            <Text size="md" fw={typography.fontWeight.semibold} variant="primary"
              style={{ marginBottom: spacing.sm, fontSize: '16px' }}>
              Grocery & Kitchen
            </Text>
            <Text variant="secondary" size="sm">No categories available yet.</Text>
          </Box>
        ) : (
          <CategoryGrid
            title="Grocery & Kitchen"
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        )}
        <ProductGrid
          title="Fresh Veggies"
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
