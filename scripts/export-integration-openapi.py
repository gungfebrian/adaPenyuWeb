"""Export the public integration contracts from an AdaPenyu backend checkout."""

import argparse
import json
from pathlib import Path
import sys


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("backend", type=Path, help="Path to the backend checkout")
    args = parser.parse_args()
    sys.path.insert(0, str(args.backend.resolve()))

    from fastapi import FastAPI
    from app.api.integration import router as integration_router
    from app.api.responses import error_responses
    from app.api.v1.routers.organization_api_key import router as key_router

    app = FastAPI(title="AdaPenyu Integration API", version="1.0.0")
    app.include_router(integration_router)
    app.include_router(key_router, prefix="/api/v1", responses=error_responses(401, 413, 500))

    spec = app.openapi()
    spec["servers"] = [{"url": "https://api.example.com", "description": "Replace with your organization’s API origin"}]
    destination = Path(__file__).resolve().parents[1] / "src/features/client-data-integration/openapi.json"
    destination.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
