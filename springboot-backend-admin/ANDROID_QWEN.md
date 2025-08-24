# Brew Buy Platform - Android App API Documentation

This document provides comprehensive information about the backend REST API for the Brew Buy Platform Android application. The backend is built with Spring Boot and provides endpoints for user authentication, product management (including image retrieval), and order management.

## Base URL

For development:
- Emulator: `http://10.0.2.2:8080`
- Physical device: `http://[YOUR_COMPUTER_IP]:8080`

For production:
- `https://[YOUR_DOMAIN]/api`

## Authentication

All endpoints except registration and login require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer [JWT_TOKEN]
```

### Register User

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string (optional)",
  "phone": "string (optional)"
}
```

**Response**:
```json
{
  "token": "string",
  "username": "string",
  "userType": "user"
}
```

**Status Codes**:
- 200: Success
- 400: Username or email already exists

### Login User

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "token": "string",
  "username": "string",
  "userType": "user"
}
```

**Status Codes**:
- 200: Success
- 400: Invalid credentials

### Logout User

**Endpoint**: `POST /api/auth/logout`

**Response**:
```json
"Logged out successfully"
```

**Status Codes**:
- 200: Success

## Product Management

All product endpoints are publicly accessible (no authentication required for retrieval).

### Get All Products

**Endpoint**: `GET /api/products`

**Description**: Retrieve all products including their image data for display in the app.

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
- 404: Product not found

## Order Management

All order endpoints require authentication with a valid JWT token.

### Create Order

**Endpoint**: `POST /api/orders`

**Request Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 19.99
    }
  ]
}
```

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
- 201: Success
- 400: Validation error
- 401: Unauthorized

### Get Order by ID

**Endpoint**: `GET /api/orders/{id}`

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
- 403: Forbidden (user doesn't own the order)
- 404: Order not found

### Get My Orders

**Endpoint**: `GET /api/orders/user/me`

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

### Update Order Status

**Endpoint**: `PUT /api/orders/{id}/status?status=CONFIRMED`

**Parameters**:
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
- 403: Forbidden (user doesn't own the order)
- 404: Order not found

### Delete Order

**Endpoint**: `DELETE /api/orders/{id}`

**Response**:
No content

**Status Codes**:
- 204: Success
- 401: Unauthorized
- 403: Forbidden (user doesn't own the order)
- 404: Order not found

## Data Models

### User

```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "fullName": "string",
  "phone": "string",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00"
}
```

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
- 403: Forbidden - User doesn't have permission to access the resource
- 404: Not Found - Resource not found
- 500: Internal Server Error - Unexpected server error

## Implementation Notes for Android

1. **JWT Token Storage**: Store the JWT token securely using Android Keystore or EncryptedSharedPreferences
2. **Network Security**: Enable cleartext traffic for development (HTTP) in your network security config
3. **Retrofit Configuration**: Configure Retrofit with an interceptor to automatically add the Authorization header
4. **Error Handling**: Implement proper error handling for network failures and API errors
5. **Loading States**: Implement loading indicators for API calls
6. **Offline Support**: Consider implementing offline support with local database (Room)
7. **Image Handling**: For product images, decode Base64 strings for display

## Example Retrofit Interface

```java
public interface ApiService {
    @POST("api/auth/register")
    Call<AuthResponse> register(@Body User user);
    
    @POST("api/auth/login")
    Call<AuthResponse> login(@Body AuthRequest authRequest);
    
    @POST("api/auth/logout")
    Call<String> logout();
    
    @GET("api/products")
    Call<List<ProductResponse>> getProducts();
    
    @GET("api/products/{id}")
    Call<ProductResponse> getProduct(@Path("id") Long id);
    
    @POST("api/orders")
    Call<OrderResponse> createOrder(@Body CreateOrderRequest request);
    
    @GET("api/orders/{id}")
    Call<OrderResponse> getOrder(@Path("id") Long id);
    
    @GET("api/orders/user/me")
    Call<List<OrderResponse>> getMyOrders();
    
    @PUT("api/orders/{id}/status")
    Call<OrderResponse> updateOrderStatus(@Path("id") Long id, @Query("status") String status);
    
    @DELETE("api/orders/{id}")
    Call<Void> deleteOrder(@Path("id") Long id);
}
```

## Image Handling for Android

### Decoding Base64 Images

```java
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

public class ImageUtils {
    public static Bitmap decodeBase64ToImage(String base64String) {
        try {
            byte[] decodedBytes = Base64.decode(base64String, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

### Using Images in RecyclerView

```java
public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {
    private List<ProductResponse> products;
    
    // ... other adapter code ...
    
    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        ProductResponse product = products.get(position);
        holder.nameTextView.setText(product.getName());
        holder.priceTextView.setText(String.valueOf(product.getPrice()));
        
        // Decode and display image
        if (product.getImageBase64() != null && !product.getImageBase64().isEmpty()) {
            Bitmap bitmap = ImageUtils.decodeBase64ToImage(product.getImageBase64());
            if (bitmap != null) {
                holder.imageView.setImageBitmap(bitmap);
            }
        }
    }
    
    // ... ViewHolder class ...
}
```

## Common Issues and Solutions

1. **CORS Errors**: Make sure you're using the correct IP address for your backend
2. **Network Permissions**: Ensure you have `<uses-permission android:name="android.permission.INTERNET" />` in your AndroidManifest.xml
3. **Emulator Connection**: Use 10.0.2.2 instead of localhost when connecting from Android emulator
4. **Token Expiration**: Handle JWT token expiration by redirecting to login screen
5. **Order Ownership**: Users can only access orders they've created
6. **Image Memory**: Large images may cause memory issues; consider scaling images before display

## Testing Endpoints

You can test the API endpoints using tools like Postman or curl:

```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get products (no authentication required)
curl -X GET http://localhost:8080/api/products

# Create an order (requires authentication)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -d '{"items":[{"productId":1,"quantity":2,"price":19.99}]}'
```

## Workflow for Image Handling

1. **React Team** (Admin Panel):
   - Uploads product images through the admin panel
   - Images are converted to Base64 and sent to the backend
   - Backend stores images as binary data in the database

2. **Android Team** (Mobile App):
   - Retrieves products with Base64 encoded images
   - Decodes Base64 strings to Bitmaps for display
   - Displays images in product listings and details

This workflow ensures that product images uploaded by the admin team are properly displayed in the mobile app.