import requests
import sys

BASE_URL = "http://localhost:5001"

def register(email, password, role, name):
    url = f"{BASE_URL}/auth/register"
    data = {"email": email, "password": password, "role": role, "name": name, "phone": "1234567890"}
    res = requests.post(url, json=data)
    if res.status_code == 201:
        print(f"Registered {role}: {email}")
    elif res.status_code == 400 and "User already exists" in res.text:
         print(f"User {email} already exists")
    else:
        print(f"Failed to register {role}: {res.text}")
        sys.exit(1)

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    data = {"email": email, "password": password}
    res = requests.post(url, json=data)
    if res.status_code == 200:
        return res.json()['access_token']
    else:
        print(f"Failed to login {email}: {res.text}")
        sys.exit(1)

def seed_orders(token):
    url = f"{BASE_URL}/orders/seed"
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(url, headers=headers)
    if res.status_code == 201:
        print(f"Seeded orders: {res.json()['count']}")
    else:
        print(f"Failed to seed orders: {res.text}")

def get_orders(token):
    url = f"{BASE_URL}/orders/"
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        return res.json()
    else:
        print(f"Failed to get orders: {res.text}")
        sys.exit(1)

def create_dispute(token, order_id):
    url = f"{BASE_URL}/disputes/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"order_id": order_id, "category": "Item Not Received", "description": "I did not receive my item."}
    res = requests.post(url, json=data, headers=headers)
    if res.status_code == 201:
        print(f"Created dispute: {res.json()['id']}")
        return res.json()['id']
    else:
        print(f"Failed to create dispute: {res.text}")
        sys.exit(1)

def seller_respond(token, dispute_id):
    url = f"{BASE_URL}/disputes/{dispute_id}/respond"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"response": "I shipped it via FedEx."}
    res = requests.post(url, json=data, headers=headers)
    if res.status_code == 200:
        print(f"Seller responded")
    else:
        print(f"Failed to respond: {res.text}")
        sys.exit(1)

def admin_resolve(token, dispute_id):
    url = f"{BASE_URL}/disputes/{dispute_id}/resolve"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"resolution": "RESOLVED"}
    res = requests.post(url, json=data, headers=headers)
    if res.status_code == 200:
        print(f"Admin resolved dispute")
    else:
        print(f"Failed to resolve: {res.text}")
        sys.exit(1)

def main():
    # 1. Register Users
    register("buyer_flow@example.com", "pass", "Buyer", "Buyer Flow")
    register("seller_flow@example.com", "pass", "Seller", "Seller Flow")
    register("admin_flow@example.com", "pass", "Admin", "Admin Flow")

    # 2. Login
    buyer_token = login("buyer_flow@example.com", "pass")
    seller_token = login("seller_flow@example.com", "pass")
    admin_token = login("admin_flow@example.com", "pass")

    # 3. Seed Orders for Buyer (needs a seller to exist, which we have)
    seed_orders(buyer_token)
    
    # 4. Get Orders and pick one
    orders = get_orders(buyer_token)
    if not orders:
        print("No orders found for buyer")
        sys.exit(1)
    
    order_id = orders[0]['id']
    print(f"Using Order ID: {order_id}")

    # 5. Create Dispute
    dispute_id = create_dispute(buyer_token, order_id)

    # 6. Seller Respond
    seller_respond(seller_token, dispute_id)

    # 7. Admin Resolve
    admin_resolve(admin_token, dispute_id)

    print("\nSUCCESS: End-to-end flow verified!")

if __name__ == "__main__":
    main()
