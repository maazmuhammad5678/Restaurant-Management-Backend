# Restaurant Management Backend API

A RESTful backend API for a restaurant management system built with **Node.js, Express.js, and MongoDB**. The API supports user authentication, menu management, food image uploads, and customer order processing.

## Features

- **User Authentication:** Customer registration and login.
- **JWT Authorization:** Secure routes using JSON Web Tokens.
- **Role-Based Access Control:** Separate permissions for Admin and Customer roles.
- **Menu Management:** Create, view, update, and delete menu items.
- **Food Image Uploads:** Upload and manage food images using middleware.
- **Menu Filtering:** Search menu items and filter by category, if supported by the implemented routes.
- **Order Management:** Place orders, view order history, and manage order statuses.
- **MongoDB Integration:** Store users, menu items, and orders in MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt / bcryptjs
- Multer for image uploads
- dotenv for environment variables

## Project Structure

```text
Restaurant-Management-Backend/
├── controllers/
│   ├── menu.js
│   ├── order.js
│   └── user.js
├── middlewares/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── menu.js
│   ├── order.js
│   └── user.js
├── routes/
│   ├── menu.js
│   ├── order.js
│   └── user.js
├── service/
│   └── auth.js
├── uploads/
├── connection.js
├── index.js
├── package.json
├── package-lock.json
└── .gitignore
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/maazmuhammad5678/Restaurant-Management-Backend.git
```

### 2. Navigate to the project directory

```bash
cd Restaurant-Management-Backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=1d
```

Use the exact variable names expected by your application. Never commit your `.env` file or expose database credentials.

### 5. Start the server

If your `package.json` includes a `start` script:

```bash
npm start
```

For development, if a `dev` script is configured:

```bash
npm run dev
```

Otherwise, start the application with:

```bash
node index.js
```

The API should run at:

`http://localhost:8000`

## API Endpoints

The following paths assume your application mounts the user, menu, and order routers at `/api/user`, `/api/menu`, and `/api/order`. Confirm the exact route paths in `index.js` and the route files.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/user/signup` | Register a user |
| POST | `/api/user/login` | Log in |
| GET | `/api/menu` | View menu items |
| POST | `/api/menu` | Create a menu item (Admin) |
| PUT | `/api/menu/:id` | Update a menu item (Admin) |
| DELETE | `/api/menu/:id` | Delete a menu item (Admin) |
| POST | `/api/order` | Place an order |
| GET | `/api/order/my-orders` | View customer order history |
| GET | `/api/order` | View all orders (Admin) |
| PUT | `/api/order/:id/status` | Update order status (Admin) |

**Note:** These endpoint paths and HTTP methods should be checked against the actual implementation before use.

## Authentication

For protected endpoints, include the JWT returned by the login endpoint in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Admin-only operations require a user with the Admin role. Public registration should not allow users to grant themselves Admin privileges.

## Testing

You can test the API using **Postman**:

1. Register a customer.
2. Log in and copy the JWT.
3. View available menu items.
4. Log in as an Admin to create menu items.
5. Place an order using a valid menu item ID.
6. View the customer's order history.
7. Update the order status using an Admin token.

## Security

- Keep `.env` out of version control.
- Use a strong JWT secret.
- Validate incoming request data.
- Restrict administrative endpoints by role.
- Never expose database passwords or authentication secrets.

## Author

**Muhammad Maaz Bin Aamir**

GitHub: [@maazmuhammad5678](https://github.com/maazmuhammad5678)

## License

This project is intended for educational and learning purposes. Add a license if you wish to specify reuse permissions.
