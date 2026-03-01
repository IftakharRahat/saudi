# Backend Functional Requirements & Implementation Plan

## Project Overview

**"Future Companies" / Used Furniture Saudi** is a bilingual (EN/AR) Next.js frontend for a used furniture and appliance buying business operating in the Eastern Province of Saudi Arabia (Dammam, Khobar, Qatif, Jubail, Dhahran, Saihat, Al Ahsa).

The frontend currently has **zero backend integration** — all content is hardcoded in the i18n dictionary and the contact form has no submission logic. This document catalogs every backend requirement implied by the frontend and proposes an implementation plan.

---

## Current Frontend Pages

| Page | Route | Component |
|---|---|---|
| Landing / Home | `/` | `LandingPage.tsx` |
| Services | `/services` | `ServicesPage.tsx` |
| About Us | `/about` | `AboutPage.tsx` |
| Product Details | `/product-details` | `ProductDetails.tsx` |
| Contact Us | `/contact` | `ContactPage.tsx` |

---

## Functional Requirements for Backend

### FR-1: Contact Form Submission

**Priority: HIGH**

The Contact page has a form with these fields but **no submit handler**:

| Field | Type | Required |
|---|---|---|
| Full Name | text | Yes |
| Phone Number | text | Yes |
| Email | email | Yes |
| Location | text | Yes |
| Message | textarea | Yes |

**Backend needs:**
- `POST /api/contact` — Accept and validate form data
- Store submissions in a database (e.g., PostgreSQL / MongoDB)
- Send email notification to admin (e.g., `info@usedfurnituresaudi.com`)
- Optional: Send confirmation email/SMS to the customer
- Optional: Rate limiting / CAPTCHA to prevent spam

---

### FR-2: Newsletter / Email Subscription

**Priority: HIGH**

The Footer and CTA sections have an **email subscription input** with a "Subscribe" button, plus an "I agree" checkbox. Currently non-functional.

**Backend needs:**
- `POST /api/subscribe` — Accept email, validate, and store
- Store subscriber emails in a database
- Handle duplicate email prevention
- Optional: Double opt-in confirmation email
- Optional: Integration with email marketing platform (e.g., Mailchimp, SendGrid)

---

### FR-3: Services Management (CMS)

**Priority: MEDIUM**

The frontend has 9 hardcoded service cards (Washing Machine, Furniture Moving, Dining Rooms, Kitchens, Air Coolers, Scraps, Scrap, Refrigerators, Window AC). Each card has:
- Title (EN + AR)
- Image
- Description (EN + AR)
- "View More" button (currently does nothing)

**Backend needs:**
- `GET /api/services` — Return all services with i18n content
- `GET /api/services/:id` — Return a single service detail
- Admin CRUD endpoints for services:
  - `POST /api/admin/services` — Create
  - `PUT /api/admin/services/:id` — Update
  - `DELETE /api/admin/services/:id` — Delete
- Image upload and storage (e.g., S3, Cloudinary, or local storage)
- Database schema: `services` table with `id`, `title_en`, `title_ar`, `description_en`, `description_ar`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`

---

### FR-4: Testimonials / Reviews Management

**Priority: MEDIUM**

The Landing page has a testimonial carousel with hardcoded data (same review duplicated 3 times). Each testimonial has:
- Review text
- Customer name
- Customer role/title
- Rating (hardcoded 5 stars)
- Customer photo

**Backend needs:**
- `GET /api/testimonials` — Return approved testimonials
- Admin endpoints:
  - `POST /api/admin/testimonials` — Create
  - `PUT /api/admin/testimonials/:id` — Update
  - `DELETE /api/admin/testimonials/:id` — Delete
- Database schema: `testimonials` table with `id`, `text_en`, `text_ar`, `name_en`, `name_ar`, `role_en`, `role_ar`, `rating`, `photo_url`, `is_approved`, `created_at`

---

### FR-5: FAQ Management

**Priority: MEDIUM**

The Landing page has 8 hardcoded FAQ items, each with a question and answer in EN + AR.

**Backend needs:**
- `GET /api/faqs` — Return all active FAQs
- Admin CRUD endpoints:
  - `POST /api/admin/faqs`
  - `PUT /api/admin/faqs/:id`
  - `DELETE /api/admin/faqs/:id`
- Database schema: `faqs` table with `id`, `question_en`, `question_ar`, `answer_en`, `answer_ar`, `sort_order`, `is_active`, `created_at`

---

### FR-6: Service Areas / Locations Management

**Priority: LOW-MEDIUM**

The Services page shows 6 service delivery area cards (Al-Khobar, Dammam, Jubail, Dhahran & Saihat, Al Ahsa, Qatif). Each has:
- City name (EN + AR)
- Title (EN + AR)
- Description (EN + AR)

**Backend needs:**
- `GET /api/areas` — Return all service areas
- Admin CRUD for managing areas
- Database schema: `service_areas` table with `id`, `city_en`, `city_ar`, `title_en`, `title_ar`, `description_en`, `description_ar`, `sort_order`, `is_active`

---

### FR-7: Product / Item Catalog

**Priority: MEDIUM-HIGH**

The Product Details page shows a single product with:
- Image carousel (4 images)
- Thumbnails
- Headline, description, features list
- "Contact us" / phone CTA

Currently this is a single hardcoded page. To make it dynamic:

**Backend needs:**
- `GET /api/products` — Return all products/items
- `GET /api/products/:id` — Return single product detail
- Admin CRUD for products:
  - Create, update, delete products
  - Upload multiple images per product
- Database schema: `products` table with `id`, `title_en`, `title_ar`, `description_en`, `description_ar`, `features_en`, `features_ar`, `images` (array/relation), `is_active`, `created_at`
- Separate `product_images` table: `id`, `product_id`, `image_url`, `sort_order`

---

### FR-8: Search Functionality

**Priority: MEDIUM**

The Header has a search input ("Search for any service") that is currently non-functional.

**Backend needs:**
- `GET /api/search?q=<query>&lang=en|ar` — Full-text search across services, products, and FAQs
- Return categorized results (services, products, FAQs)
- Support bilingual search (query in EN or AR)

---

### FR-9: Admin Panel / Authentication

**Priority: HIGH**

All CMS features above require an admin interface.

**Backend needs:**
- Admin authentication (login/logout, JWT or session-based)
- Role-based access (e.g., admin, editor)
- Admin dashboard with:
  - Contact form submissions list
  - Newsletter subscribers list
  - Services CRUD
  - Testimonials CRUD
  - FAQs CRUD
  - Products CRUD
  - Service Areas CRUD
- Database schema: `admins` table with `id`, `email`, `password_hash`, `role`, `created_at`

---

### FR-10: SEO & Static Content Management

**Priority: LOW**

Some content that may need backend management:
- Page meta titles and descriptions (currently hardcoded in `layout.tsx`)
- "Why Choose Us" cards content
- About page content (features, process steps)
- Footer links and contact info (phone, email, address)

**Backend needs:**
- `GET /api/content/:page` — Return page-specific CMS content
- Admin interface for editing static content blocks

---

### FR-11: Analytics & Tracking

**Priority: LOW**

Not currently implemented but valuable:
- Track page views
- Track contact form submission rates
- Track search queries
- Track newsletter subscription rates

---

## Summary of All API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit contact form |
| `POST` | `/api/subscribe` | Subscribe to newsletter |
| `GET` | `/api/services` | List all services |
| `GET` | `/api/services/:id` | Get service details |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get product details |
| `GET` | `/api/testimonials` | Get approved testimonials |
| `GET` | `/api/faqs` | Get all FAQs |
| `GET` | `/api/areas` | Get service areas |
| `GET` | `/api/search` | Search across content |
| `GET` | `/api/content/:page` | Get CMS content for a page |

### Admin Endpoints (Authenticated)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Admin login |
| `POST` | `/api/admin/logout` | Admin logout |
| `GET` | `/api/admin/contacts` | List contact submissions |
| `GET` | `/api/admin/subscribers` | List newsletter subscribers |
| CRUD | `/api/admin/services` | Manage services |
| CRUD | `/api/admin/products` | Manage products |
| CRUD | `/api/admin/testimonials` | Manage testimonials |
| CRUD | `/api/admin/faqs` | Manage FAQs |
| CRUD | `/api/admin/areas` | Manage service areas |
| CRUD | `/api/admin/content` | Manage CMS content |

---

## Proposed Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **API Framework** | Next.js API Routes (`/app/api/`) | Already using Next.js; avoids separate server |
| **Database** | PostgreSQL | Relational data, i18n support, robust |
| **ORM** | Prisma | Type-safe, great with Next.js/TypeScript |
| **Auth** | NextAuth.js or JWT | Session management for admin panel |
| **File Storage** | Cloudinary or S3 | Image uploads for products/services |
| **Email** | SendGrid or Resend | Contact form notifications, newsletter |
| **Validation** | Zod | Schema validation, works with TypeScript |
| **Admin UI** | Custom Next.js pages under `/admin` | Keeps everything in one codebase |

---

## Database Schema (Prisma-style)

```prisma
model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String
  location  String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Subscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}

model Service {
  id            String   @id @default(cuid())
  titleEn       String
  titleAr       String
  descriptionEn String
  descriptionAr String
  imageUrl      String
  sortOrder     Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Product {
  id            String         @id @default(cuid())
  titleEn       String
  titleAr       String
  descriptionEn String
  descriptionAr String
  featuresEn    String[]
  featuresAr    String[]
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  images        ProductImage[]
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  imageUrl  String
  sortOrder Int     @default(0)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Testimonial {
  id         String   @id @default(cuid())
  textEn     String
  textAr     String
  nameEn     String
  nameAr     String
  roleEn     String
  roleAr     String
  rating     Int      @default(5)
  photoUrl   String?
  isApproved Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model FAQ {
  id         String   @id @default(cuid())
  questionEn String
  questionAr String
  answerEn   String
  answerAr   String
  sortOrder  Int      @default(0)
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
}

model ServiceArea {
  id            String  @id @default(cuid())
  cityEn        String
  cityAr        String
  titleEn       String
  titleAr       String
  descriptionEn String
  descriptionAr String
  sortOrder     Int     @default(0)
  isActive      Boolean @default(true)
}

model PageContent {
  id        String   @id @default(cuid())
  pageKey   String   @unique
  contentEn Json
  contentAr Json
  updatedAt DateTime @updatedAt
}
```

---

## Implementation Phases

### Phase 1 — Foundation (Week 1)
- [ ] Set up PostgreSQL database
- [ ] Install and configure Prisma ORM
- [ ] Create database schema and run migrations
- [ ] Set up admin authentication (NextAuth.js)
- [ ] Implement `POST /api/contact` with email notification
- [ ] Implement `POST /api/subscribe`

### Phase 2 — Content APIs (Week 2)
- [ ] Implement Services CRUD (admin + public GET)
- [ ] Implement Products CRUD (admin + public GET) with image upload
- [ ] Implement Testimonials CRUD (admin + public GET)
- [ ] Implement FAQ CRUD (admin + public GET)
- [ ] Implement Service Areas CRUD (admin + public GET)

### Phase 3 — Frontend Integration (Week 3)
- [ ] Replace hardcoded services with API data
- [ ] Replace hardcoded testimonials with API data
- [ ] Replace hardcoded FAQs with API data
- [ ] Replace hardcoded service areas with API data
- [ ] Wire up contact form submission
- [ ] Wire up newsletter subscription
- [ ] Make Product Details page dynamic (route: `/product-details/[id]`)

### Phase 4 — Admin Panel (Week 3-4)
- [ ] Build admin login page
- [ ] Build admin dashboard layout
- [ ] Build CRUD pages for each content type
- [ ] Build contact submissions viewer
- [ ] Build newsletter subscribers list

### Phase 5 — Search & Polish (Week 4)
- [ ] Implement search API with bilingual support
- [ ] Wire up Header search bar
- [ ] Add pagination to list endpoints
- [ ] Add input validation (Zod) across all endpoints
- [ ] Add rate limiting to public endpoints
- [ ] Testing and bug fixes

---

## Verification Plan

### Automated Tests
- API endpoint tests using `vitest` or `jest` with `supertest`
- Database integration tests with a test database
- Run: `pnpm test` (after test setup)

### Manual Verification
1. **Contact Form**: Fill and submit the contact form → verify row appears in DB and email is sent
2. **Newsletter**: Subscribe with email → verify stored in DB, try duplicate → verify error handled
3. **Admin Panel**: Login → create/edit/delete a service → verify changes appear on public pages
4. **Search**: Type a query in the header search → verify results are returned
5. **Product Details**: Navigate to a dynamic product page → verify images and content load from API
