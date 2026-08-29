import { Platform } from 'react-native';

// PHYSICAL_DEVICE_IP: Set this to your local computer's LAN IP address (e.g., '192.168.1.10')
// if you are testing on a physical mobile device connected to the same Wi-Fi network.
// If left empty/null, it defaults to standard emulator/simulator loopback IPs.
const PHYSICAL_DEVICE_IP: string | null = null; 

const getHostIP = (port: number) => {
  if (PHYSICAL_DEVICE_IP) {
    return `http://${PHYSICAL_DEVICE_IP}:${port}`;
  }
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${port}`; // Android Emulator loopback
  }
  return `http://localhost:${port}`; // iOS Simulator / Web
};

export const MAPS_CONFIG = {
  // Backend API connection
  BACKEND_BASE_URL: getHostIP(5000),

  // OSRM Self-hosted configuration
  // Recommended local OSRM Docker container mapping: -p 5001:5000
  OSRM_BASE_URL: getHostIP(5001),
  OSRM_PROFILE: 'foot', // single verified routing profile, configurable

  // Default Map center region (Bhopal, Madhya Pradesh, India)
  DEFAULT_REGION: {
    latitude: 23.2599,
    longitude: 77.4126,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
};
