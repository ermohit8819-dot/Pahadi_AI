import os
from typing import Dict, Any, List

def generate_gov_response(query: str, language: str, context_chunks: List[Dict[str, Any]]) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Grounding context
    context_str = "\n\n".join([f"[{c['title']}]\n{c['text']}" for c in context_chunks])
    
    if not api_key:
        if language == "garhwali":
            return (
                "नमस्कार दाज्यू! आय प्रमाण पत्र खातिर जरूरी कागज: आधार कार्ड, पटवारी आख्या, "
                "राशन कार्ड और शपथ पत्र छन। अपणि सरकार पोर्टल (eservices.uk.gov.in) पर अर्जी लगा सकदा छा। "
                "15 दिन म काम होइ जालो अर सरकारी खर्चा ₹30 च।"
            )
        elif language == "kumaoni":
            return (
                "पैलाग दाज्यू! आय प्रमाण पत्र खातिर खास कागज: आधार कार्ड, पटवारी तसदीक, राशन कार्ड अर "
                "शपथ पत्र छन। 15 दिनक भीतर अपणि सरकार पोर्टल (eservices.uk.gov.in) बटि प्रमाणपत्र मिल जाल।"
            )
        elif language == "en":
            return (
                "Greetings! For an Income Certificate in Uttarakhand, you require: Aadhaar Card, "
                "Patwari Verification Report, Ration Card/Parivar Register copy, and Self-declaration. "
                "Application fee is ₹30 at CSC, and processing time is 15 working days under the Right to Service Act. "
                "Apply online at eservices.uk.gov.in."
            )
        return (
            "जी, मैं आपकी मदद कर सकता हूँ। आय प्रमाण पत्र के लिए जरूरी दस्तावेज और प्रक्रिया:\n"
            "1. आधार कार्ड\n2. पटवारी आख्या / वेतन पर्ची\n3. राशन कार्ड अथवा परिवार रजिस्टर नकल\n"
            "4. स्व-घोषणा पत्र\n\n"
            "सरकारी शुल्क ₹30 (सीएससी केंद्र) अथवा पोर्टल पर ₹0 है। सेवा का अधिकार अधिनियम अंतर्गत यह 15 कार्यदिवस में जारी होता है। "
            "आप ऑनलाइन आवेदन करना चाहते हैं या नजदीकी सेवा केंद्र की जानकारी चाहते हैं?"
        )
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        system_instruction = (
            "You are Pahadi SevaVaani, official voice assistant for Uttarakhand Citizen Services. "
            "Tone: Warm, courteous, respectful Pahadi heritage. "
            "Always state official requirements: Aadhaar, Patwari report, ₹30 fee, 15 days timeline, eservices.uk.gov.in."
        )
        
        prompt = f"Official Knowledge:\n{context_str}\n\nCitizen Query: {query}\nLanguage: {language}"
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config={"system_instruction": system_instruction}
        )
        return response.text
    except Exception as e:
        print(f"Gemini error: {e}")
        return "नमस्कार! सेवा का अधिकार अधिनियम 2011 के अंतर्गत सभी प्रमाण पत्र 15 दिनों में अपणि सरकार पोर्टल (eservices.uk.gov.in) से बनते हैं।"
