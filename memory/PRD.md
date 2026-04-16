# HimPrash - EV Two-Wheeler Parts Platform

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (port 3000)
- **Backend**: FastAPI + MongoDB (port 8001)
- **Design**: Dark premium theme (#0E1117 bg, #0A84FF primary, #00FF9D accent)

## What's Been Implemented
### Main Website
- [x] 12 EV parts products (Battery, Motor, Controller, Charger, BMS, Wiring)
- [x] Homepage: Hero, Search bar (with autocomplete + recent searches), Category quick access, Featured products
- [x] Product listing with sidebar filters + search + category dropdown
- [x] Product detail with INR pricing, offer price strikethrough, compatibility
- [x] Contact number +91 8707259761 in navbar + footer

### Admin CMS (Phase 1.3)
- [x] Hidden admin panel at /admin-panel-himprash (not linked on website)
- [x] Admin login (admin/admin123) with session in localStorage
- [x] Full product CRUD (add/edit/delete) with all fields including offer_price + video_url
- [x] Product table with instant search and category filter
- [x] Category management (add/delete custom categories)
- [x] CSV bulk upload (parses in browser, posts to backend)
- [x] Live website sync (all admin changes immediately reflected on main site)
- [x] Offer price display: ₹offer_price + ~~₹original_price~~ on cards + detail page

## Admin Credentials
- URL: /admin-panel-himprash
- Username: admin
- Password: admin123

## Prioritized Backlog
### P0
- Cart system + Razorpay checkout
- User authentication

### P1
- Product sorting, pagination
- Order management in admin
- Admin analytics dashboard

### P2
- User reviews/ratings
- Inventory tracking
- WhatsApp order integration
