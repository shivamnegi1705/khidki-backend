# API Testing Commands

Use these curl commands to test your backend API deployed on Vercel. Replace `https://khidki-backend.vercel.app` with your actual backend URL if different.

## Basic API Check

```bash
# Check if API is working
curl -X GET https://khidki-backend.vercel.app/
```

## User API

### Register a new user
```bash
curl -X POST https://khidki-backend.vercel.app/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST https://khidki-backend.vercel.app/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get user profile (requires authentication token)
```bash
curl -X GET https://khidki-backend.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update user profile (requires authentication token)
```bash
curl -X PUT https://khidki-backend.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Name"
  }'
```

## Product API

### Get all products
```bash
curl -X GET https://khidki-backend.vercel.app/api/product
```

### Get product by ID
```bash
curl -X GET https://khidki-backend.vercel.app/api/product/PRODUCT_ID_HERE
```

### Create product (requires admin authentication)
```bash
curl -X POST https://khidki-backend.vercel.app/api/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Test Product",
    "description": "This is a test product",
    "price": 99.99,
    "category": "Electronics",
    "stock": 10,
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "public_id": "image1"
      }
    ]
  }'
```

### Update product (requires admin authentication)
```bash
curl -X PUT https://khidki-backend.vercel.app/api/product/PRODUCT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "name": "Updated Product Name",
    "price": 129.99
  }'
```

### Delete product (requires admin authentication)
```bash
curl -X DELETE https://khidki-backend.vercel.app/api/product/PRODUCT_ID_HERE \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Cart API

### Get user cart (requires authentication)
```bash
curl -X GET https://khidki-backend.vercel.app/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add item to cart (requires authentication)
```bash
curl -X POST https://khidki-backend.vercel.app/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": "PRODUCT_ID_HERE",
    "quantity": 2
  }'
```

### Update cart item quantity (requires authentication)
```bash
curl -X PUT https://khidki-backend.vercel.app/api/cart/CART_ITEM_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "quantity": 3
  }'
```

### Remove item from cart (requires authentication)
```bash
curl -X DELETE https://khidki-backend.vercel.app/api/cart/CART_ITEM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Order API

### Create a new order (requires authentication)
```bash
curl -X POST https://khidki-backend.vercel.app/api/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "shippingInfo": {
      "address": "123 Test Street",
      "city": "Test City",
      "state": "Test State",
      "country": "Test Country",
      "pinCode": "123456",
      "phoneNo": "1234567890"
    },
    "paymentMethod": "COD",
    "paymentInfo": {
      "id": "payment_id",
      "status": "succeeded"
    }
  }'
```

### Get all orders (requires admin authentication)
```bash
curl -X GET https://khidki-backend.vercel.app/api/order/admin \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### Get user orders (requires authentication)
```bash
curl -X GET https://khidki-backend.vercel.app/api/order \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get order by ID (requires authentication)
```bash
curl -X GET https://khidki-backend.vercel.app/api/order/ORDER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update order status (requires admin authentication)
```bash
curl -X PUT https://khidki-backend.vercel.app/api/order/ORDER_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "status": "Shipped"
  }'
```

## Troubleshooting

If you encounter any issues with these curl commands, try the following:

1. **CORS Issues**: Add the `-v` flag to see detailed request/response information:
   ```bash
   curl -v -X GET https://khidki-backend.vercel.app/
   ```

2. **Authentication Issues**: Ensure you're using a valid token and it's properly formatted:
   ```bash
   curl -X GET https://khidki-backend.vercel.app/api/user/profile \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

3. **Request Body Issues**: Validate your JSON is properly formatted:
   ```bash
   curl -X POST https://khidki-backend.vercel.app/api/user/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```

4. **Server Errors**: If you get a 500 error, check the Vercel logs for more details.
