import google.generativeai as genai
from config.settings import GEMINI_API_KEY

def get_ai_recommendation(prompt):
    if not GEMINI_API_KEY:
        return "Error: Gemini API key is missing. Please check your .env file."
        
    try:
        # Configure the API key
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Initialize the model 
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        print("Sending prompt to Gemini API...")
        # Generate the response
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        error_msg = f"Error calling Gemini API: {e}"
        print(error_msg)
        return error_msg
