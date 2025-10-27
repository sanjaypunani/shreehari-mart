# Product Image Display Implementation

## Summary

Product images are now properly displayed in the Products table using the `imageUrl` field from the API.

## Changes Made

### 1. Utility Function Added

**File**: `libs/utils/src/index.ts`

Added a reusable `getImageUrl()` function:

```typescript
export const getImageUrl = (
  imageUrl?: string | null,
  baseUrl = 'http://localhost:3000',
  fallbackUrl = 'https://via.placeholder.com/150'
) => {
  if (!imageUrl) return fallbackUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${baseUrl}${imageUrl}`;
};
```

**Features:**

- ✅ Handles null/undefined image URLs with fallback
- ✅ Supports both relative and absolute URLs
- ✅ Configurable base URL and fallback image
- ✅ Reusable across the entire application

### 2. ProductsPage Updated

**File**: `apps/admin/src/pages/ProductsPage.tsx`

**Changes:**

1. Imported `getImageUrl` utility function
2. Updated the table column to use `getImageUrl(record.imageUrl)`

**Before:**

```tsx
<Image
  src={record.imageUrl} // ❌ Incomplete URL
  w={40}
  h={40}
  radius="sm"
  fallbackSrc="https://via.placeholder.com/40"
/>
```

**After:**

```tsx
<Image
  src={getImageUrl(record.imageUrl)} // ✅ Full URL
  w={40}
  h={40}
  radius="sm"
  fallbackSrc="https://via.placeholder.com/40"
/>
```

## How It Works

### Example Image URL Flow

1. **API Returns** (from database):

   ```json
   {
     "imageUrl": "/uploads/products/tomato-1761586619898-875161388.jpg"
   }
   ```

2. **`getImageUrl()` Processes**:

   ```
   Input:  "/uploads/products/tomato-1761586619898-875161388.jpg"
   Output: "http://localhost:3000/uploads/products/tomato-1761586619898-875161388.jpg"
   ```

3. **Image Component Renders**:
   ```html
   <img
     src="http://localhost:3000/uploads/products/tomato-1761586619898-875161388.jpg"
   />
   ```

### Fallback Behavior

If no image URL is provided:

```typescript
getImageUrl(null);
// Returns: "https://via.placeholder.com/150"
```

If product has an image URL:

```typescript
getImageUrl('/uploads/products/tomato-1761586619898-875161388.jpg');
// Returns: "http://localhost:3000/uploads/products/tomato-1761586619898-875161388.jpg"
```

## Usage in Other Components

You can now use `getImageUrl()` anywhere in your app:

```tsx
import { getImageUrl } from '@shreehari/utils';

// Basic usage
<img src={getImageUrl(product.imageUrl)} alt={product.name} />

// With custom fallback
<img
  src={getImageUrl(product.imageUrl, 'http://localhost:3000', '/images/no-product.png')}
  alt={product.name}
/>

// With Mantine Image component
<Image
  src={getImageUrl(product.imageUrl)}
  fallbackSrc="https://via.placeholder.com/150"
/>
```

## Testing

1. **Start the API server**:

   ```bash
   npm run serve api
   ```

2. **Start the admin app**:

   ```bash
   npm run serve admin
   ```

3. **Navigate to Products page**:
   - Go to http://localhost:4200/products
   - Product images should now display correctly
   - Products without images show placeholder

## Production Considerations

For production deployment, you should:

1. **Update Base URL**:
   - Change `baseUrl` parameter in `getImageUrl()` calls
   - Or set up environment variables

2. **Example for production**:

   ```tsx
   const API_BASE_URL =
     process.env.REACT_APP_API_URL || 'http://localhost:3000';

   <Image src={getImageUrl(product.imageUrl, API_BASE_URL)} />;
   ```

3. **Consider CDN**:
   - For better performance, serve images from a CDN
   - Update the utility function to point to CDN URL

## Related Files

- ✅ `libs/utils/src/index.ts` - Utility function
- ✅ `apps/admin/src/pages/ProductsPage.tsx` - Products table
- ✅ `apps/api/src/app/routes/products.routes.ts` - API endpoint
- ✅ `apps/api/src/app/server.ts` - Static file serving

## Result

Product images are now properly displayed in the products table with:

- ✅ Correct full URLs
- ✅ Fallback for missing images
- ✅ Reusable utility function
- ✅ Clean and maintainable code
