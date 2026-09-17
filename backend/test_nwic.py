import requests


NWIC_URL = (
    "https://nwdp.nwic.gov.in/"
    "dataset/river-water-level-telemetry-hourly-central-water-commission-cwc"
)


def test_nwic():

    print("Checking NWIC...")

    try:

        response = requests.get(
            NWIC_URL,
            timeout=20,
        )

        print("HTTP Status:", response.status_code)

        print(
            "Content-Type:",
            response.headers.get("content-type"),
        )

        print(
            "Response Size:",
            len(response.content),
            "bytes",
        )

        if response.ok:

            print("NWIC reachable: YES")

        else:

            print("NWIC reachable: NO")

    except Exception as error:

        print("NWIC request failed:")
        print(error)


if __name__ == "__main__":
    test_nwic()