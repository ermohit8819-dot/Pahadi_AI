import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "pahadi_sevavaani.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name_hi TEXT,
        name_en TEXT,
        name_garhwali TEXT,
        name_kumaoni TEXT,
        department_hi TEXT,
        department_en TEXT,
        category TEXT,
        summary_hi TEXT,
        eligibility_json TEXT,
        documents_json TEXT,
        official_fee TEXT,
        timeline_days INTEGER,
        official_portal_url TEXT,
        offline_center TEXT,
        keywords_json TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT,
        department TEXT,
        category TEXT,
        content TEXT,
        source_url TEXT,
        date_added TEXT,
        file_type TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS call_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        call_sid TEXT,
        caller_number TEXT,
        spoken_text TEXT,
        response_text TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    conn.close()

def seed_sample_services():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if empty
    cursor.execute("SELECT COUNT(*) FROM services")
    count = cursor.fetchone()[0]
    if count == 0:
        sample_services = [
            (
                "income-cert",
                "आय प्रमाण पत्र",
                "Income Certificate",
                "आय प्रमाण पत्र (कमाइ को पर्चो)",
                "आय प्रमाण पत्र (कमाइ को कागज)",
                "राजस्व विभाग, उत्तराखण्ड सरकार",
                "Revenue Department, Govt of Uttarakhand",
                "certificate",
                "छात्रवृत्ति, सरकारी योजनाओं और आर्थिक सहायता हेतु परिवार की वार्षिक आय का आधिकारिक प्रमाण पत्र।",
                json.dumps(["उत्तराखण्ड का स्थायी अथवा सामान्य निवासी", "परिवार की कुल वार्षिक आय का विवरण"]),
                json.dumps(["आधार कार्ड", "वेतन पर्ची / पटवारी आख्या", "राशन कार्ड या परिवार रजिस्टर नकल", "स्व-घोषणा पत्र"]),
                "₹30 (सीएससी केंद्र) | ₹0 (ऑनलाइन पोर्टल)",
                15,
                "https://eservices.uk.gov.in",
                "निकटतम तहसील अथवा सीएससी केंद्र",
                json.dumps(["आय", "income", "salary", "patwari", "कमाई"])
            ),
            (
                "caste-cert",
                "जाति प्रमाण पत्र (SC/ST/OBC)",
                "Caste Certificate",
                "जाति प्रमाण पत्र",
                "जात प्रमाणपत्र",
                "राजस्व विभाग, उत्तराखण्ड सरकार",
                "Revenue Department, Govt of Uttarakhand",
                "certificate",
                "आरक्षण एवं सरकारी कल्याणकारी योजनाओं का लाभ प्राप्त करने हेतु।",
                json.dumps(["उत्तराखण्ड में अधिसूचित आरक्षित श्रेणी का नागरिक", "1985 से पूर्व निवास साक्ष्य"]),
                json.dumps(["आधार कार्ड", "पिता या पूर्वज का भू-अभिलेख/जाति प्रमाण", "मूल निवास प्रमाण पत्र", "परिवार रजिस्टर नकल"]),
                "₹30 (सीएससी केंद्र)",
                15,
                "https://eservices.uk.gov.in",
                "उप-जिलाधिकारी (SDM) / तहसील",
                json.dumps(["जाति", "caste", "obc", "sc", "st", "आरक्षण"])
            )
        ]
        
        cursor.executemany("""
        INSERT INTO services VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_services)
        conn.commit()
        
    conn.close()

def get_all_services() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services")
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "name": {
                "hi": r["name_hi"],
                "en": r["name_en"],
                "garhwali": r["name_garhwali"],
                "kumaoni": r["name_kumaoni"]
            },
            "department": {"hi": r["department_hi"], "en": r["department_en"]},
            "category": r["category"],
            "summary": {"hi": r["summary_hi"]},
            "eligibility": json.loads(r["eligibility_json"]),
            "requiredDocuments": json.loads(r["documents_json"]),
            "officialFee": r["official_fee"],
            "timelineDays": r["timeline_days"],
            "officialPortalUrl": r["official_portal_url"],
            "offlineCenter": r["offline_center"],
            "keywords": json.loads(r["keywords_json"])
        })
    return results
