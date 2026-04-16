import requests
import sys
from datetime import datetime

class HimPrashAPITester:
    def __init__(self, base_url="https://himprash-ev.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, params=None, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response: Dict with keys: {list(response_data.keys())}")
                    return True, response_data
                except:
                    print(f"   Response: Non-JSON response")
                    return True, response.text
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "url": url,
                    "response": response.text[:200] if response.text else "No response"
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "url": url
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_all_products(self):
        """Test getting all products"""
        success, response = self.run_test("Get All Products", "GET", "products", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            if len(response) == 12:
                print("✅ Correct number of products (12)")
            else:
                print(f"⚠️  Expected 12 products, got {len(response)}")
        return success, response

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test("Get Categories", "GET", "categories", 200)
        if success and isinstance(response, list):
            print(f"   Found categories: {response}")
            expected_categories = ["Battery", "BMS", "Charger", "Controller", "Motor", "Wiring"]
            if len(response) == 6:
                print("✅ Correct number of categories (6)")
                # Check if all expected categories are present
                missing = [cat for cat in expected_categories if cat not in response]
                if not missing:
                    print("✅ All expected EV parts categories present")
                else:
                    print(f"⚠️  Missing categories: {missing}")
            else:
                print(f"⚠️  Expected 6 categories, got {len(response)}")
        return success, response

    def test_filter_by_category(self):
        """Test filtering products by category"""
        success, response = self.run_test(
            "Filter by Category (Battery)", 
            "GET", 
            "products", 
            200, 
            params={"category": "Battery"}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} battery products")
            # Verify all products are in Battery category
            battery_products = [p for p in response if p.get('category') == 'Battery']
            if len(battery_products) == len(response):
                print("✅ All products are in Battery category")
                if len(response) == 2:
                    print("✅ Correct number of Battery products (2)")
                else:
                    print(f"⚠️  Expected 2 Battery products, got {len(response)}")
            else:
                print(f"⚠️  Some products not in Battery category")
        return success, response

    def test_filter_by_price_range(self):
        """Test filtering products by price range"""
        success, response = self.run_test(
            "Filter by Price Range (1000-3000 INR)", 
            "GET", 
            "products", 
            200, 
            params={"min_price": 1000, "max_price": 3000}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products in price range ₹1000-₹3000")
            # Verify all products are in price range
            in_range = [p for p in response if 1000 <= p.get('price', 0) <= 3000]
            if len(in_range) == len(response):
                print("✅ All products are in specified INR price range")
            else:
                print(f"⚠️  Some products outside price range")
        return success, response

    def test_get_featured_products(self):
        """Test getting featured products"""
        success, response = self.run_test(
            "Get Featured Products", 
            "GET", 
            "products", 
            200, 
            params={"featured": True}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} featured products")
            # Verify all products are featured
            featured = [p for p in response if p.get('featured') == True]
            if len(featured) == len(response):
                print("✅ All products are featured")
            else:
                print(f"⚠️  Some products not featured")
        return success, response

    def test_get_single_product(self):
        """Test getting a single product"""
        success, response = self.run_test("Get Single Product (prod-001)", "GET", "products/prod-001", 200)
        if success and isinstance(response, dict):
            print(f"   Product: {response.get('name', 'Unknown')}")
            print(f"   Price: ₹{response.get('price', 0)}")
            print(f"   Category: {response.get('category', 'Unknown')}")
            
            # Check specific product details for prod-001
            if response.get('name') == '48V 30Ah Lithium Battery Pack' and response.get('price') == 18999:
                print("✅ prod-001 has correct name and INR price (₹18999)")
            else:
                print(f"⚠️  prod-001 details incorrect - Name: {response.get('name')}, Price: {response.get('price')}")
            
            required_fields = ['id', 'name', 'price', 'category', 'description', 'compatibility', 'image', 'in_stock']
            missing_fields = [field for field in required_fields if field not in response]
            if not missing_fields:
                print("✅ All required fields present")
            else:
                print(f"⚠️  Missing fields: {missing_fields}")
        return success, response

    def test_get_nonexistent_product(self):
        """Test getting a non-existent product"""
    def test_motor_category(self):
        """Test filtering products by Motor category"""
        success, response = self.run_test(
            "Filter by Category (Motor)", 
            "GET", 
            "products", 
            200, 
            params={"category": "Motor"}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} motor products")
            if len(response) == 2:
                print("✅ Correct number of Motor products (2)")
            else:
                print(f"⚠️  Expected 2 Motor products, got {len(response)}")
        return success, response

    def test_search_functionality(self):
        """Test search functionality"""
        success, response = self.run_test(
            "Search for 'battery'", 
            "GET", 
            "products", 
            200, 
            params={"search": "battery"}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products matching 'battery'")
            if len(response) == 2:
                print("✅ Correct number of battery search results (2)")
            else:
                print(f"⚠️  Expected 2 battery search results, got {len(response)}")
            
            # Verify all results contain 'battery' in name
            battery_matches = [p for p in response if 'battery' in p.get('name', '').lower()]
            if len(battery_matches) == len(response):
                print("✅ All search results contain 'battery' in name")
            else:
                print(f"⚠️  Some search results don't contain 'battery' in name")
        return success, response

    def test_price_range_max(self):
        """Test that max price is within ₹25,000 range"""
        success, response = self.run_test("Get All Products for Price Check", "GET", "products", 200)
        if success and isinstance(response, list):
            max_price = max([p.get('price', 0) for p in response])
            print(f"   Maximum product price: ₹{max_price}")
            if max_price <= 25000:
                print("✅ All products are within ₹25,000 price range")
            else:
                print(f"⚠️  Some products exceed ₹25,000 price range")
        return success, response

    def test_2w_ev_products(self):
        """Test that all products are EV parts"""
        success, response = self.run_test("Get All Products for EV Parts Check", "GET", "products", 200)
        if success and isinstance(response, list):
            # Check product names and descriptions for EV parts content
            car_related_terms = ['car', 'automobile', 'vehicle', 'sedan', 'suv']
            ev_parts_terms = ['battery', 'motor', 'controller', 'charger', 'bms', 'wiring', 'bldc', 'lithium', 'ev', '48v', '60v']
            
            car_products = []
            ev_parts_count = 0
            
            for product in response:
                name_lower = product.get('name', '').lower()
                desc_lower = product.get('description', '').lower()
                compat_lower = product.get('compatibility', '').lower()
                
                # Check for car-related terms
                if any(term in name_lower or term in desc_lower or term in compat_lower for term in car_related_terms):
                    car_products.append(product.get('name'))
                
                # Check for EV parts terms
                if any(term in name_lower or term in desc_lower or term in compat_lower for term in ev_parts_terms):
                    ev_parts_count += 1
            
            if not car_products:
                print("✅ No car-related products found - all are EV parts")
            else:
                print(f"⚠️  Found car-related products: {car_products}")
            
            if ev_parts_count == len(response):
                print("✅ All products are EV parts")
            else:
                print(f"⚠️  Only {ev_parts_count}/{len(response)} products are clearly EV parts")
        return success, response

    def test_get_nonexistent_product(self):
        """Test getting a non-existent product"""
        return self.run_test("Get Non-existent Product", "GET", "products/nonexistent", 404)

    def test_admin_create_product(self):
        """Test admin product creation"""
        test_product = {
            "name": f"Test Admin Product {datetime.now().strftime('%H%M%S')}",
            "price": 999.99,
            "offer_price": 799.99,
            "category": "Battery",
            "description": "Test product for admin testing",
            "compatibility": "Test compatibility",
            "image": "https://example.com/test.jpg",
            "video_url": "https://example.com/test.mp4",
            "in_stock": True,
            "featured": False
        }
        
        success, response = self.run_test(
            "Admin Create Product", 
            "POST", 
            "admin/products", 
            200, 
            data=test_product
        )
        
        if success and isinstance(response, dict):
            product_id = response.get('id')
            print(f"   Created product ID: {product_id}")
            
            # Store for cleanup
            if not hasattr(self, 'created_products'):
                self.created_products = []
            self.created_products.append(product_id)
            
            # Verify product was created with correct data
            if response.get('name') == test_product['name']:
                print("✅ Product created with correct name")
            if response.get('price') == test_product['price']:
                print("✅ Product created with correct price")
            if response.get('offer_price') == test_product['offer_price']:
                print("✅ Product created with correct offer price")
                
        return success, response

    def test_admin_update_product(self):
        """Test admin product update"""
        # First create a product to update
        success, created = self.test_admin_create_product()
        if not success:
            return False, {}
            
        product_id = created.get('id')
        update_data = {
            "name": f"Updated Admin Product {datetime.now().strftime('%H%M%S')}",
            "price": 1199.99,
            "offer_price": None  # Remove offer price
        }
        
        success, response = self.run_test(
            "Admin Update Product",
            "PUT",
            f"admin/products/{product_id}",
            200,
            data=update_data
        )
        
        if success and isinstance(response, dict):
            if response.get('name') == update_data['name']:
                print("✅ Product name updated correctly")
            if response.get('price') == update_data['price']:
                print("✅ Product price updated correctly")
            if response.get('offer_price') is None:
                print("✅ Offer price removed correctly")
                
        return success, response

    def test_admin_delete_product(self):
        """Test admin product deletion"""
        # First create a product to delete
        success, created = self.test_admin_create_product()
        if not success:
            return False, {}
            
        product_id = created.get('id')
        
        success, response = self.run_test(
            "Admin Delete Product",
            "DELETE",
            f"admin/products/{product_id}",
            200
        )
        
        if success:
            print(f"✅ Product {product_id} deleted successfully")
            # Remove from cleanup list
            if hasattr(self, 'created_products') and product_id in self.created_products:
                self.created_products.remove(product_id)
                
        return success, response

    def test_admin_bulk_create(self):
        """Test admin bulk product creation"""
        bulk_products = [
            {
                "name": f"Bulk Product 1 {datetime.now().strftime('%H%M%S')}",
                "price": 500.00,
                "category": "Motor",
                "description": "Bulk test product 1"
            },
            {
                "name": f"Bulk Product 2 {datetime.now().strftime('%H%M%S')}",
                "price": 750.00,
                "offer_price": 650.00,
                "category": "Controller",
                "description": "Bulk test product 2"
            }
        ]
        
        success, response = self.run_test(
            "Admin Bulk Create Products",
            "POST",
            "admin/products/bulk",
            200,
            data=bulk_products
        )
        
        if success and isinstance(response, dict):
            count = response.get('count', 0)
            print(f"   Bulk created: {count} products")
            if count == len(bulk_products):
                print("✅ Correct number of products created")
            else:
                print(f"⚠️  Expected {len(bulk_products)} products, created {count}")
                
        return success, response

    def test_admin_create_category(self):
        """Test admin category creation"""
        test_category = f"TestCategory{datetime.now().strftime('%H%M%S')}"
        
        success, response = self.run_test(
            "Admin Create Category",
            "POST",
            "admin/categories",
            200,
            data={"name": test_category}
        )
        
        if success:
            print(f"   Created category: {test_category}")
            # Store for cleanup
            if not hasattr(self, 'created_categories'):
                self.created_categories = []
            self.created_categories.append(test_category)
            
        return success, response

    def test_admin_delete_category(self):
        """Test admin category deletion"""
        # First create a category to delete
        success, created = self.test_admin_create_category()
        if not success:
            return False, {}
            
        # Extract category name from the response message
        test_category = None
        if hasattr(self, 'created_categories') and self.created_categories:
            test_category = self.created_categories[-1]
        
        if not test_category:
            return False, {}
            
        success, response = self.run_test(
            "Admin Delete Category",
            "DELETE",
            f"admin/categories/{test_category}",
            200
        )
        
        if success:
            print(f"✅ Category {test_category} deleted successfully")
            # Remove from cleanup list
            if test_category in self.created_categories:
                self.created_categories.remove(test_category)
                
        return success, response

    def cleanup_test_data(self):
        """Clean up any test data created during testing"""
        print("\n🧹 Cleaning up test data...")
        
        # Clean up products
        if hasattr(self, 'created_products'):
            for product_id in self.created_products[:]:
                try:
                    success, _ = self.run_test(
                        f"Cleanup Product {product_id}",
                        "DELETE",
                        f"admin/products/{product_id}",
                        200
                    )
                    if success:
                        self.created_products.remove(product_id)
                        print(f"   Cleaned up product: {product_id}")
                except:
                    pass
        
        # Clean up categories
        if hasattr(self, 'created_categories'):
            for category in self.created_categories[:]:
                try:
                    success, _ = self.run_test(
                        f"Cleanup Category {category}",
                        "DELETE",
                        f"admin/categories/{category}",
                        200
                    )
                    if success:
                        self.created_categories.remove(category)
                        print(f"   Cleaned up category: {category}")
                except:
                    pass

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting HimPrash API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Initialize cleanup lists
        self.created_products = []
        self.created_categories = []

        try:
            # Test basic endpoints
            print("\n=== Basic API Tests ===")
            self.test_root_endpoint()
            self.test_get_all_products()
            self.test_get_categories()
            self.test_filter_by_category()
            self.test_motor_category()
            self.test_filter_by_price_range()
            self.test_get_featured_products()
            self.test_get_single_product()
            self.test_search_functionality()
            self.test_price_range_max()
            self.test_2w_ev_products()
            self.test_get_nonexistent_product()
            
            # Test admin endpoints
            print("\n=== Admin API Tests ===")
            self.test_admin_create_product()
            self.test_admin_update_product()
            self.test_admin_delete_product()
            self.test_admin_bulk_create()
            self.test_admin_create_category()
            self.test_admin_delete_category()
            
        except Exception as e:
            print(f"\n💥 Test execution error: {str(e)}")
        finally:
            # Always cleanup
            self.cleanup_test_data()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"   • {failure.get('test', 'Unknown')}")
                if 'error' in failure:
                    print(f"     Error: {failure['error']}")
                else:
                    print(f"     Expected: {failure.get('expected')}, Got: {failure.get('actual')}")
                    print(f"     URL: {failure.get('url')}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = HimPrashAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())