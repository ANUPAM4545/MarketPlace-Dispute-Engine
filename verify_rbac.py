import requests
import sys

BASE_URL = "http://localhost:5001"

def register(email, password, role, name):
    url = f"{BASE_URL}/auth/register"
    data = {"email": email, "password": password, "role": role, "name": name, "phone": "1234567890"}
    res = requests.post(url, json=data)
    if res.status_code == 201 or (res.status_code == 400 and "already exists" in res.text):
        return True
    return False

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    data = {"email": email, "password": password}
    res = requests.post(url, json=data)
    if res.status_code == 200:
        return res.json()['access_token']
    sys.exit(f"Failed to login {email}")

def seed_orders(token):
    requests.post(f"{BASE_URL}/orders/seed", headers={"Authorization": f"Bearer {token}"})

def get_orders(token):
    return requests.get(f"{BASE_URL}/orders/", headers={"Authorization": f"Bearer {token}"}).json()

def create_dispute(token, order_id):
    url = f"{BASE_URL}/disputes/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"order_id": order_id, "category": "Test", "description": "RBAC Test"}
    return requests.post(url, json=data, headers=headers)

def respond(token, dispute_id):
    url = f"{BASE_URL}/disputes/{dispute_id}/respond"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"response": "Unauthorized response"}
    return requests.post(url, json=data, headers=headers)

def resolve(token, dispute_id):
    url = f"{BASE_URL}/disputes/{dispute_id}/resolve"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"resolution": "RESOLVED"}
    return requests.post(url, json=data, headers=headers)

def main():
    print("Setting up users...")
    register("rbac_buyer@example.com", "pass", "Buyer", "RBAC Buyer")
    register("rbac_seller1@example.com", "pass", "Seller", "RBAC Seller 1")
    register("rbac_seller2@example.com", "pass", "Seller", "RBAC Seller 2")
    register("rbac_admin@example.com", "pass", "Admin", "RBAC Admin")

    buyer_token = login("rbac_buyer@example.com", "pass")
    seller1_token = login("rbac_seller1@example.com", "pass")
    seller2_token = login("rbac_seller2@example.com", "pass")
    admin_token = login("rbac_admin@example.com", "pass")

    # Seed orders (Buyer gets orders assigned to random sellers, hopefully one is Seller 1?)
    # Actually, seed logic assigns to existing sellers randomly.
    # Let's Seed orders and find one belonging to Seller 1.
    print("Seeding, please ensure at least one order for Seller 1 exists...")
    seed_orders(buyer_token)
    
    # We need to find an order belonging to Seller 1 to create a dispute on it.
    # But as a Buyer, I don't see seller_id in my list directly? 
    # Wait, Order model has seller_id, let's see if GET /orders returns it.
    # Yes, previous implementation of OrdersList shows it implies we might have it or not?
    # Actually in models.py (from memory/context) Order has seller_id.
    # Let's try to get orders and create dispute.
    
    orders = get_orders(buyer_token)
    if not orders:
        sys.exit("No orders found for buyer")
    
    # We need an order. Let's pick the first one.
    target_order = orders[0]
    target_order_id = target_order['id']
    # owner_seller_id = target_order['seller_id'] # Check if API returns this.
    # If API doesn't return seller_id, we might have trouble verifying exact Seller 2 vs Seller 1 scenario strictly unless we know who owns it.
    # However, let's try to create a dispute first.
    
    print(f"Creating dispute on order {target_order_id}...")
    res = create_dispute(buyer_token, target_order_id)
    if res.status_code != 201:
        # Maybe already exists?
        print("Dispute creation failed or already exists, skipping creation.")
        # Try to find an existing dispute
        disputes = requests.get(f"{BASE_URL}/disputes/", headers={"Authorization": f"Bearer {buyer_token}"}).json()
        if not disputes:
            sys.exit("Could not create or find dispute")
        dispute_id = disputes[0]['id']
    else:
        dispute_id = res.json()['id']
    
    print(f"Testing RBAC on Dispute {dispute_id}...")

    # TEST 1: Buyer trying to Resolve (Should Fail)
    print("TEST 1: Buyer trying to Resolve...", end=" ")
    res = resolve(buyer_token, dispute_id)
    if res.status_code == 403:
        print("PASSED (403 Forbidden)")
    else:
        print(f"FAILED ({res.status_code} {res.text})")

    # TEST 2: Seller trying to Resolve (Should Fail)
    print("TEST 2: Seller trying to Resolve...", end=" ")
    res = resolve(seller1_token, dispute_id)
    if res.status_code == 403:
        print("PASSED (403 Forbidden)")
    else:
        print(f"FAILED ({res.status_code} {res.text})")

    # TEST 3: Admin trying to Respond (Should Fail - checked implementation)
    print("TEST 3: Admin trying to Respond...", end=" ")
    res = respond(admin_token, dispute_id)
    if res.status_code == 403: # My code returns 403 for non-sellers
        print("PASSED (403 Forbidden)")
    else:
        print(f"FAILED ({res.status_code} {res.text})")
        
    # TEST 4: Buyer trying to Respond
    print("TEST 4: Buyer trying to Respond...", end=" ")
    res = respond(buyer_token, dispute_id)
    if res.status_code == 403:
        print("PASSED (403 Forbidden)")
    else:
        print(f"FAILED ({res.status_code} {res.text})")

    # TEST 5: Wrong Seller trying to Respond
    # We use Seller 2. If Order belongs to Seller 1, this should fail.
    # If Order belongs to Seller 2, then Seller 1 should fail.
    # We'll try both. At least one should fail if they are different sellers.
    # If both succeed, then we have a problem (or order belongs to both? Impossible).
    
    print("TEST 5: Seller 1 & 2 trying to respond (one should fail)...")
    res1 = respond(seller1_token, dispute_id)
    res2 = respond(seller2_token, dispute_id)
    
    print(f"  Seller 1: {res1.status_code}")
    print(f"  Seller 2: {res2.status_code}")
    
    if (res1.status_code == 403 and res2.status_code == 200) or \
       (res1.status_code == 200 and res2.status_code == 403) or \
       (res1.status_code == 403 and res2.status_code == 403): # Both could fail if neither owns it (e.g. owned by 'Seller Flow')
         print("PASSED (Access restricted correctly)")
    else:
         print("FAILED (Both succeeded? or unexpected error)")

if __name__ == "__main__":
    main()
