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
        "name": "Wall Charger Pro",
        "price": 450.00,
        "category": "Charging",
        "description": "Smart home charging station with glowing LED indicator ring. Wi-Fi enabled for remote scheduling and monitoring. Delivers up to 48A for the fastest home charging experience.",
        "compatibility": "Universal EV (Tesla, BMW, Mercedes, Hyundai)",
        "image": "https://static.prod-images.emergentagent.com/jobs/62773f05-d118-4c48-9ad3-b551fc41c456/images/eff8afc652fce44eaf6315f05bd27ef720c5ed50a7b47b63f3f8abd897d6e592.png",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-002",
        "name": "Carbon Fiber Trunk Spoiler",
        "price": 299.00,
        "category": "Exterior",
        "description": "Matte finish real carbon fiber spoiler. Enhances aerodynamics and provides a premium aggressive look. Easy bolt-on installation with no drilling required.",
        "compatibility": "Tesla Model 3 / Model Y",
        "image": "https://static.prod-images.emergentagent.com/jobs/62773f05-d118-4c48-9ad3-b551fc41c456/images/61db0a1838014a416e1e040e298b653358c46639aaa3fbf782b46da7fd8991f1.png",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-003",
        "name": "Center Console Organizer",
        "price": 35.00,
        "category": "Interior",
        "description": "Minimalist matte black flocked tray to organize your essentials. Seamlessly integrates with the factory console. Anti-slip surface keeps items secure during driving.",
        "compatibility": "Tesla Model 3 / Model Y",
        "image": "https://static.prod-images.emergentagent.com/jobs/62773f05-d118-4c48-9ad3-b551fc41c456/images/b9db011face2810059e3eccebed576341bf38c5b2c6ec0daad743ff92dac38cc.png",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-004",
        "name": "Portable EV Charger",
        "price": 349.00,
        "category": "Charging",
        "description": "Compact Level 2 portable charging solution. NEMA 14-50 plug with 25ft cable. Perfect for road trips and visiting locations without dedicated EV charging.",
        "compatibility": "Universal EV (J1772 Connector)",
        "image": "https://images.unsplash.com/photo-1672542128827-ccbb7b8b8099?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHxFViUyMGNoYXJnZXIlMjBlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMHN0YXRpb258ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-005",
        "name": "Type 2 Charging Cable",
        "price": 89.00,
        "category": "Cables",
        "description": "Premium 5-meter Type 2 to Type 2 charging cable. 32A rated with IP67 waterproof connectors. Durable outer jacket resists UV and abrasion.",
        "compatibility": "All Type 2 EVs",
        "image": "https://images.unsplash.com/photo-1692052626528-cb97a934a63b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwzfHxFViUyMGNoYXJnZXIlMjBlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMHN0YXRpb258ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-006",
        "name": "All-Weather Floor Mats",
        "price": 129.00,
        "category": "Interior",
        "description": "Custom-fit laser-measured floor mats with raised edges. TPE material that's eco-friendly and easy to clean. Protects your cabin from mud, snow, and spills.",
        "compatibility": "Tesla Model 3 (2020-2025)",
        "image": "https://images.unsplash.com/photo-1715122476474-c14d2fab50a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxjYXIlMjBhY2Nlc3NvcmllcyUyMGludGVyaW9yJTIwbWF0cyUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-007",
        "name": "Magnetic Phone Mount",
        "price": 49.00,
        "category": "Mounts",
        "description": "Ultra-strong N52 neodymium magnetic mount with 360-degree rotation. Attaches to any vent or dashboard surface. Sleek minimal design matches your EV interior.",
        "compatibility": "Universal (All Vehicles)",
        "image": "https://images.unsplash.com/photo-1640705049944-de916f415bb4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwzfHxjYXIlMjBhY2Nlc3NvcmllcyUyMGludGVyaW9yJTIwbWF0cyUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-008",
        "name": "Dash Cam Pro 4K",
        "price": 199.00,
        "category": "Tech",
        "description": "4K UHD front and rear dash camera with night vision. Built-in GPS, G-sensor, and parking mode. Loop recording with 128GB micro SD support.",
        "compatibility": "Universal (All Vehicles)",
        "image": "https://images.unsplash.com/photo-1614527255138-018e29ff34ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxjYXIlMjBhY2Nlc3NvcmllcyUyMGludGVyaW9yJTIwbWF0cyUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": True
    },
    {
        "id": "prod-009",
        "name": "LED Light Bar Kit",
        "price": 159.00,
        "category": "Exterior",
        "description": "Ambient underglow LED light strip kit with app control. 16 million color options with music sync mode. IP68 waterproof rating for all-weather use.",
        "compatibility": "Universal EV",
        "image": "https://images.unsplash.com/photo-1515850730971-68bc28d981d6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxlbGVjdHJpYyUyMGNhciUyMGV4dGVyaW9yJTIwYWNjZXNzb3JpZXMlMjBMRUR8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-010",
        "name": "Wireless Charging Pad",
        "price": 59.00,
        "category": "Tech",
        "description": "Dual 15W wireless charging pad designed for EV center consoles. Anti-slip silicone surface with LED charging indicator. Qi-compatible for all modern smartphones.",
        "compatibility": "Tesla Model 3 / Model Y / Model S",
        "image": "https://images.unsplash.com/photo-1687455564554-4bdbb8f15437?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxjYXIlMjBhY2Nlc3NvcmllcyUyMGludGVyaW9yJTIwbWF0cyUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    },
    {
        "id": "prod-011",
        "name": "Roof Rack System",
        "price": 289.00,
        "category": "Exterior",
        "description": "Aerodynamic aluminum roof rack with crossbars. Low wind noise design optimized for EV range preservation. Supports up to 165 lbs of cargo.",
        "compatibility": "Tesla Model Y / Model X",
        "image": "https://images.unsplash.com/photo-1621696306273-542abbd50d55?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGV4dGVyaW9yJTIwYWNjZXNzb3JpZXMlMjBMRUR8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": False,
        "featured": False
    },
    {
        "id": "prod-012",
        "name": "Cable Management Kit",
        "price": 29.00,
        "category": "Cables",
        "description": "Wall-mounted cable organizer for your home charging setup. Includes cable hook, holder bracket, and cord wrap. Keeps your garage tidy and cable protected.",
        "compatibility": "Universal (All EV Chargers)",
        "image": "https://images.unsplash.com/photo-1694027667715-ea39a23e1cee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxlbGVjdHJpYyUyMGNhciUyMGV4dGVyaW9yJTIwYWNjZXNzb3JpZXMlMjBMRUR8ZW58MHx8fHwxNzc2MzQ4MTU5fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True,
        "featured": False
    }
]

# Seed products on startup
@app.on_event("startup")
async def seed_products():
    count = await db.products.count_documents({})
    if count == 0:
        await db.products.insert_many(SEED_PRODUCTS)
        logger.info(f"Seeded {len(SEED_PRODUCTS)} products")
    else:
        logger.info(f"Products collection already has {count} items")

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
