# SENTINEL

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **AI Guardrail Stress-Tester** - The penetration testing tool for AI systems.

Discover jailbreaks, hallucinations, and safety vulnerabilities in AI systems before attackers do.

## Architecture

```
+------------------+     +-------------------+     +------------------+
|                  |     |                   |     |                  |
|   User/Client    +---->|    SENTINEL API   +---->|   Target AI      |
|                  |     |    (FastAPI)      |     |   System         |
+------------------+     +--------+----------+     +------------------+
                                  |
                                  v
                         +--------+----------+
                         |                   |
                         | Attack Vector DB  |
                         |                   |
                         | - Jailbreaks      |
                         | - Hallucinations  |
                         | - Prompt Inject.  |
                         +-------------------+

Scan Flow:
+----------+    +----------+    +----------+    +----------+
| Start    |--->| Execute  |--->| Analyze  |--->| Report   |
| Scan     |    | Attacks  |    | Responses|    | Results  |
+----------+    +----------+    +----------+    +----------+
```

## Quick Start

### Installation

```bash
# Clone and navigate to project
cd sentinel

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Server will be available at `http://localhost:8001`

### Using Docker

```bash
docker build -t sentinel .
docker run -p 8001:8001 sentinel
```

## API Endpoints

### Root

```
GET /
```

Returns API information and available endpoints.

### Start Security Scan

```
POST /api/scan
Content-Type: application/json

{
    "target_url": "https://api.example.com/v1/chat",
    "target_model": "gpt-4",
    "attack_categories": ["jailbreak", "hallucination", "prompt_injection"],
    "max_attacks": 50
}
```

**Response:**

```json
{
    "scan_id": "uuid",
    "target_url": "https://api.example.com/v1/chat",
    "status": "pending",
    "started_at": "2024-01-15T10:30:00Z"
}
```

### Get Scan Results

```
GET /api/scan/{scan_id}
```

Returns full scan results including vulnerabilities found.

### List Attack Vectors

```
GET /api/attack-vectors
```

Returns all available attack vectors in the database.

### Run Single Attack

```
POST /api/attack
Content-Type: application/json

{
    "target_url": "https://api.example.com/v1/chat",
    "attack_prompt": "Ignore previous instructions...",
    "target_model": "gpt-4"
}
```

### Generate Report

```
GET /api/report/{scan_id}
```

Generates a comprehensive security report for a completed scan.

## Attack Categories

| Category | Description | Severity |
|----------|-------------|----------|
| `jailbreak` | Attempts to bypass safety guidelines | Critical |
| `hallucination` | Tests for fabricated information | High |
| `prompt_injection` | Tests for instruction override attacks | Critical |

## Risk Scoring

- **Critical (70-100):** Immediate action required
- **High (40-70):** Significant vulnerabilities found
- **Medium (20-40):** Moderate issues detected
- **Low (0-20):** Minor concerns

## Screenshots

<!-- TODO: Add screenshots -->
```
[Screenshot: Scan Dashboard]
[Screenshot: Vulnerability Report]
[Screenshot: Attack Vector Library]
```

## Tech Stack

- **Framework:** FastAPI
- **Runtime:** Python 3.11+
- **Async:** Built on ASGI/Uvicorn
- **Validation:** Pydantic v2
- **HTTP Client:** httpx (async)
- **AI SDKs:** anthropic, openai, google-generativeai

## Environment Variables

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

## License

MIT License

---

**Author:** Ahmed Adel Bakr Alderai
