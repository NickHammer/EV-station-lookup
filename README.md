# ⚡ EV Charging Stations Map

This lightweight web app shows nearby EV charging stations on an interactive map, based on your geolocation. You can select your electric vehicle to filter out incompatible chargers (e.g., CCS, CHAdeMO, Tesla Supercharger).

![screenshot](map.png)

---

## 🚀 Features

- Uses Leaflet.js and OpenStreetMap tiles
- Locates you using browser geolocation
- Queries live station data from the OpenChargeMap API
- Filters results by compatible connector type

---

## 🛠 How to Run Locally
1. Retrieve an API key from OpenChargeMap. Hard code it on line 42 of script.js
2. In vscode, install the live server extension by Ritwick Dey. Right click your index.html and select "Open with Live Server"

### 1. Clone the Repo

```bash
git clone https://github.com/NickHammer/EV-station-lookup.git
cd EV-station-lookup
