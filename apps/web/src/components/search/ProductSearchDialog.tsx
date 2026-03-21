'use client';

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Group,
  ActionIcon,
  TextInput,
  SimpleGrid,
  Skeleton,
  Card,
  ScrollArea,
  Center,
} from '@mantine/core';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { colors, spacing, radius, typography } from '../../theme';
import { Text, Image } from '../ui';
import { ProductDetailDrawer } from '../products';
import { useProducts } from '../../hooks/use-api';
import { toApiAssetUrl } from '../../config/api';
import { ProductDto } from '@shreehari/types';

export interface ProductSearchDialogProps {
  opened: boolean;
  onClose: () => void;
}

export function ProductSearchDialog({ opened, onClose }: ProductSearchDialogProps) {
  const [searchValue, setSearchValue] = useState('');
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const isSearchReady = searchValue.trim().length >= 2;

  const { data: productsResponse, isLoading } = useProducts(
    {
      search: searchValue,
      isAvailable: true,
      limit: 50,
    },
    {
      enabled: isSearchReady,
    }
  );

  const products = (productsResponse?.data || []).map((apiProduct: ProductDto) => ({
    id: apiProduct.id,
    name: apiProduct.name,
    image: toApiAssetUrl(apiProduct.imageUrl),
    price: parseFloat(apiProduct.price.toString()),
    baseQuantity: apiProduct.quantity,
    unit: apiProduct.unit,
    discount: undefined as number | undefined,
    quantity: `${apiProduct.quantity}${apiProduct.unit}`,
    deliveryTime: '20 MINS',
  }));

  const handleProductClick = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setDrawerOpened(true);
  };

  const handleClose = () => {
    setSearchValue('');
    onClose();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        fullScreen
        withCloseButton={false}
        padding={0}
        styles={{
          body: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        transitionProps={{ transition: 'slide-up', duration: 200 }}
        zIndex={200}
      >
        {/* Header */}
        <Box
          style={{
            backgroundColor: colors.surface,
            padding: `${spacing.sm} ${spacing.md}`,
            borderBottom: `1px solid ${colors.border}`,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Group gap={spacing.sm} align="center" wrap="nowrap">
            <ActionIcon
              variant="transparent"
              color="dark"
              onClick={handleClose}
              aria-label="Go back"
              style={{ color: colors.text.primary, flexShrink: 0 }}
            >
              <IconArrowLeft size={24} />
            </ActionIcon>
            <TextInput
              style={{ flex: 1 }}
              leftSection={<IconSearch size={18} color={colors.text.secondary} />}
              placeholder="Search products..."
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.md,
                  color: colors.text.primary,
                  fontSize: typography.fontSize.base,
                  '&:focus': {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
          </Group>
        </Box>

        {/* Body */}
        <ScrollArea style={{ flex: 1 }}>
          <Box p={spacing.md}>
            {/* Initial hint */}
            {!isSearchReady && (
              <Center style={{ paddingTop: spacing.md }}>
                <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
                  Type at least 2 characters to search
                </Text>
              </Center>
            )}

            {/* Loading skeletons */}
            {isSearchReady && isLoading && (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing={spacing.sm}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} height={200} radius="md" />
                ))}
              </SimpleGrid>
            )}

            {/* No results */}
            {isSearchReady && !isLoading && products.length === 0 && (
              <Center style={{ paddingTop: spacing.md }}>
                <Text variant="secondary" size="sm" style={{ textAlign: 'center' }}>
                  No products found for &apos;{searchValue}&apos;
                </Text>
              </Center>
            )}

            {/* Results grid */}
            {isSearchReady && !isLoading && products.length > 0 && (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing={spacing.sm}>
                {products.map((product) => (
                  <Card
                    key={product.id}
                    padding={spacing.sm}
                    radius="md"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <Card.Section>
                      <Box style={{ aspectRatio: '1', overflow: 'hidden' }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width="100%"
                          height="100%"
                          fit="contain"
                          radius={0}
                          withPlaceholder
                        />
                      </Box>
                    </Card.Section>

                    <Box mt={spacing.xs}>
                      <Text
                        size="sm"
                        fw={typography.fontWeight.semibold}
                        variant="primary"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.3,
                          minHeight: '2.6em',
                          fontSize: '13px',
                        }}
                      >
                        {product.name}
                      </Text>

                      <Text
                        size="xs"
                        variant="secondary"
                        style={{ marginTop: '2px', fontSize: '11px' }}
                      >
                        {product.quantity}
                      </Text>

                      <Text
                        size="sm"
                        fw={typography.fontWeight.bold}
                        style={{ color: colors.text.primary, marginTop: spacing.xs }}
                      >
                        ₹{product.price}
                      </Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </ScrollArea>
      </Modal>

      <ProductDetailDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        product={selectedProduct}
      />
    </>
  );
}
