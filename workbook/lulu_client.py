"""
Lulu Print API Client for The Sound of Essentials: Rhythm Quest

Official API Documentation: https://api.lulu.com/docs/
OpenAPI Spec: https://api.lulu.com/api-docs/openapi-specs/openapi_public.yml
"""

import os
import sys
import json
import time
import base64
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from typing import Dict, List, Optional, Any, Union

# ── Canonical SOE Lulu POD Package Identifiers (Dotted Format) ─────────────
# 8.5" x 11" Full Color, Standard Ink, 60# White Uncoated Paper
PACKAGE_WORKBOOK_PAPERBACK_MATTE = "0850X1100.FC.STD.PB.060UW444.MXX"
PACKAGE_WORKBOOK_PAPERBACK_GLOSS = "0850X1100.FC.STD.PB.060UW444.GXX"
PACKAGE_WORKBOOK_COIL_GLOSS      = "0850X1100.FC.STD.CO.060UW444.GXX"
PACKAGE_WORKBOOK_COIL_MATTE      = "0850X1100.FC.STD.CO.060UW444.MXX"

# Canonical SOE Rhythm Ready Workbook Page Count
SOE_WORKBOOK_PAGE_COUNT = 454

DEFAULT_USER_AGENT = "SOE-LuluClient/1.0 (Windows NT 10.0; Win64; x64) Python/3.14"


def _load_env_file():
    """Load key-value pairs from .env into os.environ if present."""
    search_dirs = [
        Path(__file__).resolve().parent,
        Path(__file__).resolve().parent.parent,
        Path.cwd(),
    ]
    for d in search_dirs:
        env_file = d / ".env"
        if env_file.is_file():
            try:
                with open(env_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k, v = k.strip(), v.strip().strip("\"'")
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass
            break


class LuluClient:
    """Client for authenticating and interacting with the Lulu Print API."""

    def __init__(
        self,
        client_key: Optional[str] = None,
        client_secret: Optional[str] = None,
        environment: str = "production",
        user_agent: str = DEFAULT_USER_AGENT
    ):
        _load_env_file()
        self.client_key = client_key or os.environ.get("LULU_CLIENT_KEY", "").strip()
        self.client_secret = client_secret or os.environ.get("LULU_CLIENT_SECRET", "").strip()
        self.environment = environment or os.environ.get("LULU_ENV", "production").strip().lower()
        self.user_agent = user_agent

        if self.environment == "sandbox":
            self.base_url = "https://api.sandbox.lulu.com"
            self.token_url = "https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"
        else:
            self.base_url = "https://api.lulu.com"
            self.token_url = "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"

        if not self.client_key or not self.client_secret:
            raise ValueError(
                "Lulu credentials missing! Provide client_key and client_secret or set "
                "LULU_CLIENT_KEY and LULU_CLIENT_SECRET in your .env file."
            )

        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0.0

    def get_access_token(self, force_refresh: bool = False) -> str:
        """Fetch or return cached OAuth 2.0 Bearer access token."""
        now = time.time()
        if not force_refresh and self._access_token and now < (self._token_expires_at - 60):
            return self._access_token

        credentials = f"{self.client_key}:{self.client_secret}"
        b64_creds = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

        headers = {
            "Authorization": f"Basic {b64_creds}",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": self.user_agent
        }

        data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode("utf-8")
        req = urllib.request.Request(self.token_url, data=data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req) as resp:
                resp_json = json.loads(resp.read().decode("utf-8"))
                self._access_token = resp_json["access_token"]
                expires_in = resp_json.get("expires_in", 3600)
                self._token_expires_at = now + expires_in
                return self._access_token
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Lulu OAuth authentication failed ({e.code} {e.reason}): {error_body}") from e

    def _request(
        self,
        endpoint: str,
        method: str = "GET",
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute an authenticated request against the Lulu Print API."""
        token = self.get_access_token()
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        if params:
            url += f"?{urllib.parse.urlencode(params)}"

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": self.user_agent
        }

        body_bytes = json.dumps(data).encode("utf-8") if data is not None else None
        req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req) as resp:
                resp_bytes = resp.read()
                if not resp_bytes:
                    return {}
                return json.loads(resp_bytes.decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Lulu API error {e.code} on {method} {url}: {err_body}") from e

    # ── Print Job Endpoints ──────────────────────────────────────────────────

    def list_print_jobs(
        self,
        page: int = 1,
        page_size: int = 100,
        status: Optional[str] = None,
        search: Optional[str] = None,
        created_after: Optional[str] = None
    ) -> Dict[str, Any]:
        """List print jobs associated with this developer account."""
        params = {"page": page, "page_size": page_size}
        if status:
            params["status"] = status
        if search:
            params["search"] = search
        if created_after:
            params["created_after"] = created_after
        return self._request("/print-jobs/", method="GET", params=params)

    def get_print_job(self, job_id: Union[int, str]) -> Dict[str, Any]:
        """Retrieve details of a specific print job by ID."""
        return self._request(f"/print-jobs/{job_id}/", method="GET")

    def get_print_job_status(self, job_id: Union[int, str]) -> Dict[str, Any]:
        """Retrieve current lifecycle status of a print job."""
        return self._request(f"/print-jobs/{job_id}/status/", method="GET")

    def get_print_job_costs(self, job_id: Union[int, str]) -> Dict[str, Any]:
        """Retrieve itemized cost breakdown of an existing print job."""
        return self._request(f"/print-jobs/{job_id}/costs/", method="GET")

    def cancel_print_job(self, job_id: Union[int, str]) -> Dict[str, Any]:
        """Cancel a print job (only valid before production commences)."""
        return self._request(f"/print-jobs/{job_id}/status/", method="POST", data={"name": "CANCELED"})

    def get_print_job_statistics(self) -> Dict[str, Any]:
        """Retrieve aggregated job count statistics by status."""
        return self._request("/print-jobs/statistics/", method="GET")

    # ── Calculations & Dimensions ────────────────────────────────────────────

    def calculate_costs(
        self,
        line_items: List[Dict[str, Any]],
        shipping_address: Dict[str, Any],
        shipping_option: str = "MAIL"
    ) -> Dict[str, Any]:
        """
        Calculate production, fulfillment, tax, and shipping costs without creating a job.
        
        line_items example:
          [{"page_count": 454, "pod_package_id": PACKAGE_WORKBOOK_PAPERBACK_MATTE, "quantity": 1}]
        """
        payload = {
            "line_items": line_items,
            "shipping_address": shipping_address,
            "shipping_option": shipping_option
        }
        return self._request("/print-job-cost-calculations/", method="POST", data=payload)

    def calculate_cover_dimensions(
        self,
        pod_package_id: str,
        interior_page_count: int,
        unit: str = "inch"
    ) -> Dict[str, Any]:
        """
        Query Lulu's live engine for exact required cover dimensions (width, height, spine).
        """
        payload = {
            "pod_package_id": pod_package_id,
            "interior_page_count": interior_page_count,
            "unit": unit
        }
        return self._request("/cover-dimensions/", method="POST", data=payload)

    def get_shipping_options(
        self,
        currency: str = "USD",
        line_items: Optional[List[Dict[str, Any]]] = None,
        shipping_address: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Retrieve available shipping carriers, speeds, and costs."""
        payload: Dict[str, Any] = {"currency": currency}
        if line_items:
            payload["line_items"] = line_items
        if shipping_address:
            payload["shipping_address"] = shipping_address
        return self._request("/shipping-options/", method="POST", data=payload)

    # ── Print Job Creation ───────────────────────────────────────────────────

    def create_print_job(
        self,
        external_id: str,
        line_items: List[Dict[str, Any]],
        shipping_address: Dict[str, Any],
        shipping_level: str = "MAIL",
        contact_email: Optional[str] = None,
        production_delay: int = 120
    ) -> Dict[str, Any]:
        """
        Submit a production print job to Lulu.
        
        line_items require:
          - title: str
          - cover: URL string
          - interior: URL string
          - pod_package_id: str
          - quantity: int
        """
        payload: Dict[str, Any] = {
            "external_id": external_id,
            "line_items": line_items,
            "shipping_address": shipping_address,
            "shipping_level": shipping_level,
            "production_delay": production_delay
        }
        if contact_email:
            payload["contact_email"] = contact_email
        return self._request("/print-jobs/", method="POST", data=payload)


# ── Quick Verification CLI ───────────────────────────────────────────────────

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Lulu Print API Client CLI for SOE")
    parser.add_argument("--test", action="store_true", help="Test OAuth connection and list print jobs")
    parser.add_argument("--calc-costs", action="store_true", help="Calculate costs for 454p SOE Workbook")
    parser.add_argument("--cover-dims", action="store_true", help="Calculate exact cover dimensions")
    args = parser.parse_args()

    client = LuluClient()
    print(f"Connecting to Lulu Print API ({client.environment})...")
    token = client.get_access_token()
    print("Authentication SUCCESS! Bearer token obtained.")

    if args.cover_dims or (not args.test and not args.calc_costs):
        print("\n--- Cover Dimensions for SOE 454-Page Deliverables ---")
        pb_dim = client.calculate_cover_dimensions(PACKAGE_WORKBOOK_PAPERBACK_MATTE, SOE_WORKBOOK_PAGE_COUNT, unit="inch")
        print(f"Paperback (454p): {pb_dim['width']}\" x {pb_dim['height']}\" ({pb_dim['unit']})")

        coil_dim = client.calculate_cover_dimensions(PACKAGE_WORKBOOK_COIL_GLOSS, SOE_WORKBOOK_PAGE_COUNT, unit="inch")
        print(f"Coil Bound (454p): {coil_dim['width']}\" x {coil_dim['height']}\" ({coil_dim['unit']})")

    if args.calc_costs or (not args.test and not args.cover_dims):
        print("\n--- Live Cost Calculation (Beverly Hills, CA 90210) ---")
        sample_address = {
            "name": "Sound of Essentials Demo",
            "street1": "123 Main Street",
            "city": "Beverly Hills",
            "state_code": "CA",
            "postcode": "90210",
            "country_code": "US",
            "phone_number": "555-555-5555"
        }
        # 1. Paperback
        pb_items = [{"page_count": SOE_WORKBOOK_PAGE_COUNT, "pod_package_id": PACKAGE_WORKBOOK_PAPERBACK_MATTE, "quantity": 1}]
        pb_costs = client.calculate_costs(pb_items, sample_address, shipping_option="MAIL")
        print(f"Paperback (454p): Unit Print = ${pb_costs['line_item_costs'][0]['unit_tier_cost']} | Fulfillment = ${pb_costs['fulfillment_cost']['total_cost_excl_tax']} | Shipping = ${pb_costs['shipping_cost']['total_cost_excl_tax']} | Total = ${pb_costs['total_cost_incl_tax']} {pb_costs['currency']}")

        # 2. Coil
        coil_items = [{"page_count": SOE_WORKBOOK_PAGE_COUNT, "pod_package_id": PACKAGE_WORKBOOK_COIL_GLOSS, "quantity": 1}]
        coil_costs = client.calculate_costs(coil_items, sample_address, shipping_option="MAIL")
        print(f"Coil Bound (454p): Unit Print = ${coil_costs['line_item_costs'][0]['unit_tier_cost']} | Fulfillment = ${coil_costs['fulfillment_cost']['total_cost_excl_tax']} | Shipping = ${coil_costs['shipping_cost']['total_cost_excl_tax']} | Total = ${coil_costs['total_cost_incl_tax']} {coil_costs['currency']}")

    if args.test:
        jobs = client.list_print_jobs(page_size=5)
        print(f"\nAccount Print Jobs Count: {jobs.get('count', 0)}")


if __name__ == "__main__":
    main()
