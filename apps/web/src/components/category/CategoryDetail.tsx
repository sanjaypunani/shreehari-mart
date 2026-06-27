'use client';

import React, { useState } from 'react';
import { Box, ScrollArea, Skeleton, SimpleGrid } from '@mantine/core';
import { IconSearch, IconChevronLeft } from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';
import { colors } from '../../theme';
import {
  ProductCard,
  VariantSheet,
  VariantSheetProduct,
} from '../products';
import { CategorySidebar } from './CategorySidebar';
import { useProducts, useCategory, useCategories } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore, useAppStore } from '../../store';
import { toApiAssetUrl } from '../../config/api';

const ALL_CATEGORY_ID = 'all';

export function CategoryDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params?.id ?? ALL_CATEGORY_ID;
  const isAll = categoryId === ALL_CATEGORY_ID;
  const cartItems = useCartStore((state) => state.items);
  const hasCartItems = cartItems.length > 0;
  const [variantSheetProduct, setVariantSheetProduct] =
    useState<VariantSheetProduct | null>(null);

  const { data: categoryResponse, isLoading: categoryLoading } =
    useCategory(isAll ? '' : categoryId);
  const { data: allCategoriesResponse } = useCategories();

  const categoryName = isAll
    ? 'All products'
    : categoryResponse?.data?.name ?? 'Category';

  const { data: productsResponse, isLoading } = useProducts({
    page: 1,
    limit: 200,
    isAvailable: true,
    categoryId: isAll ? undefined : categoryId,
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
    })
  );

  const sidebarCategories = [
    { id: ALL_CATEGORY_ID, name: 'All', image: '' },
    ...(allCategoriesResponse?.data ?? []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      image: toApiAssetUrl(cat.imageUrl),
    })),
  ];

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

  const handleSidebarCategorySelect = (newCategoryId: string) => {
    router.replace(`/category/${newCategoryId}`);
  };

  const handleProductClick = handleAddToCart;

  const lastScrollTop = React.useRef(0);
  const setChromeVisible = useAppStore((state) => state.setChromeVisible);

  const handleScrollChange = ({ y }: { y: number }) => {
    const currentScrollTop = y;
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
        backgroundColor: colors.background,
        height: 'var(--app-viewport-height)',
        display: 'flex',
        flexDirection: 'column',
        color: colors.text.primary,
      }}
    >
      {/* Top bar - Cropzo style */}
      <Box
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
        {!isAll && (
          <button
            onClick={() => router.push('/')}
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
        )}
        <div
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: -0.2,
          }}
        >
          {categoryLoading ? (
            <Skeleton height={20} width={120} radius="sm" />
          ) : (
            categoryName
          )}
        </div>
        <button
          onClick={() => router.push('/search')}
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
          <IconSearch size={17} color={colors.text.primary} />
        </button>
      </Box>

      {/* Two-column layout */}
      <Box style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: category rail */}
        <CategorySidebar
          categories={sidebarCategories}
          selectedCategoryId={categoryId}
          onSelectCategory={handleSidebarCategorySelect}
        />

        {/* Right: products */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Product grid */}
          <ScrollArea
            style={{ flex: 1 }}
            onScrollPositionChange={handleScrollChange}
          >
            <Box style={{ padding: '6px 10px 30px' }}>
              {isLoading ? (
                <SimpleGrid
                  cols={{ base: 2, sm: 2, md: 3, lg: 4 }}
                  spacing={8}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={200} radius={10} />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  cols={{ base: 2, sm: 2, md: 3, lg: 4 }}
                  spacing={12}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      price={product.price}
                      discount={product.discount}
                      quantity={product.quantity}
                      deliveryTime={product.deliveryTime}
                      onClick={handleProductClick}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </SimpleGrid>
              )}
              <Box h="calc(88px + var(--safe-area-bottom) + 16px)" />
            </Box>
          </ScrollArea>
        </Box>
      </Box>

      <VariantSheet
        product={variantSheetProduct}
        onClose={() => setVariantSheetProduct(null)}
        bottomOffset="88px"
      />
    </Box>
  );
}
