# OSRM Self-Hosted Setup Guide

This document outlines instructions for setting up and running a self-hosted instance of OSRM (Open Source Routing Machine) locally using Docker. OSRM is used as the routing engine for SugamPath.

---

## Prerequisites

- **Docker Desktop** installed and running on your system (Windows/macOS/Linux).

---

## Step 1: Download OpenStreetMap Region Data

OSRM requires map extracts in `.osm.pbf` format. You can download regional maps from free providers like Geofabrik.

The default region for SugamPath is **Bhopal, Madhya Pradesh**.

Create a working directory (e.g., `C:\osrm` or `~/osrm`) and download the Madhya Pradesh regional map:

- **Madhya Pradesh extract** (Primary default region):
  [Download Madhya Pradesh .osm.pbf](https://download.geofabrik.de/asia/india/madhya-pradesh-latest.osm.pbf) (Rename to `region.osm.pbf`).

*(Optional alternative extracts like Chandigarh/Punjab or Delhi NCR can be downloaded from Geofabrik if needed, but Madhya Pradesh is the project default)*.

Place the downloaded file inside your OSRM directory:
```
osrm/
└── region.osm.pbf
```

---

## Step 2: Process the Map Data (OSRM Compiling)

Run the following Docker commands in sequence from your `osrm/` folder to compile and extract routing graphs for the **foot** profile:

### 1. Extract Profile Data
Extract routing segments based on speed and access restrictions defined in the foot speed profile:
```bash
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /profile/foot.lua /data/region.osm.pbf
```

### 2. Partition the Graph
Generate cell-structures necessary for routing calculations:
```bash
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/region.osm.pbf
```

### 3. Customize Cells
Determine shortest paths weights between intersections:
```bash
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/region.osm.pbf
```

---

## Step 3: Start OSRM Server

Run the routing engine server. We expose port `5001` on the host PC so that it does not conflict with the SugamPath Express Backend (which runs on port `5000` by default):

```bash
docker run -d -p 5001:5000 -v "${PWD}:/data" --name osrm-server osrm/osrm-backend osrm-routed --algorithm mld /data/region.osm.pbf
```

---

## Step 4: Verify the Installation

Test that OSRM is responding. Open your browser or run a curl command to check a route around central Bhopal:

```
http://localhost:5001/route/v1/foot/77.4126,23.2599;77.4200,23.2650?overview=full&geometries=geojson&steps=true
```

You should receive a JSON response containing route coordinate paths, distance, steps, and duration stats.

---

## Testing on Physical Devices

If you are running the app on a physical Android or iOS device rather than an emulator/simulator, follow these steps to connect the app to your local servers:

### 1. Connect to Same Wi-Fi
Ensure your physical phone and host computer running the servers are connected to the same local Wi-Fi network.

### 2. Configure Host IP
1. Find your computer's local IP address on the Wi-Fi network (e.g., `192.168.1.15` - this is an example IP only).
   - **Windows (PowerShell)**: Run `ipconfig` and look for `IPv4 Address` under your wireless adapter.
   - **macOS/Linux**: Run `ifconfig` or `ip a`.
2. In `src/config/maps.ts`, set the local/development variable `PHYSICAL_DEVICE_IP` to your IP:
   ```typescript
   // Replace with your local machine's IP (e.g., '192.168.1.15')
   const PHYSICAL_DEVICE_IP: string | null = 'YOUR_MACHINE_IP';
   ```

> [!WARNING]
> Do NOT commit or push your personal local IP address back to the remote Git repository. Keep `PHYSICAL_DEVICE_IP` set to `null` in the git history, and only set it locally during active debugging sessions on physical devices.

### 3. Adjust Firewall Settings
Ensure that your computer's firewall allows incoming connections on:
- Port `5000` (SugamPath Express Backend)
- Port `5001` (OSRM Docker Container)
