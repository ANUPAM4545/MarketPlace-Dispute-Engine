import os
import json
import google.generativeai as genai
from openai import OpenAI

# Detect AI Provider
GROK_API_KEY = os.environ.get("GROK_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Initialize Clients
grok_client = None
if GROK_API_KEY:
    try:
        grok_client = OpenAI(
            api_key=GROK_API_KEY,
            base_url="https://api.x.ai/v1",
        )
    except Exception:
        grok_client = None

gemini_model = None
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception:
        gemini_model = None

def analyze_dispute_with_ai(dispute_data):
    """
    Analyzes a dispute using either Grok or Gemini AI.
    Falls back to a smart simulation if no keys are present.
    """
    # Preference: Grok > Gemini > Simulation
    if grok_client:
        return analyze_with_grok(dispute_data)
    elif gemini_model:
        return analyze_with_gemini(dispute_data)
    else:
        return simulate_ai_analysis(dispute_data)

def analyze_with_grok(dispute_data):
    """Call Grok (xAI) API"""
    prompt = f"""
    You are an AI Dispute Analyst for an E-commerce marketplace.
    Analyze this case and respond ONLY with a JSON object.
    
    Buyer Complaint: {dispute_data.get('description')}
    Seller Response: {dispute_data.get('seller_response', 'No response yet')}
    Category: {dispute_data.get('category')}
    
    JSON format: {{"recommendation": "RESOLVED" or "REJECTED", "analysis": "2 sentence logic"}}
    """
    try:
        completion = grok_client.chat.completions.create(
            model="grok-beta",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Grok API error: {e}")
        if gemini_model: return analyze_with_gemini(dispute_data)
        return simulate_ai_analysis(dispute_data)

def analyze_with_gemini(dispute_data):
    """Call Gemini API"""
    prompt = f"""
    Analyze this e-commerce dispute and respond ONLY with JSON:
    Buyer: {dispute_data.get('description')}
    Seller: {dispute_data.get('seller_response', 'No response yet')}
    
    Format: {{"recommendation": "RESOLVED/REJECTED", "analysis": "2 sentences"}}
    """
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API error: {e}")
        return simulate_ai_analysis(dispute_data)

def simulate_ai_analysis(dispute_data):
    """Smart simulation mode"""
    category = dispute_data.get('category')
    desc = dispute_data.get('description', '').lower()
    
    if "damaged" in desc or "broken" in desc:
        return {
            "recommendation": "RESOLVED",
            "analysis": "SIMULATED AI: Visual damage patterns reported by the buyer are consistent with transit-related impact. Recommending refund via logistics insurance."
        }
    
    return {
        "recommendation": "REJECTED",
        "analysis": "SIMULATED AI: Insufficient evidence provided to override the standard transaction completion. Maintaining seller protection."
    }
