'use client';

import React, { useState } from 'react';
import { Box, Group, ActionIcon, ScrollArea, Skeleton, SimpleGrid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors, spacing, typography } from '../../theme';
import { Text } from '../ui';
import { ProductGrid, ProductDetailDrawer } from '../products';
import { CategorySidebar } from './CategorySidebar';
import { ProductSearchDialog } from '../search';
import { StickyPageHeader } from '../navigation/StickyPageHeader';
import { useProducts, useCategory, useCategories } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore } from '../../store';
import { toApiAssetUrl } from '../../config/api';

export interface CategoryDetailProps {
  categoryId: string;
}

export function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categoryId);

  // Get cart store actions
  const addItem = useCartStore((state) => state.addItem);
  const hasCartItems = useCartStore((state) => state.items.length > 0);

  // Fetch current category and all categories from API
  const { data: categoryResponse, isLoading: categoryLoading } = useCategory(selectedCategory);
  const { data: allCategoriesResponse } = useCategories();
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);

  const categoryName = categoryResponse?.data?.name ?? 'Category';

  // Fetch products filtered by category
  const { data: productsResponse, isLoading } = useProducts({
    page: 1,
    limit: 200,
    isAvailable: true,
    categoryId: selectedCategory,
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

  const sidebarCategories = (allCategoriesResponse?.data ?? []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    image: toApiAssetUrl(cat.imageUrl),
  }));

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

  const handleSidebarCategorySelect = (newCategoryId: string) => {
    setSelectedCategory(newCategoryId);
    router.replace(`/category/${newCategoryId}`);
  };

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const handleProductClick = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setDrawerOpened(true);
  };

  return (
    <Box
      style={{
        backgroundColor: colors.background,
        height: 'var(--app-viewport-height)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StickyPageHeader
        title={
          categoryLoading ? (
            <Skeleton height={20} width={120} radius="sm" />
          ) : (
            categoryName
          )
        }
        onBack={() => router.push('/')}
        rightSlot={
          <ActionIcon
            variant="subtle"
            onClick={openSearch}
            aria-label="Search products"
            style={{
              width: 'var(--touch-target-size)',
              height: 'var(--touch-target-size)',
              borderRadius: '9999px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              color: colors.text.primary,
            }}
          >
            <IconSearch size={21} />
          </ActionIcon>
        }
      />

      {/* Main Content Area */}
      <Box style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <CategorySidebar
          categories={sidebarCategories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={handleSidebarCategorySelect}
        />

        {/* Product Area */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
          }}
        >
            {/* Product Grid */}
            <ScrollArea style={{ flex: 1 }} p={spacing.sm}>
                {isLoading ? (
                  <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={spacing.sm} p={spacing.sm}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} height={200} radius="md" />
                    ))}
                  </SimpleGrid>
                ) : (
                  <ProductGrid
                    title=""
                    products={products}
                    columns={{ base: 2, xs: 2, sm: 2, md: 3, lg: 4 }}
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                  />
                )}
                <Box
                  h={
                    hasCartItems
                      ? 'calc(76px + var(--mobile-bottom-tabs-total-height))'
                      : 'var(--mobile-bottom-tabs-total-height)'
                  }
                />
            </ScrollArea>
        </Box>
      </Box>

      <ProductDetailDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        product={selectedProduct}
      />

      <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
    </Box>
  );
}
