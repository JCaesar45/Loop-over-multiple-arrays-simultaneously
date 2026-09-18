# Aurum Atelier

A luxury conversion engine built as a single-file front end with API-ready backend services.

## Run

1. Create a virtual environment.
2. Install requirements.
3. Start the API and front of house.

Commands:

python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000

## Endpoints

GET /
GET /api/health
GET /api/products
POST /api/leads
GET /api/leads

## Java catalog

javac java/CatalogMain.java
java -cp java CatalogMain

## TypeScript

npx tsc web/src/aurum.ts --noEmit --strict --target es2022 --module es2022
EOF

echo "Generated $OUTPUT"
```

## References

Cialdini, R. B. (2007). *Influence: The psychology of persuasion* (Rev. ed.). Harper Business.

Ecma International. (2024). *ECMAScript 2024 language specification* (ECMA-262). https://tc39.es/ecma262/

Microsoft. (n.d.). *TypeScript documentation*. Retrieved September 18, 2026, from https://www.typescriptlang.org/docs/

Mozilla Developer Network. (n.d.). *CSS: Cascading Style Sheets*. Mozilla. Retrieved September 18, 2026, from https://developer.mozilla.org/en-US/docs/Web/CSS

Mozilla Developer Network. (n.d.). *HTML: HyperText Markup Language*. Mozilla. Retrieved September 18, 2026, from https://developer.mozilla.org/en-US/docs/Web/HTML

Mozilla Developer Network. (n.d.). *JavaScript*. Mozilla. Retrieved September 18, 2026, from https://developer.mozilla.org/en-US/docs/Web/JavaScript

Nielsen Norman Group. (2012, January 29). *Usability 101: Introduction to usability*. https://www.nngroup.com/articles/usability-101/

Oracle. (2023). *Java 21 documentation*. https://docs.oracle.com/en/java/javase/21/

Ramírez, S. (n.d.). *FastAPI*. Retrieved September 18, 2026, from https://fastapi.tiangolo.com/

W3C. (2023, October 5). *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C. https://www.w3.org/TR/WCAG22/

WHATWG. (n.d.). *HTML Living Standard*. Retrieved September 18, 2026, from https://html.spec.whatwg.org/
