'use client';

import { Container, Stack } from '@mantine/core';
import { CategoryGrid } from '../../components/home';
import { ProductGrid, ProductDetailDrawer } from '../../components/products';
import { spacing } from '../../theme';
import { useState } from 'react';
import { useProducts } from '../../hooks/use-api';
import { ProductDto } from '@shreehari/types';
import { useCartStore } from '../../store';

// Sample category data (will be replaced with actual data later)
const categories = [
  {
    id: 'fresh-vegetables',
    name: 'Fresh Vegetables',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/323b2564-9fa9-43dd-9755-b5df299797d7_a7f60fc5-47fa-429d-9fd1-5f0644c0d4e3',
  },
  {
    id: 'fresh-fruits',
    name: 'Fresh Fruits',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/7155c5af-2f9d-41a3-92d6-2a0d7ecacd4f_361de9d0-8257-4479-8511-76f4f1cd2009',
  },
  {
    id: 'dairy-bread-eggs',
    name: 'Dairy, Bread and Eggs',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/8dd93fdd-86da-4f10-8a54-00d3a492943b_ab94b702-a269-48ca-8745-374c4abc5bfd',
  },
  {
    id: 'cereals-breakfast',
    name: 'Cereals and Breakfast',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/ced37aab-86bf-4092-aed3-75886c3d4a85_7ed42876-2cad-4d5d-97ad-0f1ce41527dd',
  },
  {
    id: 'atta-rice-dal',
    name: 'Atta, Rice and Dal',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/2afc6eba-1e60-423e-b7e7-135ae4541678_c2e7269b-0f77-4d0e-a9f3-e4f814f7e019',
  },
  {
    id: 'oils-ghee',
    name: 'Oils and Ghee',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/0a5352d0-bd01-4d79-914c-366d638e518c_62bca63e-5d11-45c0-a0a9-629400edfdb6',
  },
  {
    id: 'masalas',
    name: 'Masalas',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/4695912b-bf51-4eed-8f75-0e403cec103e_d69a8e15-1b69-4460-acca-ec043fabe830',
  },
  {
    id: 'dry-fruits-seeds',
    name: 'Dry Fruits and Seeds Mix',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/8b346cb3-a57b-4fdb-ae2c-d8125fcaf921_34c8c8f9-080d-48c9-b25a-ffb8e7057d00',
  },
];

export const HomeRoot = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

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
        ? // ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${apiProduct.imageUrl}`
          `${'http://localhost:3000'}${apiProduct.imageUrl}`
        : 'https://via.placeholder.com/252x272?text=No+Image',
      price: parseFloat(apiProduct.price.toString()),
      baseQuantity: apiProduct.quantity,
      unit: apiProduct.unit,
      discount: 30, // Mock discount
      quantity: `${apiProduct.quantity}${apiProduct.unit}`,
      deliveryTime: '7 MINS', // Mock delivery time
    })
  );

  const handleCategoryClick = (categoryId: string) => {
    // Will be implemented later with navigation
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
        <CategoryGrid
          title="Grocery & Kitchen"
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
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
