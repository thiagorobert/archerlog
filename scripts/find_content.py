import os
import re
import requests
import subprocess
import sys
from tabulate import tabulate
import time
import urllib.parse

ROOT = "/home/thiago/workspace/sf_history/crawler"
CONTENT_ROOT = os.path.join(ROOT, "data")
FAVORITES_FILE = os.path.join(ROOT, "scripts", "favorites.txt")
OUTPUT_PATH = os.path.join(ROOT, "scripts", "addresses.txt")
LIMIT = 25000
REGEX_IMAGE_NAME = r'.*(wnp.*jpg).*'
REGEX_ADDRESS = r'.*alt="(.*)"\swidth.*'
SHOW_IMAGES = False

def main():
    favorites = []
    with open(FAVORITES_FILE) as f:
        for l in f.readlines():
            parts = l.split("__")
            favorites.append(parts[1].strip("\n"))

    nfound = 0
    nfiles = 0

    for root, dirs, files in os.walk(CONTENT_ROOT):
        if dirs:
            continue  # find leafs

        content = []
        known_addresses = []
        for fname in files:
            if nfound > LIMIT:
                break

            if not fname.endswith(".html"):
                continue

            nfiles += 1

            with open(os.path.join(root, fname)) as f:
                lines = []
                try:
                    lines = f.readlines()
                except UnicodeDecodeError as e:
                    print("*** error decoding %s" % fname)

                for l in lines:
                    if "Ave" in l or "St" in l or " at " in l or " near ":
                        image_match = re.match(REGEX_IMAGE_NAME, l)
                        address_match = re.match(REGEX_ADDRESS, l)
                        if image_match and address_match:
                            address = address_match.group(1)
                            image_name = image_match.group(1)
                            image_path = os.path.join(CONTENT_ROOT, "DOWNLOAD__%s" % image_name)
                            # if image_name in favorites and os.path.isfile(image_path) and address not in known_addresses \
                            if os.path.isfile(image_path) and address not in known_addresses \
                                  and ("&" in address or "near" in address or "at" or str.isdigit(address[0])):
                                content.append((image_path, address))
                                known_addresses.append(address)
                                nfound += 1

        output = []
        for t in content:
            image_path = t[0]
            address = t[1]
            url = 'https://nominatim.openstreetmap.org/search/' + urllib.parse.quote(address) +'?format=json'
            response = requests.get(url).json()
            if len(response) < 1:
                print("** no lat long for: %s" % address)
                continue
            latlon = "%s %s" % (response[0]["lat"], response[0]["lon"])
            if SHOW_IMAGES:
                print(" ++ %s" % image_path)
                print("%s" % address)
                print("%s\n\n" % latlon)
                os.system("eog -f -g -w %s" % image_path)
                time.sleep(4)
            output.append((image_path, address, latlon))

        with open(OUTPUT_PATH, 'w') as f:
            f.write(tabulate(output, headers=["File path", "Address", "Lat Long"]))

    print("%d favorites." % len(favorites))
    print("%d files processed." % nfiles)
    print("%d found." % nfound)


if __name__ == "__main__":
    sys.exit(main())
