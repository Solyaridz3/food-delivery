# Food Delivery Service API Documentation

## Overview

This API provides endpoints for a food delivery service, enabling users to place orders, track orders, manage items, and handle user authentication. Additionally, there is an admin panel for managing items and orders.

## Database

**I chose postgresql as the database for the project**
    
![alt text](https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png)

### Database Schema

```sql
-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('customer', 'admin', 'delivery_person'))
);

-- Table: items
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  preparation_time DECIMAL(5, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255)
);

-- Table: drivers
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id),
  driver_status VARCHAR(20) NOT NULL CHECK (driver_status IN ('available', 'delivering', 'unavailable'))
);

-- Table: orders
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  driver_id INT REFERENCES drivers(id),
  order_total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'delivered', 'canceled')),
  delivery_time TIMESTAMP
);

-- Table: order_items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id),
  item_id INT REFERENCES items(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

### Documentation

1. **Table: `users`**
   - **Description**: This table stores information about users who interact with the food delivery platform. It includes customers, admins, and delivery personnel.
   - **Columns**:
     - `id`: Unique identifier for each user (Primary Key).
     - `name`: The name of the user.
     - `email`: The user's email address (must be unique).
     - `password`: The user's password (hashed for security).
     - `phone`: The user's phone number.
     - `user_role`: The role of the user in the system. This can be `customer`, `admin`, or `delivery_person`.

2. **Table: `items`**
   - **Description**: This table holds information about the food items available for delivery.
   - **Columns**:
     - `id`: Unique identifier for each item (Primary Key).
     - `name`: The name of the item.
     - `preparation_time`: The time required to prepare the item.
     - `price`: The cost of the item.
     - `image_url`: A URL to an image of the item.

3. **Table: `drivers`**
   - **Description**: This table contains information about drivers who deliver food to customers.
   - **Columns**:
     - `id`: Unique identifier for each driver (Primary Key).
     - `user_id`: A foreign key that references the `id` of the `users` table to associate driver information with a user.
     - `driver_status`: The current status of the driver. Possible values are `available`, `delivering`, and `unavailable`.

4. **Table: `orders`**
   - **Description**: This table stores information about orders placed by customers.
   - **Columns**:
     - `order_id`: Unique identifier for each order (Primary Key).
     - `user_id`: A foreign key that references the `id` of the `users` table, indicating who placed the order.
     - `driver_id`: A foreign key that references the `id` of the `drivers` table, indicating the driver assigned to deliver the order.
     - `order_total`: The total cost of the order.
     - `status`: The current status of the order. Possible values are `pending`, `confirmed`, `delivered`, `canceled`.
     - `delivery_time`: The time when the order is delivered.

5. **Table: `order_items`**
   - **Description**: This table maintains a record of items that are part of each order.
   - **Columns**:
     - `id`: Unique identifier for each order item record (Primary Key).
     - `order_id`: A foreign key that references the `order_id` of the `orders` table.
     - `item_id`: A foreign key that references the `id` of the `items` table.
     - `quantity`: The quantity of the item in the order.
     - `price`: The price of the item in the order.

### Relationships

- **`users` ↔ `drivers`**: One-to-One relationship. Each driver is a user, but not every user is a driver.
- **`users` ↔ `orders`**: One-to-Many relationship. A user (customer) can have many orders, but an order belongs to one user.
- **`drivers` ↔ `orders`**: One-to-Many relationship. A driver can deliver many orders, but each order is delivered by one driver.
- **`orders` ↔ `order_items`**: One-to-Many relationship. An order can have multiple order items.
- **`items` ↔ `order_items`**: One-to-Many relationship. An item can appear in multiple orders. 


## Authorization and authentication

Here is the documentation for creating a custom JWT (JSON Web Token) implementation without using libraries like `jsonwebtoken` for the authentication mechanism in your Node.js backend. This documentation explains the key functions used to generate and verify JWT tokens and their integration into an Express middleware for authentication.

## Custom JWT Implementation Documentation

### Overview

This documentation covers the implementation of a custom JWT (JSON Web Token) creation and verification system using Node.js and the `crypto` module. JWTs are a compact, URL-safe means of representing claims transferred between two parties. In this project, JWTs are used for user authentication and authorization.

### Requirements

- **Node.js**: JavaScript runtime environment.
- **Crypto Module**: A built-in Node.js module that provides cryptographic functionalities.
- **Express.js**: A web application framework for Node.js.

### Implementation Details

1. **JWT Creation (`createToken` function)**
2. **JWT Verification (`verifyToken` function)**
3. **Authentication Middleware (`authMiddleware` function)**

### 1. JWT Creation (`createToken` Function)

The `createToken` function is responsible for creating a JWT for a user. It follows these steps:

- **Header**: Defines the algorithm (`HS256` - HMAC using SHA-256) and the type (`JWT`).
- **Payload**: Contains user information, such as `id` and `role`.
- **Signature**: A hashed value created using the header, payload, and a secret key.

#### Code:

```javascript
import crypto from "crypto";

const secret = "secret"; // Will be replaced with secure key from .env variable

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function createToken(user) {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { id: user.id, role: user.userRole };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
        .createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}
```


### Explanation of Each Step

1. **Create HMAC Object**: 
   - `crypto.createHmac("sha256", secret)` initializes an HMAC (Hash-based Message Authentication Code) object using the SHA-256 hashing algorithm and a secret key. This secret key is used to ensure that the resulting hash is unique and cannot be reproduced without the same key.

2. **Update HMAC Object with Data**:
   - `.update(`${encodedHeader}.${encodedPayload}`)` provides the data to the HMAC object. In the case of JWT, this data is the encoded header and payload separated by a dot (`.`). The `encodedHeader` and `encodedPayload` are strings that have been Base64 URL encoded.

3. **Generate Digest in Base64 Format**:
   - `.digest("base64")` computes the HMAC digest and outputs it as a Base64 encoded string. This is the "raw" signature of the token, but it is not yet URL-safe.

4. **Convert Base64 to Base64 URL Encoding**:
   - `.replace(/=/g, "")`: Removes any `=` characters from the end of the Base64 encoded string. These are padding characters and are not needed in Base64 URL encoding.
   - `.replace(/\+/g, "-")`: Replaces `+` characters with `-`. The `+` character is not URL-safe.
   - `.replace(/\//g, "_")`: Replaces `/` characters with `_`. The `/` character is also not URL-safe.

The final result is a URL-safe Base64 encoded signature, which can be included in the JWT without any issues with URLs or web requests.

### Why Use Base64 URL Encoding?

Base64 URL encoding is essential for JWTs because JWTs are often used in URLs (e.g., as query parameters) or in HTTP headers. Standard Base64 encoding includes characters that have special meanings in URLs (`+`, `/`, `=`). By replacing these characters with their URL-safe equivalents, you avoid issues where these characters could be misinterpreted or cause errors in web contexts.

### 2. JWT Verification (`verifyToken` Function)

The `verifyToken` function is responsible for decoding and verifying the integrity of a JWT. It ensures that the JWT has not been tampered with and is valid.

#### Code:

```javascript
function verifyToken(token) {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
    }

    const payload = JSON.parse(
        Buffer.from(encodedPayload, "base64").toString()
    );
    return payload;
}
```

#### Explanation:

- **Splitting Token**: The token is split into its constituent parts: header, payload, and signature.
- **Signature Validation**: Recalculates the expected signature and compares it with the provided signature.
- **Payload Decoding**: Decodes the payload if the signature is valid, returning the payload data.

### 3. Authentication Middleware (`authMiddleware` Function)

The `authMiddleware` function is used to protect routes by verifying the JWT from the `Authorization` header.

#### Code:

```javascript
import token from "../utils/token.js";
import HttpException from "../utils/exceptions/HttpException.js";

export async function authMiddleware(req, res, next) {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith("Bearer ")) {
        return next(new HttpException(401, "Unauthorized"));
    }
    
    const accessToken = bearer.split("Bearer ")[1].trim();

    try {
        const payload = await token.verifyToken(accessToken);

        if (!payload.id) {
            return next(new HttpException(401, "Unauthorized"));
        }

        const userId = payload.id;
        req.user = userId;

        return next();
    } catch (error) {
        return next(new HttpException(401, "Unauthorized"));
    }
}
```

#### Explanation:

- **Authorization Header Check**: Checks for the presence and format of the `Authorization` header.
- **Token Extraction**: Extracts the JWT from the header.
- **Token Verification**: Uses `verifyToken` to validate the JWT.
- **Request User Assignment**: Assigns the user ID to `req.user` if the token is valid.
- **Error Handling**: Throws an `Unauthorized` error if the token is invalid or missing.

### Note

- Make sure to use a strong and secure `secret` for signing JWTs in production.

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
    "address": "string"
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


