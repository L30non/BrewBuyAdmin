# Brew Buy Platform - Admin Panel API Documentation

This document provides comprehensive information about the backend REST API for the Brew Buy Platform Admin Panel. The backend is built with Spring Boot and provides endpoints for user authentication, product management (including image handling), and order management.

## Base URL

For development:
- Local: `http://localhost:8080`
- If accessing from another device: `http://[YOUR_COMPUTER_IP]:8080`

For production:
- `https://[YOUR_DOMAIN]/api`

## Authentication

Admin endpoints require JWT authentication with admin privileges. Include the token in the Authorization header:

```
Authorization: Bearer [JWT_TOKEN]
```

### Admin Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```

**Response**:
```json
{
  "token": "string",
  "username": "admin_username",
  "userType": "admin"
}
```

**Status Codes**:
- 200: Success
- 400: Invalid credentials

## Product Management

All product management endpoints require admin authentication.

### Get All Products

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
- 401: Unauthorized

### Get Product by ID

**Endpoint**: `GET /api/products/{id}`

**Description**: Retrieve a specific product including its image data.

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
- 401: Unauthorized
- 404: Product not found

### Create Product with Image

**Endpoint**: `POST /api/products`

**Description**: Create a new product with an optional image.

**Request Body**:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 19.99,
  "quantity": 100,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...", // Optional Base64 encoded image
  "imageType": "image/jpeg" // Required if imageBase64 is provided
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
- 201: Success
- 400: Validation error
- 401: Unauthorized

### Create Multiple Products

**Endpoint**: `POST /api/products/batch`

**Description**: Create multiple products at once.

**Request Body**:
```json
[
  {
    "name": "Product 1",
    "description": "Description 1",
    "price": 19.99,
    "quantity": 100,
    "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
    "imageType": "image/jpeg"
  },
  {
    "name": "Product 2",
    "description": "Description 2",
    "price": 29.99,
    "quantity": 50
  }
]
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Product 1",
    "description": "Description 1",
    "price": 19.99,
    "quantity": 100,
    "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
    "imageType": "image/jpeg"
  },
  {
    "id": 2,
    "name": "Product 2",
    "description": "Description 2",
    "price": 29.99,
    "quantity": 50,
    "imageBase64": null,
    "imageType": null
  }
]
```

**Status Codes**:
- 201: Success
- 400: Validation error
- 401: Unauthorized

### Update Product with Image

**Endpoint**: `PUT /api/products/{id}`

**Description**: Update an existing product, optionally replacing its image.

**Request Body**:
```json
{
  "name": "Updated Product Name",
  "description": "Updated Product Description",
  "price": 29.99,
  "quantity": 50,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...", // Optional new Base64 encoded image
  "imageType": "image/png" // Required if imageBase64 is provided
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
- 200: Success
- 400: Validation error
- 401: Unauthorized
- 404: Product not found

### Delete Product

**Endpoint**: `DELETE /api/products/{id}`

**Description**: Delete a product.

**Response**:
No content

**Status Codes**:
- 204: Success
- 401: Unauthorized
- 404: Product not found

## Order Management

All order management endpoints require admin authentication.

### Get All Orders

**Endpoint**: `GET /api/orders`

**Description**: Retrieve all orders.

**Response**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "totalAmount": 39.98,
    "status": "PENDING",
    "createdAt": "2023-01-01T00:00:00",
    "updatedAt": "2023-01-01T00:00:00",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": 19.99
      }
    ]
  }
]
```

**Status Codes**:
- 200: Success
- 401: Unauthorized

### Get Order by ID

**Endpoint**: `GET /api/orders/{id}`

**Description**: Retrieve a specific order.

**Response**:
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 39.98,
  "status": "PENDING",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "price": 19.99
    }
  ]
}
```

**Status Codes**:
- 200: Success
- 401: Unauthorized
- 404: Order not found

### Update Order Status

**Endpoint**: `PUT /api/orders/{id}/status`

**Description**: Update the status of an order.

**Request Parameters**:
- status (query parameter): New status value (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)

**Response**:
```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 39.98,
  "status": "CONFIRMED",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T01:00:00",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "price": 19.99
    }
  ]
}
```

**Status Codes**:
- 200: Success
- 400: Invalid status value
- 401: Unauthorized
- 404: Order not found

### Delete Order

**Endpoint**: `DELETE /api/orders/{id}`

**Description**: Delete an order.

**Response**:
No content

**Status Codes**:
- 204: Success
- 401: Unauthorized
- 404: Order not found

## Data Models

### Product

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "price": 19.99,
  "quantity": 100,
  "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
  "imageType": "image/jpeg"
}
```

### Order

```json
{
  "id": 1,
  "userId": 1,
  "totalAmount": 39.98,
  "status": "PENDING",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "price": 19.99
    }
  ]
}
```

### OrderItem

```json
{
  "id": 1,
  "productId": 1,
  "quantity": 2,
  "price": 19.99
}
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success (GET, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request - Invalid request parameters or validation errors
- 401: Unauthorized - Missing or invalid authentication token
- 404: Not Found - Resource not found
- 500: Internal Server Error - Unexpected server error

## Implementation Notes for React

1. **JWT Token Storage**: Store the JWT token securely using browser localStorage or sessionStorage
2. **Axios Configuration**: Configure Axios with an interceptor to automatically add the Authorization header
3. **Error Handling**: Implement proper error handling for network failures and API errors
4. **Loading States**: Implement loading indicators for API calls
5. **Image Handling**: For product images, convert images to Base64 format for upload and decode Base64 strings for display

## Example Axios Configuration

```javascript
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

## Example API Calls

```javascript
// Get all products
const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Create a product with image
const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
```

## Testing Endpoints

You can test the API endpoints using tools like Postman:

```bash
# Admin login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get all products (requires admin authentication)
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer [ADMIN_JWT_TOKEN]"

# Create a product with image (requires admin authentication)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ADMIN_JWT_TOKEN]" \
  -d '{
    "name": "Test Product",
    "description": "A test product with image",
    "price": 29.99,
    "quantity": 50,
    "imageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...",
    "imageType": "image/jpeg"
  }'
```