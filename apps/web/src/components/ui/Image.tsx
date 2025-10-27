import { Box, BoxProps, Skeleton } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';

export interface ImageProps extends Omit<BoxProps, 'component'> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fallback?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
  withPlaceholder?: boolean;
}

export function Image({
  src,
  alt,
  width = '100%',
  height = 'auto',
  radius = 'md',
  fit = 'cover',
  fallback,
  loading = 'lazy',
  onLoad,
  onError,
  withPlaceholder = true,
  style,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const currentSrc = hasError && fallback ? fallback : src;

  // Check if image is already loaded (cached) whenever src changes
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Reset loading state when src changes
    setIsLoading(true);
    setHasError(false);
    console.log('Checking if image is cached for src:', img.complete);
    // If image is already complete (cached), hide loading immediately
    if (img.complete && img.naturalHeight !== 0) {
      console.log('Image already loaded (cached)');
      setIsLoading(false);
    }
  }, [currentSrc]);

  return (
    <Box
      pos="relative"
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    >
      {withPlaceholder && isLoading && (
        <Skeleton
          width={width}
          height={height}
          radius={radius}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      <Box
        component="img"
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        // loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          borderRadius:
            typeof radius === 'number'
              ? radius
              : radius === 'xs'
                ? 4
                : radius === 'sm'
                  ? 8
                  : radius === 'md'
                    ? 12
                    : radius === 'lg'
                      ? 16
                      : radius === 'xl'
                        ? 24
                        : 0,
          display: isLoading ? 'none' : 'block',
        }}
      />
    </Box>
  );
}
