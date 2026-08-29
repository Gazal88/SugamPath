import { LocationService } from '../locationService';

// Test suite for LocationService validation
const runTests = () => {
  const tests = [
    { lat: 30.7415, lng: 76.7825, expected: true, label: "Valid coordinates (Chandigarh)" },
    { lat: 0, lng: 0, expected: true, label: "Valid coordinates (Equator/Meridian)" },
    { lat: -90, lng: 180, expected: true, label: "Valid boundary limits" },
    { lat: -90.1, lng: 76.78, expected: false, label: "Latitude below -90 boundary" },
    { lat: 90.1, lng: 76.78, expected: false, label: "Latitude above 90 boundary" },
    { lat: 30.74, lng: -180.1, expected: false, label: "Longitude below -180 boundary" },
    { lat: 30.74, lng: 180.1, expected: false, label: "Longitude above 180 boundary" },
    { lat: null as any, lng: 76.78, expected: false, label: "Null latitude check" },
    { lat: 30.74, lng: undefined as any, expected: false, label: "Undefined longitude check" },
    { lat: NaN, lng: 76.78, expected: false, label: "NaN coordinate check" },
  ];

  let failures = 0;
  console.log("Running LocationService tests...\n");

  tests.forEach((t, i) => {
    const result = LocationService.isValidCoordinate(t.lat, t.lng);
    if (result === t.expected) {
      console.log(`✓ Test ${i + 1} passed: ${t.label}`);
    } else {
      console.error(`✗ Test ${i + 1} FAILED: ${t.label}. Expected ${t.expected}, got ${result}`);
      failures++;
    }
  });

  if (failures === 0) {
    console.log("\nAll LocationService tests completed successfully!");
  } else {
    console.error(`\nCompleted with ${failures} failure(s).`);
    process.exit(1);
  }
};

runTests();
