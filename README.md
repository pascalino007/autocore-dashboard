# AutoCore Dashboard

A comprehensive React/Next.js admin dashboard for managing an auto parts e-commerce platform.

## Features

### 🔐 Authentication
- Beautiful login page with modern UI
- Session management with localStorage

### 📦 Car Parts Management
- Complete CRUD operations for auto parts
- Support for categories and subcategories
- Part details including:
  - Name, SKU, Part Number
  - Images (main + gallery)
  - Price, availability, rating
  - Brand, country of origin, vendor code
  - Color, material type
  - Custom specifications
  - Compatible cars
  - Shop assignments

### 🏪 Shop & Supplier Management
- Register and manage shops/suppliers
- Shop owner information
- Location and contact details
- Shop images

### 🚗 Car Registration
- Register cars with:
  - Year, Make, Model
  - Engine specifications
  - Fuel type (Gasoline, Diesel, Electric, Hybrid, Plug-in Hybrid)
  - Motorisation (Automatic, Manual, CVT)
- Link parts to compatible cars

### 🛒 Second Hand Marketplace
- Manage used vehicle listings
- Support for cars, motorcycles, buses, trucks
- Vehicle details, pricing, condition
- Location-based listings

### 📋 Order Management
- View and manage all orders
- Order status tracking
- Order details and items

### 💳 Payment Tracking
- Payment transaction management
- Payment status monitoring
- Revenue analytics

### 🎁 Promotions Management
- Create special offers
- Parts and service bundles
- Discount management
- Promotion scheduling

### 🔧 Mechanics Shop Registration
- Register mechanics shops
- Shop information and location
- Service management

### 📊 Analytics Dashboard
- Top performing suppliers
- Top mechanics
- Best selling parts
- Revenue overview
- Performance metrics

### 👥 User Management
- View all platform users
- User roles (admin, customer, shop_owner, mechanic)
- Garage management (user's cars)
- Address management

### 💬 Real-Time Chat
- Chat interface for customer support
- Communication with shop owners
- Message history

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [https://api.aakodessewa.com/:3000](https://api.aakodessewa.com/:3000) in your browser

4. Login with any email and password (demo mode)

## Project Structure

```
autocore-dashboard/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── parts/         # Car parts management
│   │   ├── cars/          # Car registration
│   │   ├── shops/         # Shop management
│   │   ├── marketplace/   # Second hand market
│   │   ├── orders/        # Order management
│   │   ├── payments/      # Payment tracking
│   │   ├── promotions/    # Promotions
│   │   ├── mechanics/     # Mechanics shops
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── users/         # User management
│   │   └── chat/          # Real-time chat
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/
│   ├── DashboardLayout.tsx    # Main dashboard layout
│   ├── parts/                 # Part-related components
│   └── cars/                  # Car-related components
├── lib/
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── package.json
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Charts (ready for implementation)

## Features Overview

### Dashboard Pages

1. **Dashboard** (`/dashboard`) - Overview with stats and recent activity
2. **Car Parts** (`/dashboard/parts`) - Manage auto parts inventory
3. **Cars** (`/dashboard/cars`) - Register and manage cars
4. **Shops & Suppliers** (`/dashboard/shops`) - Manage suppliers
5. **Second Hand Market** (`/dashboard/marketplace`) - Used vehicle listings
6. **Orders** (`/dashboard/orders`) - Order management
7. **Payments** (`/dashboard/payments`) - Payment tracking
8. **Promotions** (`/dashboard/promotions`) - Special offers
9. **Mechanics** (`/dashboard/mechanics`) - Mechanics shop management
10. **Analytics** (`/dashboard/analytics`) - Performance insights
11. **Users** (`/dashboard/users`) - User management
12. **Chat** (`/dashboard/chat`) - Real-time messaging

## Next Steps

To connect this dashboard to a backend:

1. Replace localStorage authentication with proper JWT/auth system
2. Connect all CRUD operations to your API endpoints
3. Implement real-time chat with WebSockets (Socket.io)
4. Add data visualization charts using Recharts
5. Implement image upload functionality
6. Add pagination and filtering
7. Connect to your database

## Customization

- Colors can be customized in `tailwind.config.js`
- Add more routes in `components/DashboardLayout.tsx`
- Extend types in `lib/types.ts`

## License

This project is created for AutoCore auto parts platform.


