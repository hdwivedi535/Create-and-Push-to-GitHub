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
        "name": "48V 30Ah Lithium Battery Pack",
        "price": 18999.00,
        "category": "Battery",
        "description": "High-capacity 48V 30Ah lithium-ion battery pack for electric scooters. Samsung/LG cells with 1500+ charge cycles. Includes smart BMS for overcharge protection. Lightweight design at 8.5 kg with carrying handle.",
        "compatibility": "Universal 48V 2W EV / E-Rickshaw",
        "image": "https://images.unsplash.com/photo-1732030373864-d37573915751?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBiYXR0ZXJ5JTIwbGl0aGl1bSUyMGlvbiUyMHBhY2t8ZW58MHx8fHwxNzc2MzUwNTkzfDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-002",
        "name": "60V 20Ah LFP Battery",
        "price": 24999.00,
        "category": "Battery",
        "description": "Premium 60V 20Ah LiFePO4 battery with 3000+ cycle life. Superior thermal stability for Indian summers. IP67 waterproof casing. Built-in Bluetooth for battery health monitoring via app.",
        "compatibility": "60V E-Scooters / Ola S1 / Ather 450X",
        "image": "https://images.unsplash.com/photo-1767990495521-95cceb571125?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBiYXR0ZXJ5JTIwbGl0aGl1bSUyMGlvbiUyMHBhY2t8ZW58MHx8fHwxNzc2MzUwNTkzfDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-003",
        "name": "1000W BLDC Hub Motor",
        "price": 6499.00,
        "category": "Motor",
        "description": "High-torque 1000W brushless DC hub motor for electric scooters. 48V/60V compatible with hall sensor. Peak efficiency 92%. Silent operation with sealed bearings. Direct drive, no gears to maintain.",
        "compatibility": "48V-60V Systems / 10-inch Wheel",
        "image": "https://images.unsplash.com/photo-1556977735-25a8c50734f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMG1vdG9yJTIwQkxEQyUyMGh1YiUyMHdoZWVsJTIwbW90b3J8ZW58MHx8fHwxNzc2MzUwNTkzfDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-004",
        "name": "350W Geared Hub Motor",
        "price": 3999.00,
        "category": "Motor",
        "description": "Compact 350W geared hub motor ideal for city commute e-scooters. High torque at low speed for hill climbing. Integrated planetary gear reduction. Lightweight at just 3.2 kg.",
        "compatibility": "36V-48V Systems / 8-inch Wheel",
        "image": "https://images.unsplash.com/photo-1697091058503-7046e420dd98?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBFViUyMGJyaWdodCUyMGNsZWFuJTIwcHJvZHVjdHxlbnwwfHx8fDE3NzYzNTA2MDV8MA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-005",
        "name": "48V 30A Sine Wave Controller",
        "price": 2499.00,
        "category": "Controller",
        "description": "Programmable 48V 30A sine wave motor controller. Smooth, silent operation with regenerative braking support. LCD display compatible. Over-current, over-voltage, and thermal protection built in.",
        "compatibility": "48V BLDC Motors (Up to 1000W)",
        "image": "https://images.unsplash.com/photo-1769148023257-02df7ec903be?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjb250cm9sbGVyJTIwUENCJTIwY2lyY3VpdCUyMGJvYXJkfGVufDB8fHx8MTc3NjM1MDU5M3ww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-006",
        "name": "60V 45A FOC Controller",
        "price": 4999.00,
        "category": "Controller",
        "description": "Advanced Field Oriented Control (FOC) controller for 60V systems. Ultra-smooth acceleration and braking. Bluetooth programmable via mobile app. Supports regenerative braking and cruise control.",
        "compatibility": "60V BLDC/PMSM Motors (Up to 2000W)",
        "image": "https://images.unsplash.com/photo-1558171813-8e717211582b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjb250cm9sbGVyJTIwUENCJTIwY2lyY3VpdCUyMGJvYXJkfGVufDB8fHx8MTc3NjM1MDU5M3ww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-007",
        "name": "48V 5A Smart Charger",
        "price": 1999.00,
        "category": "Charger",
        "description": "Intelligent 48V 5A lithium battery charger with auto cut-off. CC-CV charging curve for maximum battery life. LED status indicator and cooling fan. Indian 3-pin plug with 1.5m cable.",
        "compatibility": "48V Li-ion / LiFePO4 Batteries",
        "image": "https://images.unsplash.com/photo-1751592981628-957a88e13849?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxFViUyMGNoYXJnZXIlMjBhZGFwdGVyJTIwcGx1ZyUyMGRldmljZSUyMHByb2R1Y3R8ZW58MHx8fHwxNzc2MzUwNjA1fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-008",
        "name": "60V 3A Portable Charger",
        "price": 2499.00,
        "category": "Charger",
        "description": "Compact 60V 3A portable charger for on-the-go charging. Universal AC input (100-240V). Lightweight aluminum body with active cooling. Short circuit and reverse polarity protection.",
        "compatibility": "60V Li-ion / LiFePO4 Batteries",
        "image": "https://images.unsplash.com/photo-1751592773554-81440afeb00a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxFViUyMGNoYXJnZXIlMjBhZGFwdGVyJTIwcGx1ZyUyMGRldmljZSUyMHByb2R1Y3R8ZW58MHx8fHwxNzc2MzUwNjA1fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-009",
        "name": "16S 48V Smart BMS",
        "price": 1499.00,
        "category": "BMS",
        "description": "16-cell series smart Battery Management System for 48V packs. Balancing current 68mA per cell. Over-charge, over-discharge, short circuit, and temperature protection. UART communication port for diagnostics.",
        "compatibility": "48V Li-ion Battery (16S Config)",
        "image": "https://images.unsplash.com/photo-1687858477272-0c5f4a401250?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjb250cm9sbGVyJTIwUENCJTIwY2lyY3VpdCUyMGJvYXJkfGVufDB8fHx8MTc3NjM1MDU5M3ww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-010",
        "name": "20S 60V BMS with Bluetooth",
        "price": 2999.00,
        "category": "BMS",
        "description": "Advanced 20S BMS for 60V battery packs with Bluetooth monitoring. Real-time cell voltage tracking via mobile app. 100A continuous discharge current. Temperature sensors included.",
        "compatibility": "60V Li-ion Battery (20S Config)",
        "image": "https://images.unsplash.com/photo-1600080726065-cc806a0ef302?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHx3aXJpbmclMjBoYXJuZXNzJTIwZWxlY3RyaWNhbCUyMGNhYmxlJTIwY29ubmVjdG9yfGVufDB8fHx8MTc3NjM1MDYwNXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-011",
        "name": "Complete Wiring Harness Kit",
        "price": 899.00,
        "category": "Wiring",
        "description": "Plug-and-play wiring harness kit for 2W EV builds. Color-coded wires with pre-crimped connectors. Includes throttle, brake, and display cables. Flame-retardant PVC insulation.",
        "compatibility": "Universal 48V/60V EV Builds",
        "image": "https://images.unsplash.com/photo-1584809923235-fabdba83d1df?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHx3aXJpbmclMjBoYXJuZXNzJTIwZWxlY3RyaWNhbCUyMGNhYmxlJTIwY29ubmVjdG9yfGVufDB8fHx8MTc3NjM1MDYwNXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-012",
        "name": "Anderson Connector Set (10 pairs)",
        "price": 499.00,
        "category": "Wiring",
        "description": "10-pair Anderson PowerPole PP45 connector set. 45A rated for high-current EV applications. Color-coded red and black housing. Gold-plated contacts for low resistance. Easy tool-free assembly.",
        "compatibility": "Universal EV / Solar / Battery Systems",
        "image": "https://images.unsplash.com/photo-1594165520975-89edce5a8f64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxFViUyMGNoYXJnZXIlMjBhZGFwdGVyJTIwcGx1ZyUyMGRldmljZSUyMHByb2R1Y3R8ZW58MHx8fHwxNzc2MzUwNjA1fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": False,
        "featured": False
    }
]

# Seed products on startup
@app.on_event("startup")
async def seed_products():
    # Check if data needs refresh by looking for a known 2W EV product
    existing = await db.products.find_one({"id": "prod-001"}, {"_id": 0, "category": 1, "name": 1})
    needs_reseed = existing is None or existing.get("category") != "Battery" or existing.get("name") != "48V 30Ah Lithium Battery Pack"
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
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None)
):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
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
