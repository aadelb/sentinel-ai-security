"""
Pytest configuration and fixtures for Sentinel tests.
"""
import sys
from pathlib import Path

import pytest
from httpx import AsyncClient, ASGITransport

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app, scans


@pytest.fixture
def anyio_backend():
    """Use asyncio as the async backend."""
    return "asyncio"


@pytest.fixture
async def client():
    """Async HTTP client fixture for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture(autouse=True)
def clear_scans():
    """Clear scans storage before each test."""
    scans.clear()
    yield
    scans.clear()
