# Food Delivery Service API Documentation

## Overview

This API provides endpoints for a food delivery service, enabling users to place orders, track orders, manage items, and handle user authentication. Additionally, there is an admin panel for managing items and orders.

## Database

**I chose PostgreSQL as the database**
    
![alt text](https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png)

## Endpoints

### Public Endpoints

#### 1. Register User

**POST /register**

Register a new user.

**Request Body:**

```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**Response:**

-   201 Created
-   400 Bad Request

#### 2. Login

**POST /login**

Authenticate an existing user.

**Request Body:**

```json
{
    "email": "string",
    "password": "string"
}
```

**Response:**

-   200 OK
-   401 Unauthorized

### User Endpoints

#### 3. Create Order

**POST /order**

Place a new order.

**Request Body:**

```json
{
    "userId": "string",
    "items": [
        {
            "itemId": "string",
            "quantity": "integer"
        }
    ],
    "deliveryAddress": "string"
}
```

**Response:**

-   201 Created
-   400 Bad Request

#### 4. Track Order

**GET /order/{orderId}**

Track the status of an order.

**Response:**

-   200 OK
-   404 Not Found

#### 5. Get All Items

**GET /items**

Retrieve a list of all available items.

**Response:**

-   200 OK

#### 6. Get Single Item

**GET /item/{itemId}**

Retrieve details of a single item.

**Response:**

-   200 OK
-   404 Not Found

### Admin Panel Endpoints

#### 7. Create Item

**POST /admin/item**

Add a new item to the menu.

**Request Body:**

```json
{
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "imageUrl": "string"
}
```

**Response:**

-   201 Created
-   400 Bad Request

#### 8. Update Item

**PUT /admin/item/{itemId}**

Update an existing item.

**Request Body:**

```json
{
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "imageUrl": "string"
}
```

**Response:**

-   200 OK
-   400 Bad Request
-   404 Not Found

#### 9. Delete Item

**DELETE /admin/item/{itemId}**

Remove an item from the menu.

**Response:**

-   200 OK
-   404 Not Found

#### 10. Get All Items (Admin)

**GET /admin/items**

Retrieve a list of all items (including unpublished items).

**Response:**

-   200 OK

#### 11. Cancel Order

**DELETE /admin/order/{orderId}**

Cancel an order.

**Response:**

-   200 OK
-   404 Not Found

#### 12. Change Order Status

**PATCH /admin/order/{orderId}/status**

Update the status of an order (e.g., pending, in-progress, completed, canceled).

**Request Body:**

```json
{
    "status": "string"
}
```

**Response:**

-   200 OK
-   400 Bad Request
-   404 Not Found

## Error Responses

Standard error responses include:

-   400 Bad Request: The request could not be understood or was missing required parameters.
-   401 Unauthorized: Authentication failed or user does not have permissions for the desired action.
-   404 Not Found: The requested resource could not be found.
-   500 Internal Server Error: An error occurred on the server.

## Thins I also want to implement

-   **User Profile Management:** Endpoints to view and update user profile information.
-   **Order History:** Endpoints for users to view their past orders.
-   **Favorite Items:** Feature for users to mark items as favorites and quickly access them.
-   **Promotions and Discounts:** Endpoints to manage promotional codes and discounts.
-   **Ratings and Reviews:** Allow users to rate and review items.
-   **Push Notifications:** Notify users of order status changes via push notifications.
-  **Frontend** As an addition to this task I would like to create good looking frontend just in case
## Security Considerations

-   Ensure all sensitive data like passwords are sent HTTPS.
-   Use strong password hashing using bcryptjs for storing user passwords.
-   Implement authentication and authorization mechanisms using jason web token to protect endpoints.
-   Validate and sanitize all inputs to prevent SQL injection and other attacks.


