# Product Image Upload Implementation

## Overview

This document describes the implementation of product image upload functionality for the Shreehari Mart application.

## Changes Made

### 1. Backend (API)

#### Dependencies Added

- `multer` - Middleware for handling multipart/form-data (file uploads)
- `@types/multer` - TypeScript types for multer

#### New Files Created

- **`apps/api/src/app/middleware/upload.middleware.ts`**
  - Configures multer storage to save files to `uploads/products/`
  - Implements file filtering (only images: JPEG, PNG, WebP, GIF)
  - Sets file size limit to 5MB
  - Generates unique filenames to prevent conflicts

#### Modified Files

- **`apps/api/src/app/routes/products.routes.ts`**
  - Added `upload.single('image')` middleware to POST and PUT routes
  - Handles multipart/form-data for image uploads
  - Converts form field strings to appropriate types (number, boolean)
  - Sets `imageUrl` field when image is uploaded

- **`apps/api/src/app/server.ts`**
  - Added static file serving for `/uploads` directory
  - Allows uploaded images to be accessed via HTTP

### 2. Data Access Layer

#### Modified Files

- **`libs/data-access/src/index.ts`**
  - Updated `useCreateProduct` hook to accept optional `imageFile` parameter
  - Updated `useUpdateProduct` hook to accept optional `imageFile` parameter
  - Sends FormData instead of JSON when image file is present
  - Falls back to JSON when no image is provided

### 3. Frontend (Admin)

#### Modified Files

- **`apps/admin/src/pages/ProductFormPage.tsx`**
  - Passes `formData.imageFile` to `createProduct()` and `updateProduct()` calls
  - No changes needed to form UI (FileInput already existed)

### 4. Configuration

#### Modified Files

- **`.gitignore`**
  - Added `uploads/` directory to exclude uploaded files from git

## Database Schema

The `products` table already had the `imageUrl` column:

```sql
imageUrl VARCHAR(500) NULL
```

## API Endpoints

### Create Product

```
POST /api/products
Content-Type: multipart/form-data

Fields:
- name: string
- price: number
- quantity: number
- unit: 'gm' | 'kg' | 'pc'
- description: string (optional)
- image: File (optional)
```

### Update Product

```
PUT /api/products/:id
Content-Type: multipart/form-data

Fields:
- name: string (optional)
- price: number (optional)
- quantity: number (optional)
- unit: 'gm' | 'kg' | 'pc' (optional)
- description: string (optional)
- isAvailable: boolean (optional)
- image: File (optional)
```

## File Storage

- **Location**: `uploads/products/`
- **Naming**: `{originalname}-{timestamp}-{random}.{ext}`
- **Access URL**: `http://localhost:3000/uploads/products/{filename}`
- **Max Size**: 5MB
- **Allowed Types**: JPEG, JPG, PNG, WebP, GIF

## Usage Example

### Frontend (React)

```typescript
const imageFile = formData.imageFile; // File object from FileInput
const productData = {
  name: 'Product Name',
  price: 99.99,
  quantity: 10,
  unit: 'kg',
  description: 'Product description',
};

// Create with image
await createProduct(productData, imageFile);

// Update with image
await updateProduct(productId, productData, imageFile);

// Create/update without image
await createProduct(productData, null);
```

### Backend Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "price": 99.99,
    "quantity": 10,
    "unit": "kg",
    "description": "Product description",
    "imageUrl": "/uploads/products/image-1234567890-123456789.jpg",
    "isAvailable": true,
    "createdAt": "2025-10-27T...",
    "updatedAt": "2025-10-27T..."
  }
}
```

## Important Notes

1. **File System Storage**: Currently using local file system. For production, consider:
   - Cloud storage (AWS S3, Google Cloud Storage, Azure Blob Storage)
   - CDN for better performance
   - Image optimization/resizing

2. **Security Considerations**:
   - File type validation is in place
   - File size limit is enforced
   - Unique filenames prevent overwrites
   - Consider adding virus scanning for production

3. **Cleanup**: Old images are not automatically deleted when:
   - Product is deleted
   - Product image is updated
   - Consider implementing cleanup logic

4. **CORS**: Make sure CORS is properly configured to allow image access from frontend

## Future Enhancements

- [ ] Image compression and optimization
- [ ] Multiple images per product
- [ ] Image cropping/editing interface
- [ ] Cloud storage integration
- [ ] Automatic cleanup of unused images
- [ ] Image caching strategy
- [ ] Thumbnail generation
