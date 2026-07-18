import { getDeviceId } from "./device";

export function getDeviceInfo() {
  return {
    deviceId: getDeviceId(),
    deviceName: navigator.platform,
    browser: navigator.userAgent,
    os: navigator.platform,
  };
}