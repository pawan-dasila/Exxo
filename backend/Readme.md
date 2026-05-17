# EXXO: Hyperlocal P2P Item-Sharing Marketplace (Backend)

EXXO is a premium peer-to-peer (P2P) rental marketplace designed for hyperlocal communities in Bengaluru. This repository contains the robust Node.js backend powering the platform's discovery, booking, escrow, and trust systems.

## 🚀 Key Features

### 🛒 P2P Catalog & Discovery
- **Hyperlocal Search**: Location-aware queries using bounding-box filtering (Latitude/Longitude).
- **Product Management**: Multi-image uploads via Cloudinary, soft-deletes, and deep categorization.
- **Smart Slugs**: SEO-friendly URL generation for every listing.

### 📅 Rental & Escrow System
- **Atomic Bookings**: Prevents double-booking via Prisma `$transaction` and rigorous availability checks.
- **Escrow Flow**: Automated collection of Rental Fee + Platform Fee + Security Deposit.
- **Order Lifecycle**: Seamless transitions from `PENDING` → `CONFIRMED` → `ACTIVE` → `COMPLETED`.
- **Automated Payouts/Refunds**: Integrated logic to refund security deposits and initiate lender payouts upon safe return.

### 💳 Secure Payments (Razorpay)
- **Unified Checkout**: Single-click payment for complex multi-fee rental orders.
- **Signature Verification**: Secure webhook handling with HMAC/SHA256 verification.
- **Refund Management**: Programmable refund triggers for security deposits.

### 🛡️ Trust & Safety
- **Verified Gating**: Middleware to restrict high-value actions (listing/borrowing) to KYC-verified users.
- **JWT Authentication**: Secure session management with role-based access control (RBAC).
- **Comprehensive Logging**: Production-grade observability using Pino and Pino-pretty.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Payment Gateway**: [Razorpay](https://razorpay.com/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Logging**: [Pino](https://getpino.io/)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- A Neon PostgreSQL instance
- Razorpay API Keys (Key ID & Secret)
- Cloudinary Account (Cloud Name, API Key & Secret)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   DATABASE_URL="your-neon-postgres-url"
   DIRECT_URL="your-direct-db-url"

   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="1d"

   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="your-secret"
   RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

   CLOUDINARY_CLOUD_NAME="your-name"
   CLOUDINARY_API_KEY="your-key"
   CLOUDINARY_API_SECRET="your-secret"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```
src/
├── @types/         # Express & JWT type augmentations
├── configs/        # App configurations (Cloudinary, Razorpay, Env)
├── controllers/    # Request handlers (Product, Rental, Category)
├── enums/          # Shared constants and error codes
├── lib/            # Shared libraries (Prisma client)
├── middleware/     # Auth, error handling, and file parsing
├── routes/         # Express router definitions
├── services/       # Core business logic (Escrow, Product indexing)
├── utils/          # Utility functions (ApiResponse, Slugs, Logger)
└── validation/     # Zod schemas for request validation
```

---

## 📜 API Conventions

- **Success**: All successful responses follow the `ApiResponse` structure.
- **Errors**: Centralized error handling returns consistent `ErrorCodeEnum` codes.
- **Auth**: Protected routes require a `Bearer <token>` in the Authorization header.

## 🤝 Contributing

1. Create a feature branch.
2. Ensure `npx tsc --noEmit` passes with zero errors.
3. Submit a Pull Request for review.

---
© 2026 EXXO Marketplace. Built for the future of peer-to-peer sharing.
