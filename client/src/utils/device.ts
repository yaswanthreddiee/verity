import { v4 as uuid } from "uuid";

export function getDeviceId() {
  let id = localStorage.getItem("deviceId");

  if (!id) {
    id = uuid();
    localStorage.setItem("deviceId", id);
  }

  return id;
}