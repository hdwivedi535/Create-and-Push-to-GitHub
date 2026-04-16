# HimPrash - EV Two-Wheeler Parts Platform

## Problem Statement
Build a modern, responsive EV two-wheeler parts marketplace for the Indian market.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (port 3000)
- **Backend**: FastAPI + MongoDB (port 8001)
- **Design**: Dark premium theme (#0E1117 bg, #0A84FF primary, #00FF9D accent)

## What's Been Implemented (April 2026)
### Phase 1 - MVP
- [x] 12 EV parts products (Battery, Motor, Controller, Charger, BMS, Wiring)
- [x] Homepage: Hero, Search bar, Category quick access, Featured products
- [x] Product listing with sidebar filters + search by name + category dropdown
- [x] Product detail with INR pricing, compatibility, Add to Cart toast

### Phase 1.1 - Refinements
- [x] INR currency with ₹ symbol
- [x] Changed to "EV Two-Wheeler Parts" branding
- [x] Improved UI contrast, lighter backgrounds

### Phase 1.2 - Current (Search + UX)
- [x] Search functionality (backend regex search + frontend input)
- [x] Category dropdown in search bar
- [x] Category quick access buttons on homepage (BMS, Battery, Charger, Controller, Motor, Wiring)
- [x] Contact number +91 8707259761 in navbar + footer
- [x] Active page highlighting in navbar
- [x] New bright hero image (electric scooter)
- [x] Products changed to actual EV parts (batteries, motors, controllers, chargers, BMS, wiring)
- [x] Footer with customer support contact info
- [x] Price range up to ₹25,000

## Prioritized Backlog
### P0 - Phase 2
- Cart system with state management
- User authentication
- Razorpay checkout

### P1
- Sort by price/name/popularity
- Product reviews/ratings
- Wishlist, Recently viewed

### P2
- Admin dashboard for product CRUD
- Order management
- Inventory tracking
