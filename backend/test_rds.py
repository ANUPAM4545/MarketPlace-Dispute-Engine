import psycopg2
import os

# CONFIGURATION - Update these with your values
DB_HOST = "marketplacedatabase.c70ic4e228xr.ap-south-1.rds.amazonaws.com"
DB_NAME = "postgres"
DB_USER = "MarketPlace"
DB_PASS = input("Enter your database password: ")

try:
    print(f"Connecting to {DB_HOST}...")
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port="5432",
        connect_timeout=10
    )
    print("✅ SUCCESS: Connected to RDS PostgreSQL!")
    
    cur = conn.cursor()
    cur.execute("SELECT version();")
    record = cur.fetchone()
    print(f"You are connected to: {record}")
    
    cur.close()
    conn.close()
    print("Connection closed.")

except Exception as e:
    print("❌ ERROR: Could not connect to RDS.")
    print(f"Error details: {e}")
    print("\nTroubleshooting tips:")
    print("1. Ensure 'Public access' is set to 'Yes' in the RDS console.")
    print("2. Check that the Security Group allows inbound traffic on port 5432 for your IP.")
