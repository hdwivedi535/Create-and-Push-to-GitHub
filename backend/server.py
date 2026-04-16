from fastapi import FastAPI, APIRouter, Query, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    category: str
    description: str
    compatibility: str
    image: str
    in_stock: bool = True
    featured: bool = False

class ProductResponse(BaseModel):
    id: str
    name: str
    price: float
    category: str
    description: str
    compatibility: str
    image: str
    in_stock: bool
    featured: bool

SEED_PRODUCTS = [
    {
        "id": "prod-001",
        "name": "Smart Home EV Charger",
        "price": 4999.00,
        "category": "Charging",
        "description": "Intelligent wall-mounted charging station for your electric two-wheeler. Wi-Fi enabled with app-based scheduling and monitoring. Compatible with Ola S1, Ather 450X, TVS iQube and more. Auto cut-off and surge protection built in.",
        "compatibility": "Ola S1 / Ather 450X / TVS iQube / Bajaj Chetak",
        "image": "https://static.prod-images.emergentagent.com/jobs/62773f05-d118-4c48-9ad3-b551fc41c456/images/eff8afc652fce44eaf6315f05bd27ef720c5ed50a7b47b63f3f8abd897d6e592.png",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-002",
        "name": "Portable Charging Cable",
        "price": 1299.00,
        "category": "Charging",
        "description": "Compact 3-meter portable charging cable with Indian 3-pin plug. Carry it anywhere for emergency charging. LED indicator shows charging status. Durable PVC jacket with IP54 splash resistance.",
        "compatibility": "Universal 2W EV (Standard Indian Socket)",
        "image": "https://images.unsplash.com/photo-1732347211970-530dd1a81e58?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxFViUyMHR3byUyMHdoZWVsZXIlMjBjaGFyZ2VyJTIwcG9ydGFibGUlMjBjaGFyZ2luZ3xlbnwwfHx8fDE3NzYzNDkxOTV8MA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-003",
        "name": "Smart Riding Helmet",
        "price": 3499.00,
        "category": "Safety",
        "description": "ISI certified full-face helmet with integrated Bluetooth for calls and music. Built-in LED tail indicators for night visibility. Anti-fog visor with UV protection. Lightweight at just 1.2 kg.",
        "compatibility": "Universal Fit (M / L / XL)",
        "image": "https://images.unsplash.com/photo-1684920312489-039c3bee531b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHw0fHxlbGVjdHJpYyUyMHNjb290ZXIlMjBhY2Nlc3NvcmllcyUyMGhlbG1ldCUyMG1vdW50fGVufDB8fHx8MTc3NjM0OTE5NXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-004",
        "name": "Reflective Riding Jacket",
        "price": 899.00,
        "category": "Safety",
        "description": "High-visibility reflective riding jacket for safe night commutes. 3M Scotchlite reflective strips on front, back and arms. Breathable mesh lining for Indian summers. CE-certified shoulder and elbow armor pockets.",
        "compatibility": "Unisex (S / M / L / XL / XXL)",
        "image": "https://images.unsplash.com/photo-1720211463641-772900a07771?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxyZWZsZWN0aXZlJTIwc2FmZXR5JTIwdmVzdCUyMGphY2tldCUyMHJpZGluZyUyMG5lb258ZW58MHx8fHwxNzc2MzQ5MjgwfDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-005",
        "name": "LED Helmet Light Kit",
        "price": 699.00,
        "category": "Safety",
        "description": "Rechargeable USB LED light strip that attaches to any helmet. 3 modes: solid, blink, and flow. 500mAh battery lasts up to 8 hours. Weatherproof IP65 rating for monsoon riding.",
        "compatibility": "Universal (All Helmets)",
        "image": "https://images.unsplash.com/photo-1515850730971-68bc28d981d6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxlbGVjdHJpYyUyMGNhciUyMGV4dGVyaW9yJTIwYWNjZXNzb3JpZXMlMjBMRUR8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-006",
        "name": "Phone Mount Pro",
        "price": 599.00,
        "category": "Mounts",
        "description": "CNC aluminum alloy handlebar phone mount with anti-vibration dampener. 360-degree rotation with secure clamp lock. Fits phones 4.7 to 7.2 inches. Designed to withstand Indian road vibrations.",
        "compatibility": "Universal Handlebar (22mm-32mm)",
        "image": "https://images.unsplash.com/photo-1583409461426-20d5d4f7a66e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwxfHxzY29vdGVyJTIwcGhvbmUlMjBtb3VudCUyMEdQUyUyMHRyYWNrZXIlMjBnYWRnZXR8ZW58MHx8fHwxNzc2MzQ5MTk1fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-007",
        "name": "Handlebar Mirror Set",
        "price": 449.00,
        "category": "Mounts",
        "description": "Premium anti-vibration convex bar-end mirrors. CNC machined aluminum body with 360-degree adjustable ball joint. Wide-angle view reduces blind spots. Sleek minimal design.",
        "compatibility": "Universal 2W EV (7/8 inch bars)",
        "image": "https://images.unsplash.com/photo-1752403854633-ef9bfea057fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwzfHxzY29vdGVyJTIwcGhvbmUlMjBtb3VudCUyMEdQUyUyMHRyYWNrZXIlMjBnYWRnZXR8ZW58MHx8fHwxNzc2MzQ5MTk1fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-008",
        "name": "Waterproof Phone Pouch",
        "price": 349.00,
        "category": "Mounts",
        "description": "IPX8 rated waterproof phone pouch with handlebar mount. Touchscreen compatible transparent window. Secure zip-lock closure. Internal card and key pocket. Essential for monsoon rides.",
        "compatibility": "Universal (Up to 7 inch phones)",
        "image": "https://images.unsplash.com/photo-1681771960707-c14a9df34f6f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxiaWtlJTIwc2VhdCUyMHN0b3JhZ2UlMjBiYWclMjBvcmdhbml6ZXJ8ZW58MHx8fHwxNzc2MzQ5MjgwfDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-009",
        "name": "Rear Top Box 30L",
        "price": 2499.00,
        "category": "Storage",
        "description": "Hard-shell 30L top box with universal mounting plate. Matte black finish with reflective strips. Holds 2 helmets or groceries securely. Quick-release lock mechanism with 2 keys included.",
        "compatibility": "Universal 2W (Mounting plate included)",
        "image": "https://images.unsplash.com/photo-1751924382514-13926ee09a03?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwzfHxtb3RvcmN5Y2xlJTIwdG9wJTIwY2FzZSUyMHN0b3JhZ2UlMjBib3glMjB0YWlsfGVufDB8fHx8MTc3NjM0OTE5NXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-010",
        "name": "Under-Seat Storage Tray",
        "price": 799.00,
        "category": "Storage",
        "description": "Custom-fit under-seat organizer tray with compartments. Anti-rattle felt lining keeps items secure. Stores charger cable, toolkit, and essentials. Easy snap-fit installation.",
        "compatibility": "Ola S1 Pro / Ather 450X",
        "image": "https://images.unsplash.com/photo-1681771960756-820f62ea1ccc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxiaWtlJTIwc2VhdCUyMHN0b3JhZ2UlMjBiYWclMjBvcmdhbml6ZXJ8ZW58MHx8fHwxNzc2MzQ5MjgwfDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-011",
        "name": "GPS Tracker",
        "price": 1999.00,
        "category": "Tech Accessories",
        "description": "Real-time GPS tracking device with companion mobile app. Geo-fencing alerts, trip history, and anti-theft alarm. SIM-based with 1 year free data plan. Compact design hides easily under seat.",
        "compatibility": "Universal 2W EV (12V/48V/72V)",
        "image": "https://images.unsplash.com/photo-1597661172655-534e51b87937?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHw0fHxzY29vdGVyJTIwcGhvbmUlMjBtb3VudCUyMEdQUyUyMHRyYWNrZXIlMjBnYWRnZXR8ZW58MHx8fHwxNzc2MzQ5MTk1fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-012",
        "name": "USB Charging Hub",
        "price": 599.00,
        "category": "Tech Accessories",
        "description": "Dual USB-A + USB-C fast charging hub for your scooter. QC 3.0 supported for rapid phone charging on the go. Waterproof cap protects ports from rain. Easy handlebar clamp installation.",
        "compatibility": "Universal 2W (12V-72V Input)",
        "image": "https://images.unsplash.com/photo-1581104678033-ce6e95d27f67?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwzfHxVU0IlMjBjaGFyZ2VyJTIwcG9ydGFibGUlMjBwb3dlciUyMGJhbmslMjBkZXZpY2UlMjBwcm9kdWN0fGVufDB8fHx8MTc3NjM0OTIyMHww&ixlib=rb-4.1.0&q=85",
        "in_stock": False,
        "featured": False
    }
]

# Seed products on startup
@app.on_event("startup")
async def seed_products():
    # Check if data needs refresh by looking for a known 2W EV product
    existing = await db.products.find_one({"id": "prod-001"}, {"_id": 0, "category": 1})
    needs_reseed = existing is None or existing.get("category") != "Charging" or (await db.products.find_one({"id": "prod-001"}, {"_id": 0, "price": 1})).get("price") != 4999.00
    if needs_reseed:
        await db.products.drop()
        await db.products.insert_many(SEED_PRODUCTS)
        logger.info(f"Reseeded {len(SEED_PRODUCTS)} products (2W EV)")
    else:
        count = await db.products.count_documents({})
        logger.info(f"Products collection has {count} items (up to date)")

# Routes
@api_router.get("/")
async def root():
    return {"message": "HimPrash API"}

@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    featured: Optional[bool] = Query(None)
):
    query = {}
    if category:
        query["category"] = category
    if min_price is not None or max_price is not None:
        price_filter = {}
        if min_price is not None:
            price_filter["$gte"] = min_price
        if max_price is not None:
            price_filter["$lte"] = max_price
        query["price"] = price_filter
    if featured is not None:
        query["featured"] = featured

    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return categories

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
