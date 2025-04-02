import spacy

# Load the pre-trained SpaCy model
nlp = spacy.load("en_core_web_sm")

def detect_pii(text: str) -> list:
    """Detect PII entities in the given text."""
    doc = nlp(text)
    pii_entities = []
    for ent in doc.ents:
        # Add more labels for PII detection as needed
        if ent.label_ in ['PERSON', 'GPE', 'ORG', 'DATE', 'LOC']:
            pii_entities.append({"text": ent.text, "label": ent.label_})
    return pii_entities
