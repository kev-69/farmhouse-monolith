# 🧑‍🌾 Farmhouse Monolith

Farmhouse is a full-featured e-commerce platform for agricultural products, built as a modular monolith using Node.js, Express, TypeScript, and PostgreSQL.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-v18+-green.svg)
![Express](https://img.shields.io/badge/express-v5.1.0-black.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-v15-blue.svg)
![Prisma](https://img.shields.io/badge/prisma-v6.6.0-blueviolet.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Docker Setup](#-docker-setup)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Management**: Registration, authentication, profile management
- **Shop Management**: Shop registration, verification, product management
- **Product Management**: Add, update, delete products with image uploads
- **Category Management**: Product categorization
- **Order Processing**: Cart management, checkout flow
- **Payment Processing**: Multiple payment methods
- **Redis Caching**: For cart management and improved performance
- **Role-Based Access Control**: Different capabilities for users, shops, and admins
- **File Uploads**: Image upload for products with Cloudinary integration
- **API Documentation**: Swagger/OpenAPI documentation

## 🏗️ Architecture

The application is structured as a modular monolith with clear separation of concerns:

```
farmhouse-monolith/
├── apps/               # Application entry points
│   └── api/            # API server
├── config/             # Configuration files
├── docker/             # Docker setup
├── middlewares/        # Express middlewares
├── modules/            # Business modules
│   ├── auth/           # Authentication
│   ├── categories/     # Categories
│   ├── orders/         # Orders & Cart
│   ├── payments/       # Payments
│   ├── products/       # Products
│   ├── shops/          # Shops
│   └── users/          # Users
├── prisma/             # Database schema and migrations
├── shared/             # Shared utilities
├── tests/              # Test utilities
├── uploads/            # Temporary upload directory
└── utils/              # Utility functions
```

Each module follows a consistent structure:

- `*.controller.ts` - HTTP request handlers
- `*.service.ts` - Business logic
- `*.module.ts` - Route definitions
- `*.schema.ts` - Input validation schemas

## 🔧 Prerequisites

- Node.js v18+
- PostgreSQL 15+
- Redis 7+
- Cloudinary account

## 💾 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kev-69/farmhouse-monolith.git
   cd farmhouse-monolith
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment files:
   ```bash
   cp .env.example .env
   ```

## ⚙️ Configuration

Set up your environment variables in the `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_URL=postgresql://postgres:password@localhost:5432/farmhouse_db

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🗄️ Database Setup

1. Run Prisma migrations to set up your database schema:

   ```bash
   npm run migrate
   ```

2. Seed the database with initial data:
   ```bash
   npx prisma db seed
   ```

## 🚀 Usage

### Development Mode

Start the server in development mode with hot reload:

```bash
npm run dev
```

### Production Mode

Build and start the server in production mode:

```bash
npm run build
npm start
```

## 📚 API Documentation

Access the API documentation at:

```
http://localhost:3000/api-docs
```

### API Endpoints Overview

| Module     | Endpoint                              | Description         |
| ---------- | ------------------------------------- | ------------------- |
| Auth       | POST /api/v1/auth/login               | User login          |
|            | POST /api/v1/auth/signup              | User registration   |
| Shop Auth  | POST /api/v1/auth/shops/login         | Shop login          |
|            | POST /api/v1/auth/shops/signup        | Shop registration   |
| Users      | GET /api/v1/users/profile             | Get user profile    |
|            | PUT /api/v1/users/update-profile      | Update user profile |
| Products   | POST /api/v1/products/add-product     | Add new product     |
|            | GET /api/v1/products/all-products     | List all products   |
| Categories | GET /api/v1/categories/all-categories | List all categories |
| Cart       | POST /api/v1/cart/add                 | Add item to cart    |
|            | POST /api/v1/cart/checkout            | Checkout process    |
| Orders     | GET /api/v1/orders                    | List user orders    |
| Payments   | POST /api/v1/payments                 | Process payment     |

## 🐳 Docker Setup

Run the application using Docker:

```bash
# Start containers
docker-compose -f docker/docker-compose.yml up -d

# Stop containers
docker-compose -f docker/docker-compose.yml down
```

### Docker Environment Variables

Create a `docker/.env` file with the necessary environment variables:

```env
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🌍 Deployment

This project is configured for easy deployment to Render using the `render.yaml` blueprint file.

### Deploying to Render

1. Fork/clone this repository to your GitHub account
2. Connect your GitHub account to Render
3. Create a new Blueprint Instance and select this repository
4. Render will automatically detect the `render.yaml` file and set up the services
5. Add your environment variables in the Render dashboard

## 🧪 Testing

Run tests:

```bash
npm test
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

Developed by [Bismark Obuobi](https://github.com/kev-69)
