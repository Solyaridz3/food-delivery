# Food Delivery Service API Documentation

## Overview

This API provides endpoints for a food delivery service, enabling users to place orders, track orders, manage items, and handle user authentication. Additionally, there is an admin panel for managing items and orders.

### Contents

1. [Overview](#overview)
2. [Database](#database)
    - [Database Schema](#database-schema)
    - [Table Descriptions](#documentation)
    - [Relationships](#relationships)
3. [Executing SQL Scripts Using JavaScript](#executing-the-sql-script-using-javascript)
    - [Database Schema Creation](#1-database-schema-creation)
    - [JavaScript Script for Schema Execution](#executing-the-sql-script-using-javascript)
4. [Query Documentation](#query-documentation)
    - [Order Queries](#orderqueriesjs)
    - [Item Queries](#itemqueriesjs)
    - [Driver Queries](#driverqueriesjs)
    - [Admin Queries](#adminqueriesjs)
    - [User Queries](#userqueriesjs)
5. [Authorization and Authentication](#authorization-and-authentication)
    - [Custom JWT Implementation](#custom-jwt-implementation-documentation)
    - [JWT Creation (`createToken` function)](#1-jwt-creation-createtoken-function)
    - [JWT Verification (`verifyToken` function)](#2-jwt-verification-verifytoken-function)
    - [Authentication Middleware (`authMiddleware` function)](#3-authentication-middleware-authmiddleware-function)
6. [CI Pipeline Documentation](#ci-pipeline-documentation)
    - [Workflow File Overview](#workflow-file-overview)
    - [Trigger Events](#trigger-events)
    - [Jobs](#jobs)
    - [Job Steps](#job-build-and-test)
7. [Docker Setup Documentation for Food Delivery App](#docker-setup-documentation-for-food-delivery-app)
    - [Prerequisites](#prerequisites)
    - [Project Structure](#project-structure)
    - [Docker Files Overview](#docker-files-overview)
    - [Environment Variables](#environment-variables)
    - [Docker Compose Services](#docker-compose-services)
    - [Building and Running the Containers](#building-and-running-the-containers)
    - [Explanation of Key Components](#explanation-of-key-components)
    - [Environment Variables](#environment-variables-1)
    - [Troubleshooting](#troubleshooting)

---

## Database

**I chose postgresql as the database for the project**

![alt text](https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png)

### Database Schema

![Db Schema](https://i.postimg.cc/C5n8tLjC/food-delivery-3-pdf-image-002.png)

```sql
-- Table: users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_role VARCHAR(20) NOT NULL CHECK (
        user_role IN ('user', 'admin', 'driver')
    )
);

-- Table: items
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    preparation_time INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(2083) NOT NULL
);

-- Table: drivers
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (
        status IN ('available', 'delivering', 'unavailable')
    ) DEFAULT 'available'
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    driver_id INT REFERENCES drivers(id),
    order_total DECIMAL(10, 2) NOT NULL,
    delivery_status VARCHAR(20) NOT NULL CHECK (
        delivery_status IN ('pending', 'confirmed', 'delivered', 'canceled')
    ) DEFAULT 'pending',
    delivery_time VARCHAR(10) NOT NULL
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    item_id INT REFERENCES items(id),
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL
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
        - `image_url`: A URL to an image of the item. (Using AWS S3 bucket to store images and getting urls from it)

3. **Table: `drivers`**

    - **Description**: This table contains information about drivers who deliver food to customers.
    - **Columns**:
        - `id`: Unique identifier for each driver (Primary Key).
        - `user_id`: A foreign key that references the `id` of the `users` table to associate driver information with a user.
        - `delivery_status`: The current status of the driver. Possible values are `available`, `delivering`, and `unavailable`.

4. **Table: `orders`**

    - **Description**: This table stores information about orders placed by customers.
    - **Columns**:
        - `id`: Unique identifier for each order (Primary Key).
        - `user_id`: A foreign key that references the `id` of the `users` table, indicating who placed the order.
        - `driver_id`: A foreign key that references the `id` of the `drivers` table, indicating the driver assigned to deliver the order.
        - `order_total`: The total cost of the order.
        - `status`: The current status of the order. Possible values are `pending`, `confirmed`, `delivered`, `canceled`.
        - `delivery_time`: The time when the order is delivered. (Calculation based on preparation time, restaurant address and user address using Google Maps API)

5. **Table: `order_items`**
    - **Description**: This table maintains a record of items that are part of each order.
    - **Columns**:
        - `id`: Unique identifier for each order item record (Primary Key).
        - `order_id`: A foreign key that references the `order_id` of the `orders` table.
        - `item_id`: A foreign key that references the `id` of the `items` table.
        - `quantity`: The quantity of the item in the order.
        - `price`: The price of the item in the order.

### Relationships

-   **`users` ↔ `drivers`**: One-to-One relationship. Each driver is a user, but not every user is a driver.
-   **`users` ↔ `orders`**: One-to-Many relationship. A user (customer) can have many orders, but an order belongs to one user.
-   **`drivers` ↔ `orders`**: One-to-Many relationship. A driver can deliver many orders, but each order is delivered by one driver.
-   **`orders` ↔ `order_items`**: One-to-Many relationship. An order can have multiple order items.
-   **`items` ↔ `order_items`**: One-to-Many relationship. An item can appear in multiple orders.

To create documentation for the given SQL queries and Node.js pool usage for PostgreSQL, we'll break it down into sections corresponding to each task and query file:

### 1. **Database Schema Creation**

First, let's write the SQL script to create the database with all necessary tables, columns, and relationships.

#### `database/schema.sql`

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_role VARCHAR(20) DEFAULT 'user'
);

-- Drivers Table
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'available'
);

-- Items Table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  preparation_time INTEGER NOT NULL,
  image_url VARCHAR(255)
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  order_total DECIMAL(10, 2) NOT NULL,
  delivery_time TIMESTAMP NOT NULL,
  delivery_status VARCHAR(20) DEFAULT 'pending'
);

-- Order Items Table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL
);
```

### 2. **Example usage**

To execute the SQL script and create the database, we'll use the `pg` package in Node.js to connect to PostgreSQL.

#### `Code Example`

```javascript
import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
    user: "your_db_user",
    host: "localhost",
    database: "your_db_name",
    password: "your_db_password",
    port: 5432,
});

const setupDatabase = async () => {
    const schemaPath = path.join(__dirname, "database", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    try {
        await pool.query(schema);
        console.log("Database and tables created successfully.");
    } catch (error) {
        console.error("Error creating database tables:", error);
    } finally {
        pool.end();
    }
};

setupDatabase();
```

### **Query Documentation**

Documentation for the queries in each file. We'll go over what each query does and provide a brief explanation.

#### **order/queries.js**

1. **`insertOrderItems`**: Inserts items into the `order_items` table with details like `order_id`, `item_id`, `quantity`, and `item_price`.

2. **`create`**: Inserts a new order into the `orders` table with details such as `user_id`, `driver_id`, `order_total`, and `delivery_time`. It returns the `id` of the newly created order.

3. **`getOrderById`**: Fetches all details of an order using its `id`.

4. **`getUserOrders`**: Fetches all orders associated with a specific `user_id`.

5. **`setDelivered`**: Updates the `delivery_status` of an order using the `id`.

6. **`getItemsData`**: Retrieves item details such as `id`, `price`, and `preparation_time` for a list of item IDs.

7. **`getOrderItems`**: Fetches items in an order, including `item_id`, `quantity`, and `item_price` for a given `order_id`.

### **items/queries.js**

1. **`getAll`**:  
   Retrieves all records from the `items` table. This query is useful when you want to display or list all items available in the database.

2. **`getSelection`**:  
   Retrieves items from the `items` table where the `id` matches any of the values in the provided array. This query is helpful when you need to fetch specific items based on a list of IDs.

    - **Parameters**:
        - `$1`: An array of item IDs to filter by.

3. **`getById`**:  
   Retrieves a single item from the `items` table based on a specific `id`. This query is useful when you need to fetch details for a single item.

    - **Parameters**:
        - `$1`: The ID of the item to retrieve.

#### **driver/queries.js**

1. **`registerDriver`**: Registers a new driver by inserting a new record into the `drivers` table linked to a `user_id`.

2. **`changeStatus`**: Updates the status of a driver (e.g., `available`, `unavailable`) for a given `user_id`.

3. **`getAvailableDrivers`**: Retrieves all drivers who are currently marked as `available`.

4. **`setUserDriverStatus`**: Updates the `user_role` in the `users` table to `driver` for a given `user_id`.

#### **admin/queries.js**

1. **`getAllOrders`**: Retrieves all records from the `orders` table.

2. **`deleteUserRelatedDriver`**: Deletes a driver record from the `drivers` table for a given `user_id`.

3. **`deleteUser`**: Deletes a user record from the `users` table by `id`.

4. **`getAllUsers`**: Fetches basic user information such as `id`, `name`, `email`, `phone`, and `user_role`.

5. **`createItem`**: Adds a new item to the `items` table with details such as `name`, `price`, `preparation_time`, and `image_url`.

6. **`deleteItem`**: Removes an item from the `items` table using its `id`.

7. **`getAllDrivers`**: Retrieves all records from the `drivers` table.

#### **user/queries.js**

1. **`register`**: Inserts a new user into the `users` table and returns the newly created user's details.

2. **`getByEmail`**: Fetches a user record by their `email`.

3. **`getById`**: Retrieves user details by `id`, including sensitive information like `password`.

4. **`updateUser`**: Updates a user's details in the `users` table by their `id`.

5. **`registerAsAdmin`**: Updates a user's role to `admin` in the `users` table.

### Conclusion

This documentation provides a detailed information on each query used in the project. Make sure to tailor the SQL schema and connection details to your specific environment and use case.

## Authorization and authentication

Here is the documentation for creating a custom JWT (JSON Web Token) implementation without using libraries like `jsonwebtoken` for the authentication mechanism in your Node.js backend. This documentation explains the key functions used to generate and verify JWT tokens and their integration into an Express middleware for authentication.

## Custom JWT Implementation Documentation

### Overview

This documentation covers the implementation of a custom JWT (JSON Web Token) creation and verification system using Node.js and the `crypto` module. JWTs are a compact, URL-safe means of representing claims transferred between two parties. In this project, JWTs are used for user authentication and authorization.

### Requirements

-   **Node.js**: JavaScript runtime environment.
-   **Crypto Module**: A built-in Node.js module that provides cryptographic functionalities.
-   **Express.js**: A web application framework for Node.js.

### Implementation Details

1. **JWT Creation (`createToken` function)**
2. **JWT Verification (`verifyToken` function)**
3. **Authentication Middleware (`authMiddleware` function)**

### 1. JWT Creation (`createToken` Function)

The `createToken` function is responsible for creating a JWT for a user. It follows these steps:

-   **Header**: Defines the algorithm (`HS256` - HMAC using SHA-256) and the type (`JWT`).
-   **Payload**: Contains user information, such as `id` and `role`.
-   **Signature**: A hashed value created using the header, payload, and a secret key.

#### Code:

```javascript
import crypto from "crypto";

const secret = "secret";

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function createToken(user, expiresIn = 7200) {
    const header = { alg: "HS256", typ: "JWT" };
    const currentTime = Math.floor(Date.now() / 1000);
    const payload = {
        id: user.id,
        role: user.user_role,
        expires: currentTime + expiresIn,
    };
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

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.expires && currentTime > payload.expires) {
        throw new Error("Token has expired");
    }

    return payload;
}
```

#### Explanation:

-   **Splitting Token**: The token is split into its constituent parts: header, payload, and signature.
-   **Signature Validation**: Recalculates the expected signature and compares it with the provided signature.
-   **Payload Decoding**: Decodes the payload if the signature is valid, returning the payload data.

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

-   **Authorization Header Check**: Checks for the presence and format of the `Authorization` header.
-   **Token Extraction**: Extracts the JWT from the header.
-   **Token Verification**: Uses `verifyToken` to validate the JWT.
-   **Request User Assignment**: Assigns the user ID to `req.user` if the token is valid.
-   **Error Handling**: Throws an `Unauthorized` error if the token is invalid or missing.

### Note

-   Make sure to use a strong and secure `secret` for signing JWTs in production.

---

Here is the documentation for the GitHub Actions workflow titled "CI Pipeline":

---

# CI Pipeline Documentation

This CI (Continuous Integration) pipeline is designed to automatically build, test, lint, and validate code changes in the `fixes` branch. The workflow is triggered on both push and pull request events targeting the `fixes` branch.

## Workflow File Overview

### Workflow Name

```yaml
name: CI Pipeline
```

### Trigger Events

The workflow triggers on the following events:

-   **Push**: When code is pushed to the `fixes` branch.
-   **Pull Request**: When a pull request is opened, synchronized, or reopened with the `fixes` branch.

```yaml
on:
    push:
        branches:
            - fixes
    pull_request:
        branches:
            - fixes
```

### Jobs

#### Job: build-and-test

This job runs on the latest Ubuntu environment and consists of the following steps:

```yaml
jobs:
    build-and-test:
        runs-on: ubuntu-latest
        steps: ...
```

#### Step 1: Checkout Code

This step uses the GitHub Action `actions/checkout@v3` to pull the code from the repository.

```yaml
- name: Checkout code
  uses: actions/checkout@v3
```

#### Step 2: Set up Node.js

This step sets up Node.js version 20 using the `actions/setup-node@v3` GitHub Action.

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
      node-version: 20
```

#### Step 3: Build Docker Images

This step builds the Docker images defined in the `docker-compose.yml` file.

```yaml
- name: Build Docker images
  run: docker compose build
```

#### Step 4: Run Linting

This step runs linting checks using Docker Compose to ensure code quality and consistency. It uses the `lint` service defined in your `docker-compose.yml` file.

```yaml
- name: Run Linting
  run: docker compose run --rm lint
```

#### Step 5: Run e2e Tests

This step sets up the required environment variables and runs the tests using Docker Compose. The environment variables are populated using GitHub Secrets.

```yaml
- name: Run Tests
  env:
      BUCKET_NAME: ${{ secrets.BUCKET_NAME }}
      BUCKET_LOCATION: ${{ secrets.BUCKET_LOCATION }}
      GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}
      S3_ACCESS_KEY: ${{ secrets.S3_ACCESS_KEY }}
      S3_SECRET_ACCESS_KEY: ${{ secrets.S3_SECRET_ACCESS_KEY }}
      DB_TEST_HOST: ${{ secrets.DB_TEST_HOST }}
      DB_HOST: ${{ secrets.DB_HOST }}
      DB_PORT: ${{ secrets.DB_PORT }}
      DB_USER: ${{ secrets.DB_USER }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
      DB_DATABASE: ${{ secrets.DB_DATABASE }}
  run: |
      echo "DB_TEST_HOST=${DB_TEST_HOST}" > .env
      echo "DB_HOST=${DB_HOST}" >> .env
      echo "DB_PORT=${DB_PORT}" >> .env
      echo "DB_USER=${DB_USER}" >> .env
      echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
      echo "DB_DATABASE=${DB_DATABASE}" >> .env
      echo "GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}" >> .env
      echo "S3_ACCESS_KEY=${S3_ACCESS_KEY}" >> .env
      echo "S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}" >> .env
      echo "BUCKET_NAME=${BUCKET_NAME}" >> .env
      echo "BUCKET_LOCATION=${BUCKET_LOCATION}" >> .env
      docker compose up --abort-on-container-exit e2e-test test-db
```
#### Step 6: Run Unit Tests

```yaml
- name: Run Unit Tests
  run: docker compose up unit-test
```

### Environment Variables

The following environment variables are required for the test run and are securely stored as GitHub Secrets:

-   **BUCKET_NAME**: Name of the storage bucket.
-   **BUCKET_LOCATION**: Location of the storage bucket.
-   **GOOGLE_MAPS_API_KEY**: API key for Google Maps.
-   **S3_ACCESS_KEY**: AWS S3 access key.
-   **S3_SECRET_ACCESS_KEY**: AWS S3 secret access key.
-   **DB_TEST_HOST**: Database host for testing.
-   **DB_HOST**: Database host.
-   **DB_PORT**: Database port.
-   **DB_USER**: Database username.
-   **DB_PASSWORD**: Database password.
-   **DB_DATABASE**: Database name.

### Key Points

-   **Security**: All sensitive data is stored in GitHub Secrets to prevent exposure in logs.
-   **Automation**: Ensures continuous integration of code changes, helping maintain code quality by running linting and tests automatically.
-   **Linting**: Automated linting checks are run to enforce code style and quality standards.
-   **Docker Compose**: Used for running linting and tests in isolated environments, ensuring consistency across development and CI.

---

# Docker Setup Documentation for Food Delivery App

### Prerequisites

-   **Docker**: Ensure that Docker is installed on your machine. You can download it from [Docker's official website](https://www.docker.com/get-started).
-   **Docker Compose**: Docker Compose is included in Docker Desktop for Windows and Mac. For Linux, you may need to install it separately.

### Project Structure

The project structure should look like this:

```
/project-root
|-- Dockerfile
|-- Dockerfile.test
|-- docker-compose.yaml
|-- wait-for-it.sh
|-- /db
|   |-- init.sql
|   |-- test-data.sql
|-- /src
    |-- index.js
    |-- other source files...
```

### Docker Files Overview

1. **`Dockerfile`**: Builds the main application image.
2. **`Dockerfile.test`**: Builds a test environment for the application.
3. **`docker-compose.yaml`**: Defines the services for the app, including the main app, database, and test environment.

### Environment Variables

Ensure you have a `.env` file in your project root with the following variables defined:

```plaintext
# Database configuration
DB_HOST=db
DB_TEST_HOST=test-db
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AWS S3 configuration
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
BUCKET_NAME=your_bucket_name
BUCKET_LOCATION=your_bucket_location
```

### Docker Compose Services

-   **db**: Sets up the main PostgreSQL database using the official `postgres` image. It runs the `init.sql` file to initialize the database.
-   **test-db**: Similar to the `db` service, but it additionally loads test data from `test-data.sql`.
-   **app**: Builds the main application using the `Dockerfile`, exposing it on port 13000.
-   **test**: Builds the testing environment using `Dockerfile.test`, exposing it on port 13001.

### Building and Running the Containers

1. **Build the Images and Start Services**:

    Use the following command to build and start app and run db for it:

    ```bash
    docker-compose up app
    ```

    This command will:

    - Pull the `postgres` image for the databases.
    - Will start the `app` and `db` services, allowing you to run main app.

2. **Stopping the Services**:

    To stop all running services, press `CTRL + C` in the terminal where `docker-compose` is running, or use:

    ```bash
    docker-compose down
    ```

    This command stops all containers and removes the networks created by `docker-compose up`.

3. **Running Unit Tests**:

    To run tests locally, you can execute:

    ```bash
    docker-compose up unit-test
    ```
4. **Running e2e Tests**

    ```bash
    docker-compose up e2e-test
    ```
    This command will start the `e2e-test` and `test-db` services, allowing you to run the test suite.

5. **Running linting**

    To run linting

    ```bash
    docker compose run --rm lint
    ```

### Explanation of Key Components

-   **`wait-for-it.sh`**: A script used to wait for the database to be ready before starting the application. This ensures that the Node.js app does not start until the database is fully initialized.
-   **Volumes**:
    -   `./db/init.sql:/docker-entrypoint-initdb.d/init.sql`: Loads the initial SQL file to set up the main database.
    -   `./db/test-data.sql:/docker-entrypoint-initdb.d/test-data.sql`: Loads additional test data for the test database.
-   **Environment Variables**: Set in the `.env` file to configure the database connection, API keys, and other credentials.

### Troubleshooting

-   **Database Connection Issues**: Ensure that the database services (`db` and `test-db`) are running and accessible at the specified ports.
-   **Missing `.env` File**: If environment variables are missing, ensure that the `.env` file is correctly set up and is being used by Docker Compose.
-   **Port Conflicts**: Ensure that ports 13000 and 13001 are not being used by other applications on your machine.

This setup should help you effectively manage the Docker environment for your food delivery app, providing a robust framework for both development and testing.

## Endpoints

### Public Endpoints

#### Register User

**POST api/v2/users/register**

Register a new user.

**Request Body:**

```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "phone": "string"
}
```

**Response:**

-   201 Created
-   400 Bad Request

#### Login

**POST api/v2/users/login**

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


#### Update user

**PATCH api/v2/users**

Requires Bearer token in Authorization header

```json
{
    "name": "Serhiy",
    "password": "JohnDoe123",
    "email": "serhiy@gmail.com"
}
```

Required req.body fields: password

Optional req.body fields: new_password, email, phone, name

**Response:**

-   200 Created
-   400 Bad Request



#### Create Order

**POST api/v2/orders**

Place a new order. This endpoint requires authentication.

**Request Body:**

```json
{
    "items": [
        {
            "id": "integer",
            "quantity": "integer"
        }
    ],
    "address": "string"
}
```

**Response:**

-   201 Created
-   400 Bad Request

#### Track Order

**GET api/v2/orders/details/{orderId}**

Track the status of an order.

**Response:**

-   200 OK
-   404 Not Found

#### Get Order Items

**GET api/v2/orders/oder-items/{orderId}**

**Request Body:**

```json
{
    "status": "string"
}
```

#### Get My Orders

**GET api/v2/orders/orders/user-orders**

** Response **

- 200 OK



#### Get All Items

**GET api/v2/items**

Retrieve a list of all available items.

**Response:**

-   200 OK

#### Get Items Selection
Retrieve a list of items with specific ids.

**GET api/v2/selection**

**Request body**

```json
{
    "items_ids": [1,2]
}
```

**Response**

- 200 OK
- 400 Bad request


#### Get Single Item

**GET api/v2/items/{itemId}**

Retrieve details of a single item.

**Response:**

-   200 OK
-   404 Not Found

### Admin Panel Endpoints

#### Create Item

**POST api/v2/admin/items**

Add a new item to the menu.

**Content-Type:**

multipart/form-data

**Request Body:**

- **image**: File (e.g., `image.png`)
- **name**: Text (e.g., `"Burger"`)
- **price**: Text (e.g., `"20"`)
- **preparation_time**: Text (e.g., `"20"`)

**Request Body:**


**Response:**

-   201 Created
-   400 Bad Request

#### Update Item

**PUT api/v2/admin/items/{itemId}**

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

#### Delete Item

**DELETE api/v2/admin/items/{itemId}**

Remove an item from the menu.

**Response:**

-   204 No Content
-   404 Not Found

#### Cancel Order

**DELETE api/v2/admin/orders/{orderId}**

Cancel an order.

**Response:**

-   204 No Content
-   404 Not Found

#### Change Order Status

**PATCH api/v2/admin/orders/{orderId}/status**

Update the status of an order (e.g., pending, in-progress, completed, canceled).


#### Get all users

**GET api/v2/admin/users**

**Response:**
- 200 OK
- 403 Forbidden



#### Get all drivers

**GET api/v2/admin/users**

**Response:**
- 200 OK
- 403 Forbidden


#### Delete user

**Delete api/v2/admin/users/{userId}**

**Response:**
- 204 No content
- 403 Forbidden / 404 Not Found


#### Register as a driver

**POST api/v2/drivers/register**

**Response:**
 - 200 OK
 - 401 Unauthorized

#### Driver set unavailable status

 Drivers can set unavailable status

**GET api/v2/drivers/become_unavailable**
 
**Response:**
 - 200 OK
 - 401 Unauthorized

#### Driver set available status

**GET api/v2/drivers/become_available**

**Response:**
 - 200 OK
 - 401 Unauthorized




**Response:**

-   200 OK
-   204 No Content
-   400 Bad Request
-   404 Not Found

## Error Responses

Standard error responses include:

-   400 Bad Request: The request could not be understood or was missing required parameters.
-   401 Unauthorized: Authentication failed or user does not have permissions for the desired action.
-   404 Not Found: The requested resource could not be found.
-   500 Internal Server Error: An error occurred on the server.

## Security Considerations

-   Ensure all sensitive data like passwords are sent HTTPS.
-   Use strong password hashing using bcryptjs for storing user passwords.
-   Implement authentication and authorization mechanisms using jason web token to protect endpoints.
-   Validate and sanitize all inputs to prevent SQL injection and other attacks.
# ub-475-telegram-bot
