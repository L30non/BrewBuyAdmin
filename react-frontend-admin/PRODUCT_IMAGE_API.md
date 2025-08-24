# Brew Buy Platform - Product Image Management API

This document provides detailed information about how to upload and manage product images in the Brew Buy Platform. This API is intended for use by the React admin panel team.

## Base URL

For development:
- Local: `http://localhost:8080`
- If accessing from another device: `http://[YOUR_COMPUTER_IP]:8080`

For production:
- `https://[YOUR_DOMAIN]/api`

## Image Upload Endpoints

### Create Product with Image

**Endpoint**: `POST /api/products`

**Description**: Create a new product with an optional image.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 19.99,
  "quantity": 100,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...", // Base64 encoded image
  "imageType": "image/jpeg" // MIME type of the image
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product Description",
  "price": 19.99,
  "quantity": 100,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
  "imageType": "image/jpeg"
}
```

**Status Codes**:
- 201: Product created successfully
- 400: Invalid request data

### Update Product with New Image

**Endpoint**: `PUT /api/products/{id}`

**Description**: Update an existing product, optionally replacing its image.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Updated Product Name",
  "description": "Updated Product Description",
  "price": 29.99,
  "quantity": 50,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...", // New Base64 encoded image
  "imageType": "image/png" // MIME type of the new image
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Updated Product Name",
  "description": "Updated Product Description",
  "price": 29.99,
  "quantity": 50,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
  "imageType": "image/png"
}
```

**Status Codes**:
- 200: Product updated successfully
- 400: Invalid request data
- 404: Product not found

## Image Retrieval Endpoints

### Get Product with Image

**Endpoint**: `GET /api/products/{id}`

**Description**: Retrieve a product including its image data.

**Response**:
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product Description",
  "price": 19.99,
  "quantity": 100,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
  "imageType": "image/jpeg"
}
```

**Status Codes**:
- 200: Success
- 404: Product not found

### Get All Products with Images

**Endpoint**: `GET /api/products`

**Description**: Retrieve all products including their image data.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product Description",
    "price": 19.99,
    "quantity": 100,
    "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
    "imageType": "image/jpeg"
  }
]
```

**Status Codes**:
- 200: Success

## Implementation Guide for React Team

### 1. Converting Images to Base64

```javascript
// Function to convert file to Base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// Usage example
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const base64 = await convertToBase64(file);
      const imageType = file.type; // e.g., "image/jpeg"
      
      // Now you can use base64 and imageType in your API requests
      const productData = {
        name: "Product Name",
        description: "Product Description",
        price: 19.99,
        quantity: 100,
        imageBase64: base64,
        imageType: imageType
      };
      
      // Send to API
      // ...
    } catch (error) {
      console.error("Error converting image:", error);
    }
  }
};
```

### 2. Creating a Product with Image

```javascript
const createProductWithImage = async (productData) => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      const product = await response.json();
      console.log('Product created:', product);
      return product;
    } else {
      console.error('Failed to create product');
    }
  } catch (error) {
    console.error('Error creating product:', error);
  }
};
```

### 3. Updating a Product with New Image

```javascript
const updateProductWithImage = async (productId, productData) => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      const product = await response.json();
      console.log('Product updated:', product);
      return product;
    } else {
      console.error('Failed to update product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
};
```

## Best Practices

1. **Image Size**: Compress images before converting to Base64 to reduce payload size
2. **Validation**: Validate image types and sizes on the client side before upload
3. **Error Handling**: Implement proper error handling for network failures and API errors
4. **Loading States**: Show loading indicators during image upload and processing
5. **Preview**: Show image previews before uploading

## Testing the API

You can test the API endpoints using tools like Postman:

```bash
# Create a product with image
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product with image",
    "price": 29.99,
    "quantity": 50,
    "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
    "imageType": "image/jpeg"
  }'

# Get a product with image
curl -X GET http://localhost:8080/api/products/1

# Get all products with images
curl -X GET http://localhost:8080/api/products
```

## Common Issues and Solutions

1. **Large Payloads**: Large images result in large Base64 strings. Consider compressing images before upload.
2. **Image Types**: Ensure you're sending the correct MIME type in the `imageType` field.
3. **Network Errors**: Implement retry logic for failed uploads.
4. **Validation**: Validate image dimensions and file types before conversion.