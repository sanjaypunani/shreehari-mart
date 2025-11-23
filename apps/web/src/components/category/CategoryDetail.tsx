'use client';

import React, { useState } from 'react';
import { Box, Group, ActionIcon, Container, ScrollArea, Chip } from '@mantine/core';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors, spacing, typography, shadow } from '../../theme';
import { Text } from '../ui';
import { ProductGrid, ProductDetailDrawer } from '../products';
import { CategorySidebar } from './CategorySidebar';
import { useProducts } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore } from '../../store';

// Mock data for categories (still mock for now as requested only product data to be real)
const MOCK_CATEGORIES = [
  {
    id: '1',
    name: 'Fresh Vegetables',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/323b2564-9fa9-43dd-9755-b5df299797d7_a7f60fc5-47fa-429d-9fd1-5f0644c0d4e3',
  },
  {
    id: '2',
    name: 'Fresh Fruits',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/7155c5af-2f9d-41a3-92d6-2a0d7ecacd4f_361de9d0-8257-4479-8511-76f4f1cd2009',
  },
  {
    id: '3',
    name: 'Dairy, Bread & Eggs',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/8dd93fdd-86da-4f10-8a54-00d3a492943b_ab94b702-a269-48ca-8745-374c4abc5bfd',
  },
  {
    id: '4',
    name: 'Cereals & Breakfast',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/ced37aab-86bf-4092-aed3-75886c3d4a85_7ed42876-2cad-4d5d-97ad-0f1ce41527dd',
  },
  {
    id: '5',
    name: 'Atta, Rice & Dal',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/2afc6eba-1e60-423e-b7e7-135ae4541678_c2e7269b-0f77-4d0e-a9f3-e4f814f7e019',
  },
  {
    id: '6',
    name: 'Oils & Ghee',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/0a5352d0-bd01-4d79-914c-366d638e518c_62bca63e-5d11-45c0-a0a9-629400edfdb6',
  },
  {
    id: '7',
    name: 'Masalas',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/4695912b-bf51-4eed-8f75-0e403cec103e_d69a8e15-1b69-4460-acca-ec043fabe830',
  },
];

export interface CategoryDetailProps {
  categoryId: string;
}

export function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '1');
  
  // Get cart store actions
  const addItem = useCartStore((state) => state.addItem);

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
      image: apiProduct.imageUrl
        ? `${'http://localhost:3000'}${apiProduct.imageUrl}`
        : 'https://via.placeholder.com/252x272?text=No+Image',
      price: parseFloat(apiProduct.price.toString()),
      baseQuantity: apiProduct.quantity,
      unit: apiProduct.unit,
      discount: 30, // Mock discount
      quantity: `${apiProduct.quantity}${apiProduct.unit}`,
      deliveryTime: '20 MINS', // Mock delivery time
    })
  );

  const categoryName = MOCK_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Category';

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

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const handleProductClick = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setDrawerOpened(true);
  };

  return (
    <Box style={{ backgroundColor: colors.background, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        style={{
          backgroundColor: colors.surface,
          padding: `${spacing.sm} ${spacing.md}`,
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 100,
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap={spacing.sm}>
            <ActionIcon
              variant="transparent"
              color="dark"
              onClick={() => router.push('/')}
              style={{ color: colors.text.primary }}
            >
              <IconArrowLeft size={24} />
            </ActionIcon>
            <Text size="lg" fw={typography.fontWeight.bold} variant="primary">
              {categoryName}
            </Text>
          </Group>
          
          <ActionIcon variant="transparent" color="dark">
            <IconSearch size={24} />
          </ActionIcon>
        </Group>
      </Box>

      {/* Main Content Area */}
      <Box style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <CategorySidebar 
            categories={MOCK_CATEGORIES} 
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
        />

        {/* Product Area */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
            {/* Product Grid */}
            <ScrollArea style={{ flex: 1 }} p={spacing.sm}>
                <ProductGrid
                    title="" // No title needed inside the grid as header has it
                    products={products}
                    columns={{ base: 2, xs: 2, sm: 2, md: 3, lg: 4 }} // 2 columns on mobile/base
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                />
                <Box h={80} /> {/* Spacer for bottom cart bar */}
            </ScrollArea>
        </Box>
      </Box>

      <ProductDetailDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        product={selectedProduct}
      />
    </Box>
  );
}
