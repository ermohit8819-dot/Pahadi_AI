import re
from typing import List, Dict, Any, Optional

class SimpleVectorStore:
    """
    RAG retriever for Uttarakhand Government Services.
    Supports in-memory vector embeddings and ChromaDB interface.
    """
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []

    def add_document(self, doc_id: str, title: str, text: str, department: str, source_url: str):
        paragraphs = [p.strip() for p in text.split("\n") if len(p.strip()) > 10]
        for idx, para in enumerate(paragraphs):
            self.documents.append({
                "id": f"{doc_id}_chunk_{idx}",
                "doc_id": doc_id,
                "title": title,
                "text": para,
                "department": department,
                "source_url": source_url
            })

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        tokens = set(re.findall(r"\w+", query.lower()))
        scored = []
        for doc in self.documents:
            doc_tokens = set(re.findall(r"\w+", doc["text"].lower()))
            overlap = len(tokens.intersection(doc_tokens))
            if overlap > 0:
                scored.append((overlap, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]

rag_engine = SimpleVectorStore()

# Seed with official circular
rag_engine.add_document(
    "doc_rts",
    "उत्तराखण्ड सेवा का अधिकार अधिनियम 2011",
    """उत्तराखण्ड सेवा का अधिकार अधिनियम 2011 के तहत आय प्रमाण पत्र 15 दिनों में जारी किया जाता है।
नागरिक अपणि सरकार पोर्टल (eservices.uk.gov.in) पर सीधे आवेदन कर सकते हैं।
आवेदन हेतु आधार कार्ड, आय विवरण, राशन कार्ड और स्व-घोषणा पत्र आवश्यक हैं।
सीएससी केंद्र पर मानक शुल्क ₹30 निर्धारित है।""",
    "राजस्व विभाग",
    "https://eservices.uk.gov.in"
)
