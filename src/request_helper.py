import requests
import requests_cache

from print_helper import colors

TIMEOUT = 5

requests_cache.install_cache("github_cache", backend="sqlite", expire_after=3600)


def get(url, params={}, auth=None):
    try:
        print("\nRequest for url:", url, "...")
        response = requests.get(url, params=params, timeout=TIMEOUT, auth=auth)
        print("Response status:", response.status_code)
        response.raise_for_status()

        used_cache = response.from_cache
        print(f"Request used cache: {used_cache}")

        data = response.json()
        print(f"{colors.SUCCESS}Successfully fetched data{colors.NORMAL}\n",)

        return data
    except requests.exceptions.HTTPError as errh:
        if response.status_code == 404:
            print(f"{colors.WARNING}Warning: 404 Not found for {url}{colors.NORMAL}")
            return None
        print(f"{colors.ERROR}Http Error:{colors.NORMAL}", errh)
    except requests.exceptions.ConnectionError as errc:
        print(f"{colors.ERROR}Error Connecting:{colors.NORMAL}", errc)
    except requests.exceptions.Timeout as errt:
        print(f"{colors.ERROR}Timeout Error:{colors.NORMAL}", errt)
    except requests.exceptions.RequestException as err:
        print(f"{colors.ERROR}Request error:{colors.NORMAL}", err)
    except ValueError as errv:
        print(f"{colors.ERROR}Error decoding JSON response:{colors.NORMAL}", errv)
    except Exception as e:
        print(f"{colors.ERROR}Unexpected error{colors.NORMAL}:", e)
    return None
